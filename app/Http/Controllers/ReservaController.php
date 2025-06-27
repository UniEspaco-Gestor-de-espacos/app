<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservaRequest;
use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Horario;
use App\Models\Modulo;
use App\Models\Reserva;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $user = Auth::user();

        // VERSÃO OTIMIZADA:
        // Carrega as reservas do usuário com todos os relacionamentos necessários em uma única consulta.
        // Isso evita o problema N+1, onde múltiplas queries são feitas dentro de um loop.
        $reservas = Reserva::where('user_id', $user->id)
            ->with([
                'horarios' => function ($query) {
                    // Ordena os horários para exibição consistente.
                    $query->orderBy('data')->orderBy('horario_inicio');
                },
                // Carrega a cadeia de relacionamentos de forma aninhada.
                'horarios.agenda.espaco.andar.modulo.unidade.instituicao'
            ])
            ->latest() // Ordena as reservas da mais nova para a mais antiga.
            ->get();

        return Inertia::render('reservas/minhasReservas', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(StoreReservaRequest $request)
    {
        // A validação já foi executada pela Form Request.
        // Usamos uma transação para garantir que tudo seja salvo, ou nada.
        try {
            DB::transaction(function () use ($request) {
                // 1. Cria a reserva com o status inicial 'em_analise'.
                $reserva = Reserva::create([
                    'titulo' => $request->validated('titulo'),
                    'descricao' => $request->validated('descricao'),
                    'data_inicial' => $request->validated('data_inicial'),
                    'data_final' => $request->validated('data_final'),
                    'user_id' => Auth::id(),
                    'situacao' => 'em_analise', // Status geral inicial
                ]);

                $horariosData = $request->validated('horarios_solicitados');
                // Prepara os dados para inserção em massa e os IDs para o anexo.
                $horariosParaAnexar = [];
                foreach ($horariosData as $horarioInfo) {
                    // Cria cada horário individualmente
                    $horario = Horario::create($horarioInfo);
                    // Prepara o array para anexar com o status 'em_analise' na tabela pivô
                    $horariosParaAnexar[$horario->id] = ['situacao' => 'em_analise'];
                }

                // 3. Anexa TODOS os horários à reserva com o status pivô correto.
                $reserva->horarios()->attach($horariosParaAnexar);

                return $reserva;
            });

            return to_route('espacos.index')->with('success', 'Reserva solicitada com sucesso! Aguarde avaliação.');
        } catch (Exception $error) {
            Log::error('Erro ao solicitar reserva: ' . $error->getMessage());
            return to_route('espacos.index')->with('error', 'Erro ao solicitar reserva. Tente novamente.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreReservaRequest $request, Reserva $reserva)
    {
        // A validação já foi executada pela Form Request.
        // Usamos uma transação para garantir que tudo seja salvo, ou nada.
        try {
            DB::transaction(function () use ($request, $reserva) {
                // 1. Atualiza os dados da reserva.
                $reserva->update([
                    'titulo' => $request->validated('titulo'),
                    'descricao' => $request->validated('descricao'),
                    'data_inicial' => $request->validated('data_inicial'),
                    'data_final' => $request->validated('data_final'),
                    // O user_id não deve mudar, e a situação é gerenciada em outro lugar.
                ]);

                // 2. Pega os IDs dos horários antigos para depois deletá-los.
                $horariosAntigosIds = $reserva->horarios()->pluck('horarios.id');

                // 3. Desvincula todos os horários antigos.
                $reserva->horarios()->detach();

                // 4. Deleta os horários antigos que não estão mais associados a nenhuma reserva.
                Horario::whereIn('id', $horariosAntigosIds)->whereDoesntHave('reservas')->delete();


                // 5. Prepara e anexa os novos horários.
                $horariosData = $request->validated('horarios_solicitados');
                $horariosParaAnexar = [];
                foreach ($horariosData as $horarioInfo) {
                    // Cria cada horário individualmente
                    $horario = Horario::create($horarioInfo);
                    // Prepara o array para anexar com o status 'em_analise' na tabela pivô
                    $horariosParaAnexar[$horario->id] = ['situacao' => 'em_analise'];
                }

                // 6. Anexa os novos horários à reserva.
                $reserva->horarios()->attach($horariosParaAnexar);
            });

            return to_route('reservas.index')->with('success', 'Reserva atualizada com sucesso! Aguarde nova avaliação.');
        } catch (Exception $error) {
            Log::error('Erro ao atualizar reserva: ' . $error->getMessage());
            return to_route('reservas.index')->with('error', 'Erro ao atualizar reserva. Tente novamente.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reserva $reserva)
    {
        $reserva->load([
            'user',
            'horarios' => function ($query) {
                // Ordena os horários para exibição consistente.
                $query->orderBy('data')->orderBy('horario_inicio');
            },
            // Carrega a cadeia de relacionamentos de forma aninhada.
            'horarios.agenda.espaco'
        ]);

        $espaco = $reserva->horarios->first()->agenda->espaco;

        // 1. Carrega todos os dados necessários de forma aninhada.
        $espaco->load([
            'andar.modulo.unidade.instituicao', // Carrega a hierarquia completa
            'agendas' => function ($query) {
                $query->with([
                    'user.setor', // Carrega o gestor (user) da agenda e seu setor
                    'horarios.reservas' => function ($q) {
                        // Carrega as reservas dos horários APROVADOS (deferidos)
                        $q->wherePivot('situacao', 'deferida')->with('user');
                    }
                ]);
            }
        ]);


        // 2. Verifica se o espaço tem pelo menos uma agenda (e, portanto, um gestor).
        if ($espaco->agendas->isEmpty()) {
            return redirect()->route('espacos.index')->with('error', 'Este espaço ainda não possui um gestor definido.');
        }

        // 3. Renderiza a view, passando APENAS o objeto 'espaco'.
        // O frontend agora é responsável por processar e exibir os dados aninhados.
        return Inertia::render('espacos/visualizar', [
            'espaco' => $espaco,
            'reserva' => $reserva
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        try {
            DB::transaction(function () use ($reserva) {
                // 1. Pega os IDs dos horários associados à reserva
                $horariosIds = $reserva->horarios()->pluck('horarios.id');

                // 2. Desvincula todos os horários da reserva
                $reserva->horarios()->detach();

                // 3. Deleta os horários que não estão mais associados a nenhuma reserva
                Horario::whereIn('id', $horariosIds)->whereDoesntHave('reservas')->delete();

                // 4. Deleta a reserva
                $reserva->delete();
            });

            return back()->with('success', 'Reserva cancelada com sucesso!');
        } catch (Exception $error) {
            Log::error('Erro ao cancelar reserva: ' . $error->getMessage());
            return back()->with('error', 'Erro ao cancelar reserva. Tente novamente.');
        }
    }
}
