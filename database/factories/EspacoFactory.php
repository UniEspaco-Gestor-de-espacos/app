<?php

namespace Database\Factories;

use App\Models\Andar;
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
            'nome'=> fake()->randomDigitNotNull(),
            'capacidade_pessoas' => fake()->randomDigitNotNull(),
            'descricao' => fake()->text(),
            'andar_id' => Andar::pluck('id')->random(),
            'created_at'=>now(),
            'updated_at'=>now()
        ];
    }
}
