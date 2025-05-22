<?php

namespace Database\Factories;

use App\Models\Local;
use App\Models\Modulo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Local>
 */
class LocalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'andar' => (string) fake()->numberBetween(1, 6) . 'º andar',
            'tipo_acesso' => ['terreo', 'escada', 'elevador', 'rampa'],
            'modulo_id' => Modulo::pluck('id')->random()
        ];
    }
}
