<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Espaco;
use App\Models\User;
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
            'turno' => 'Manha',
            'espacoId'=> Espaco::pluck('id')->random(),
            'gestorId'=> User::pluck('id')->random()
        ];
    }
}
