<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SetorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        //fk_unidade_instituicao -> 1(JQ), 2(VCA), 3(ITA)
        DB::table('setors')->insert([
            'nome' => 'Reitoria',
            'sigla' => 'REITORIA',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Administração',
            'sigla' => 'PROAD',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Administração',
            'sigla' => 'PROAD',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Administração',
            'sigla' => 'PROAD',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Extensão e Assuntos Comunitários',
            'sigla' => 'PROEX',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Extensão e Assuntos Comunitários',
            'sigla' => 'PROEX',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Extensão e Assuntos Comunitários',
            'sigla' => 'PROEX',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Graduação',
            'sigla' => 'PROGRAD',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Graduação',
            'sigla' => 'PROGRAD',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Graduação',
            'sigla' => 'PROGRAD',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Pesquisa e Pós-Graduação',
            'sigla' => 'PPG',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Pesquisa e Pós-Graduação',
            'sigla' => 'PPG',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Pró-Reitoria de Pesquisa e Pós-Graduação',
            'sigla' => 'PPG',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Assessoria de Comunicação',
            'sigla' => 'ASCOM',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria de Comunicação',
            'sigla' => 'ASCOM',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria de Comunicação',
            'sigla' => 'ASCOM',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Gestão de Pessoas',
            'sigla' => 'AGP',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Gestão de Pessoas',
            'sigla' => 'AGP',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Gestão de Pessoas',
            'sigla' => 'AGP',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Assessoria na Gestão de Projetos e Convênios Institucionais',
            'sigla' => 'AGESPI',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria na Gestão de Projetos e Convênios Institucionais',
            'sigla' => 'AGESPI',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria na Gestão de Projetos e Convênios Institucionais',
            'sigla' => 'AGESPI',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Assessoria Técnica de Finanças e Planejamento',
            'sigla' => 'ASPLAN',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Técnica de Finanças e Planejamento',
            'sigla' => 'ASPLAN',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Técnica de Finanças e Planejamento',
            'sigla' => 'ASPLAN',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Acesso, Permanência Estudantil e Ações Afirmativas',
            'sigla' => 'AAPA',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Acesso, Permanência Estudantil e Ações Afirmativas',
            'sigla' => 'AAPA',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Assessoria Especial de Acesso, Permanência Estudantil e Ações Afirmativas',
            'sigla' => 'AAPA',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);


        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Exatas e Naturais',
            'sigla' => 'DCEN',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Humanas, Educação e Linguagem',
            'sigla' => 'DCHEL',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Tecnologia Rural e Animal',
            'sigla' => 'DTRA',
            'fk_unidade_instituicao' => '3',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Biológicas',
            'sigla' => 'DCB',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Humanas e Letras',
            'sigla' => 'DCHL',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Tecnológicas',
            'sigla' => 'DCT',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Saúde I',
            'sigla' => 'DS I',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Saúde II',
            'sigla' => 'DS II',
            'fk_unidade_instituicao' => '1',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Exatas e Tecnológicas',
            'sigla' => 'DCET',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Naturais',
            'sigla' => 'DCN',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Ciências Sociais Aplicadas',
            'sigla' => 'DCSA',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Engenharia Agrícola e Solos',
            'sigla' => 'DEAS',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Estudos Linguísticos e Literários',
            'sigla' => 'DELL',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Filosofia e Ciências Humanas',
            'sigla' => 'DFCH',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Fitotecnia e Zootecnia',
            'sigla' => 'DFZ',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de Geografia',
            'sigla' => 'DG',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('setors')->insert([
            'nome' => 'Departamento de História',
            'sigla' => 'DH',
            'fk_unidade_instituicao' => '2',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
