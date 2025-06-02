<?php

namespace Database\Seeders;

use App\Models\PermissionType;
use App\Models\Setor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(3)->create();
        User::create([
            'name' => 'Institucional',
            'email' => 'institucional@gmail.com',
            'email_verified_at' => now(),
            'profile_pic' => fake()->name(),
            'telefone' => fake()->phoneNumber(),
            'password' => Hash::make('123123123'),
            'setor_id' => Setor::pluck('id')->random(),
            'remember_token' => Str::random(10),
            'permission_type_id' => 3
        ]);
    }
}
