<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('modulos')->insert([
            'nome' => 'Administrativo',
            'andar' => '1',
            'unidade_id' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('modulos')->insert([
            'nome' => 'Joselia Navarro',
            'andar' => '1',
            'unidade_id' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('modulos')->insert([
            'nome' => 'Laboratórios',
            'andar' => '1',
            'unidade_id' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
