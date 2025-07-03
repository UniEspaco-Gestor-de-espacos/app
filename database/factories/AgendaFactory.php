<?php

namespace Database\Factories;

use App\Models\Agenda;
use App\Models\Espaco;
use App\Models\Horario;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agenda>
 */
class AgendaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // O turno será definido pelo EspacoFactory, mas aqui fica um padrão.
            'turno' => $this->faker->randomElement(['manha', 'tarde', 'noite']),
            'espaco_id' => Espaco::factory(),
            // A agenda pode ou não ter um usuário responsável inicialmente.
            'user_id' => User::pluck('id')->random(), // Se não houver usuários, será null
        ];
    }
    /**
     * Configura o factory para criar horários após a criação da agenda.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Agenda $agenda) {
            $user = User::whereId($agenda->user_id);
            $user->update(['permission_type_id' => 2]); // Define o tipo de permissão do usuário responsável como 3 (padrão)
            $horarios = [];

            // Define os horários de início com base no turno da agenda
            if ($agenda->turno === 'manha') {
                $horarios = ['08:00:00', '09:00:00', '10:00:00', '11:00:00'];
            } elseif ($agenda->turno === 'tarde') {
                $horarios = ['14:00:00', '15:00:00', '16:00:00', '17:00:00'];
            } else { // 'noite'
                $horarios = ['19:00:00', '20:00:00', '21:00:00'];
            }

            // Cria horários para os próximos 15 dias para ter dados para reservar
            for ($dias = 0; $dias < 15; $dias++) {
                $dataAtual = now()->addDays($dias);

                foreach ($horarios as $inicio) {
                    Horario::factory()->create([
                        'agenda_id' => $agenda->id,
                        'data' => $dataAtual->format('Y-m-d'),
                        'horario_inicio' => $inicio,
                        'horario_fim' => Carbon::parse($inicio)->addHour()->format('H:i:s'),
                    ]);
                }
            }
        });
    }
}
