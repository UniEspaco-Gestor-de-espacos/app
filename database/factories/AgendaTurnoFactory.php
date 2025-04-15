<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Espaco;
use App\Models\User;
use App\Enums\AgendaTurno\AgendaTurnoEnum;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AgendaTurno>
 */
class AgendaTurnoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'turno' => fake()->randomElement(array_column(AgendaTurnoEnum::cases(),'value')),
            'espaco_id'=> Espaco::pluck('id')->random(),
            'user_id'=> User::pluck('id')->random()
        ];
    }
}
