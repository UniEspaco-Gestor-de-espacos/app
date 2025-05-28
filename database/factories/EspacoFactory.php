<?php

namespace Database\Factories;

use App\Models\Modulo;
use App\Models\Setor;
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
            'modulo_id' => Modulo::pluck('id')->random(),
            'nome'=> fake()->randomDigitNotNull(),
            'capacidade_pessoas' => fake()->randomDigitNotNull(),
            'descricao' => fake()->text(),
            'created_at'=>now(),
            'updated_at'=>now()
        ];
    }
}
