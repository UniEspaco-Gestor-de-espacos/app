<?php

namespace Database\Factories;

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
            'espaco_id' => Espaco::pluck('id')->random(),
            'user_id' => User::pluck('id')->random(),
            'titulo' => fake()->word(),
            'descricao' => fake()->text(),
            'dataInicial' => now(),
            'dataFinal' => now()->addWeek()
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (Reserva $reserva) {
            $horarios = Horario::inRandomOrder()->take(2)->pluck('id');
            $reserva->horarios()->attach($horarios);
        });
    }
}
