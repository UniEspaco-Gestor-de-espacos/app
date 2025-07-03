<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Agenda;
use App\Models\Espaco;
use App\Models\Horario;
use App\Models\Instituicao;
use App\Models\PermissionType;
use App\Models\Reserva;
use App\Models\Setor;
use App\Models\Unidade;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */


    public function run(): void
    {
        // Desativa a verificação de chaves estrangeiras para limpeza
        DB::statement("SET session_replication_role = 'replica';");
        // Limpa as tabelas na ordem correta para evitar erros de FK

        Reserva::truncate();
        Horario::truncate();
        Agenda::truncate();
        Espaco::truncate();
        User::truncate(); // Assumindo que você queira limpar os usuários
        Instituicao::truncate();
        Unidade::truncate();

        DB::statement("SET session_replication_role = 'origin';");


        echo "Tabelas limpas.\n";

        $this->call([
            PermissionTypeSeeder::class,
        ]);

        DB::beginTransaction();
        DB::table('instituicaos')->insert([
            'nome' => 'Universidade Estadual do Sudoeste da Bahia',
            'sigla' => 'UESB',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('instituicaos')->insert([
            'nome' => 'Outra Instituição',
            'sigla' => 'outra',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('instituicaos')->insert([
            'nome' => 'Nenhuma',
            'sigla' => 'nenhuma',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Jequié',
            'sigla' => 'JQ',
            'instituicao_id' => 1,
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Vitória da Conquista',
            'sigla' => 'VCA',
            'instituicao_id' => 1,
        ]);
        DB::table('unidades')->insert([
            'nome' => 'Campus Itapetinga',
            'sigla' => 'ITA',
            'instituicao_id' => 1,

        ]);
        DB::commit();

        // --- ETAPA 1: Criar a infraestrutura e os horários disponíveis ---
        // Também cria alguns usuários avulsos que poderão fazer reservas.

        echo "Criando usuários...\n";
        $users = User::factory()->count(10)->create([
            'password' => Hash::make('123123123'), // Senha padrão para todos os usuários
        ]);

        // Ao criar o Espaco, o EspacoFactory cria as Agendas,
        // e o novo AgendaFactory cria todos os Horários.
        echo "Criando Espaços, Agendas e Horários...\n";
        Espaco::factory()->count(5)->create();



        echo "Infraestrutura criada com sucesso.\n";

        // --- ETAPA 2: Criar as Reservas e vincular aos Horários ---

        echo "Criando reservas e vinculando aos horários...\n";

        // Pega uma amostra de horários disponíveis no futuro para criar reservas
        $horariosDisponiveis = Horario::where('data', '>', now()->addDay())->inRandomOrder()->limit(50)->get();

        if ($horariosDisponiveis->isEmpty()) {
            echo "Nenhum horário encontrado para criar reservas. Verifique os factories.\n";
            return;
        }

        // Para cada usuário, cria uma ou duas reservas
        foreach ($users as $user) {
            $numReservas = rand(1, 2);

            for ($i = 0; $i < $numReservas; $i++) {
                // Pega de 1 a 3 horários aleatórios para a mesma reserva
                $horariosParaReservar = $horariosDisponiveis->random(rand(1, 3));
                if ($horariosParaReservar->isEmpty()) continue;

                // Garante que os horários selecionados ainda não foram usados nesta seed
                $horariosDisponiveis = $horariosDisponiveis->diff($horariosParaReservar);

                // Cria a reserva
                $reserva = Reserva::factory()->create([
                    'user_id' => $user->id,
                    'data_inicial' => $horariosParaReservar->min('data') . ' ' . $horariosParaReservar->min('horario_inicio'),
                    'data_final' => $horariosParaReservar->max('data') . ' ' . $horariosParaReservar->max('horario_fim'),
                ]);

                // Anexa os horários na tabela pivot (reserva_horario)
                $reserva->horarios()->attach(
                    $horariosParaReservar->pluck('id')->toArray(),
                    [
                        'user_id' => $user->id,
                        'situacao' => 'deferida', // Pode variar: 'em_analise', 'deferida' etc.
                        'justificativa' => null,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }
        }


        echo "Seed concluído com sucesso!\n";
    }
}
