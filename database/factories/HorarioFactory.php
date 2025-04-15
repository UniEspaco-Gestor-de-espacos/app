<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AgendaTurno;
use App\Enums\DiasSemana\DiasSemanaEnum;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Horario>
 */
class HorarioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agenda_id' => AgendaTurno::pluck('id')->random(),
            'horarioInicio' => fake()->time('H:i'),
            'horarioFim' => fake()->time('H:i'),
            'data' => fake()->date(),
            'dia_semana' => fake()->randomElement(array_column(DiasSemanaEnum::cases(),'value')),
        ];
    }
}
