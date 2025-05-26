<?php

namespace Database\Factories;

use App\Models\Andar;
use App\Models\Modulo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Andar>
 */
class AndarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome' => (string) fake()->unique()->numberBetween(1, 10) . 'º andar',
            'tipo_acesso' => ['terreo', 'escada', 'elevador', 'rampa'],
            'modulo_id' => Modulo::pluck('id')->random()
        ];
    }
}
