<?php

namespace Database\Factories;

use App\Models\Agenda;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Espaco;
use App\Models\User;
use App\Models\Horario;
use App\models\Reserva;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reserva>
 */
class ReservaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => fake()->word(),
            'descricao' => fake()->text(),
            'data_inicial' => now(),
            'data_final' => now()->addWeek(),
            'user_id' => User::pluck('id')->random(),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (Reserva $reserva) {
            $horarios = Horario::whereAgendaId(Agenda::pluck('id')->random())->inRandomOrder()->take(4)->pluck('id');
            $reserva->horarios()->attach($horarios);
        });
    }
}
