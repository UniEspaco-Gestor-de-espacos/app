<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Espaco;
use App\Models\User;

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
            'idEspaco' => Espaco::pluck('id')->random(),
            'idSolicitante' => User::pluck('id')->random(),
            'titulo'=> fake()->word(),
            'descricao' => fake()->text(),
            'dataInicio' => now(),
            'dataFinal' => now()->addWeek()
        ];
    }
}
