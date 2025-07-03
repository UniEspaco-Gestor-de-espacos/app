<?php

namespace Database\Factories;

use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Espaco>
 */
class EspacoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome' => 'Sala ' . $this->faker->unique()->numberBetween(101, 599),
            'capacidade_pessoas' => $this->faker->numberBetween(10, 100),
            'descricao' => $this->faker->sentence(),
            'imagens' => null, // Pode ser preenchido com URLs de imagem se necessário
            'main_image_index' => null,
            'andar_id' => Andar::factory(),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (Espaco $espaco) {
            // Cria as 3 agendas (manhã, tarde, noite) para cada espaço
            $turnos = ['manha', 'tarde', 'noite'];
            foreach ($turnos as $turno) {
                Agenda::factory()->create([
                    'espaco_id' => $espaco->id,
                    'turno' => $turno,
                    'user_id' => User::pluck('id')->random(), // Inicia sem usuário responsável
                ]);
            }
        });
    }
}
