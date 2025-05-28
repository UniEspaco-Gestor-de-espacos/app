<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstitucaoUnidadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('instituicaos')->insert([
            'nome' => 'Universidade Estadual do Sudoeste da Bahia',
            'sigla' => 'UESB',
            'endereco' => fake()->address(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('instituicaos')->insert([
            'nome' => 'Outra Instituição',
            'sigla' => 'outra',
            'endereco' => fake()->address(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('instituicaos')->insert([
            'nome' => 'Nenhuma',
            'sigla' => 'nenhuma',
            'endereco' => fake()->address(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Jequié',
            'sigla' => 'JQ',
            'fk_instituicao' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Vitória da Conquista',
            'sigla' => 'VCA',
            'fk_instituicao' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Itapetinga',
            'sigla' => 'ITA',
            'fk_instituicao' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
