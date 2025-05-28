<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Agenda;
use App\Models\User;

class AgendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Espaco 1
        Agenda::create([
            'turno' => 'manha',
            'espaco_id' => 1,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'tarde',
            'espaco_id' => 1,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'noite',
            'espaco_id' => 1,
            'user_id' => User::pluck('id')->random()
        ]);
        // Espaco 2
        Agenda::create([
            'turno' => 'manha',
            'espaco_id' => 2,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'tarde',
            'espaco_id' => 2,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'noite',
            'espaco_id' => 2,
            'user_id' => User::pluck('id')->random()
        ]);
        // Espaco 3
        Agenda::create([
            'turno' => 'manha',
            'espaco_id' => 3,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'tarde',
            'espaco_id' => 3,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'noite',
            'espaco_id' => 3,
            'user_id' => User::pluck('id')->random()
        ]);
        // Espaco 4
        Agenda::create([
            'turno' => 'manha',
            'espaco_id' => 4,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'tarde',
            'espaco_id' => 4,
            'user_id' => User::pluck('id')->random()
        ]);
        Agenda::create([
            'turno' => 'noite',
            'espaco_id' => 4,
            'user_id' => User::pluck('id')->random()
        ]);
    }
}
