<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Espaco;
use App\Models\User;
use App\Enums\Agenda\AgendaEnum;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AgendaTurno>
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
            'turno' => fake()->randomElement(array_column(AgendaEnum::cases(), 'value')),
            'espaco_id' => Espaco::pluck('id')->random(),
            'user_id' => User::pluck('id')->random()
        ];
    }
}
