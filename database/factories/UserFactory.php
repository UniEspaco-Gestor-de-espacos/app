<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Setor;
use App\Enums\TipoUsuario\TipoUsuarioEnum;
use App\Models\PermissionType;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'profile_pic' => fake()->name(),
            'telefone' => fake()->name(),
            'password' => static::$password ??= Hash::make('password'),
            'setor_id' => Setor::pluck('id')->random(),
            'remember_token' => Str::random(10),
            'permission_type_id' => PermissionType::pluck('id')->random()
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
