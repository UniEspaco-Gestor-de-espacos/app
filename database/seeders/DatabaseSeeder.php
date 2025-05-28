<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */


    public function run(): void
    {
        $this->call([
            InstituicaoSeeder::class,
            UnidadeSeeder::class,
            SetorSeeder::class,
            ModuloSeeder::class,
            AndarSeeder::class,
            EspacoSeeder::class,
            PermissionTypeSeeder::class,
            UserSeeder::class,
            AgendaSeeder::class,
            HorarioSeeder::class,
            ReservaSeeder::class,
        ]);
    }
}
