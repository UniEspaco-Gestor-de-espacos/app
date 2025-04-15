<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Horario;
use App\Models\Reserva;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReservaHorario>
 */
class ReservaHorarioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reserva_id' => Reserva::pluck('id')->random(),
            'horario_id' => Horario::pluck('id')->random()
        ];
    }
}
