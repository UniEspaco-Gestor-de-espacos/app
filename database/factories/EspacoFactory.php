<?php

namespace Database\Factories;

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
            'campus' => fake()->word(),
            'modulo'=> fake()->word(),
            'andar' => fake()->randomDigitNotNull(),
            'nome'=> fake()->randomDigitNotNull(),
            'capacidadePessoas' => fake()->randomDigitNotNull(),
            'acessibilidade' => False,
            'descricao' => fake()->text(),
            'created_at'=>now(),
            'updated_at'=>now()
        ];
    }
}
