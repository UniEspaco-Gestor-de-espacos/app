<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservaRequest;
use App\Models\Agenda;
use App\Models\Horario;
use App\Models\Reserva;
use App\Notifications\NotificationModel;
use App\Notifications\NovaSolicitacaoReservaNotification;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReservaController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) // Recebe a Request
    {
        $user = Auth::user();
        // Pega os parâmetros de filtro da URL (query string), exatamente como no outro controller
        $filters = $request->only(['search', 'situacao', 'reserva']);

        $reservas = Reserva::query()
            ->where('user_id', $user->id) // Query base para as reservas do usuário logado
            // Aplica os filtros de forma condicional
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('titulo', 'like', '%' . $search . '%')
                        ->orWhere('descricao', 'like', '%' . $search . '%');
                });
                $query->orderByRaw(
                    "CASE WHEN titulo LIKE ? THEN 1 ELSE 2 END",
                    ['%' . $search . '%']
                );
            })
            ->when(
                $filters['situacao'] ?? null,
                // 1. Função a ser executada SE 'situacao' EXISTIR no filtro
                function ($query, $situacao) {
                    $query->where('situacao', $situacao);
                },
                // 2. Função a ser executada SE 'situacao' NÃO EXISTIR no filtro
                function ($query) {
                    $query->where('situacao', '!=', 'inativa');
                }
            )
            // Carrega todos os relacionamentos necessários em uma única consulta.
            ->with([
                'user',
                'horarios' => function ($query) {
                    $query->orderBy('data')->orderBy('horario_inicio');
                },
                'horarios.agenda.espaco.andar.modulo.unidade.instituicao'
            ])
            ->latest() // Ordena as reservas da mais nova para a mais antiga.
            ->paginate(10) // Pagina os resultados
            ->withQueryString(); // Anexa os filtros aos links de paginação
        $reservaToShow = Reserva::find($filters['reserva'] ?? null);
        $reservaToShow != null ? $reservaToShow->load([
            'horarios.agenda.espaco.andar.modulo.unidade.instituicao',
            'horarios.agenda.user.setor'
        ]) : null;

        return Inertia::render('Reservas/ReservasPage', [
            'reservas' => $reservas, // Envia o objeto paginador completo
            'filters' => $filters,   // Envia os filtros de volta para a view
            'reservaToShow' => $reservaToShow, // Envia a reserva selecionada para exibição
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
        $user = Auth::user();
        // A validação já foi executada pela Form Request.
        // Usamos uma transação para garantir que tudo seja salvo, ou nada.
        try {
            DB::transaction(function () use ($request, $user) {
                // 1. Cria a reserva com o status inicial 'em_analise'.
                $reserva = Reserva::create([
                    'titulo' => $request->validated('titulo'),
                    'descricao' => $request->validated('descricao'),
                    'data_inicial' => $request->validated('data_inicial'),
                    'data_final' => $request->validated('data_final'),
                    'recorrencia' => $request->validated('recorrencia'),
                    'user_id' => Auth::id(),
                    'situacao' => 'em_analise', // Status geral inicial
                ]);

                $horariosData = $request->validated('horarios_solicitados');
                // Prepara os dados para inserção em massa e os IDs para o anexo.
                $gestores = [];
                $horariosParaAnexar = [];
                foreach ($horariosData as $horarioInfo) {
                    $gestor = Agenda::whereId($horarioInfo['agenda_id'])
                        ->with('user') // Carrega o gestor da agenda
                        ->first()
                        ->user;
                    $gestores[] = $gestor; // Coleta os gestores para notificação

                    // Cria cada horário individualmente
                    $horario = Horario::create($horarioInfo);
                    // Prepara o array para anexar com o status 'em_analise' na tabela pivô
                    $horariosParaAnexar[$horario->id] = [
                        'situacao' => $gestor->id === $user->id ? 'deferida' : 'em_analise'
                    ];
                }
                $gestores = array_unique($gestores); // Remove gestores duplicados

                if ($gestor->id === $user->id)
                    $reserva->update([
                        'situacao' => count($gestores) > 1 ? 'parcialmente_deferida' : 'deferida'
                    ]);

                // 3. Anexa TODOS os horários à reserva com o status pivô correto.
                $reserva->horarios()->attach($horariosParaAnexar);
                foreach ($gestores as $gestor) {
                    // 4. Notifica cada gestor sobre a nova solicitação de reserva.
                    $partesDoNome = explode(' ', Auth::user()->name);
                    $doisPrimeirosNomesArray = array_slice($partesDoNome, 0, 2);
                    $resultado = implode(' ', $doisPrimeirosNomesArray);
                    $gestor->notify(
                        new NotificationModel(
                            'Nova solicitação de reserva',
                            'O usuário ' . $resultado .
                                ' solicitou uma reserva.',
                            route('gestor.reservas.show', ['reserva' => $reserva->id])
                        )
                    );
                }
                return $reserva;
            });

            return redirect()->route('espacos.index')->with('success', 'Reserva solicitada com sucesso! Aguarde avaliação.');
        } catch (Exception $error) {
            Log::error('Erro ao solicitar reserva: ' . $error->getMessage());
            return redirect()->route('espacos.index')->with('error', 'Erro ao solicitar reserva. Tente novamente.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreReservaRequest $request, Reserva $reserva)
    {
        $this->authorize('update', $reserva);
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
                    'recorrencia' => $request->validated('recorrencia'),
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
                $gestores = [];
                foreach ($horariosData as $horarioInfo) {
                    $gestor = Agenda::whereId($horarioInfo['agenda_id'])
                        ->with('user') // Carrega o gestor da agenda
                        ->first()
                        ->user;
                    $gestores[] = $gestor; // Coleta os gestores para notificação
                    // Cria cada horário individualmente
                    $horario = Horario::create($horarioInfo);
                    // Prepara o array para anexar com o status 'em_analise' na tabela pivô
                    $horariosParaAnexar[$horario->id] = ['situacao' => 'em_analise'];
                }
                $gestores = array_unique($gestores); // Remove gestores duplicados

                // 6. Anexa os novos horários à reserva.
                $reserva->horarios()->attach($horariosParaAnexar);
                foreach ($gestores as $gestor) {
                    // 4. Notifica cada gestor sobre a nova solicitação de reserva.
                    $partesDoNome = explode(' ', Auth::user()->name);
                    $doisPrimeirosNomesArray = array_slice($partesDoNome, 0, 2);
                    $resultado = implode(' ', $doisPrimeirosNomesArray);
                    $gestor->notify(
                        new NotificationModel(
                            'Reserva atualizada',
                            'O usuário ' . $resultado .
                                ' atualizou uma reserva.',
                            route(
                                'gestor.reservas.show',
                                ['reserva' => $reserva->id]
                            )
                        )
                    );
                }
            });

            return redirect()->route('reservas.index')->with('success', 'Reserva atualizada com sucesso! Aguarde nova avaliação.');
        } catch (Exception $error) {
            Log::error('Erro ao atualizar reserva: ' . $error->getMessage());
            return redirect()->route('reservas.index')->with('error', 'Erro ao atualizar reserva. Tente novamente.');
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
        return Inertia::render('Espacos/VisualizarEspacoPage', [
            'espaco' => $espaco,
            'reserva' => $reserva,
            'isEditMode' => true,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Reserva $reserva)
    {
        $this->authorize('delete', $reserva);
        $request->validate([
            'password' => 'required',
        ]);

        $user = Auth::user(); // Obtém o usuário logado

        // 2. Verificar se o usuário existe e se a senha fornecida corresponde à senha do usuário
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return back()->with('error', 'A senha fornecida está incorreta.');
        }

        try {
            DB::transaction(function () use ($reserva) {

                // 1. Itera sobre cada horário associado a esta reserva
                // para atualizar a situação na tabela pivô (horario_reserva).
                foreach ($reserva->horarios as $horario) {
                    $gestor = Agenda::whereId($horario['agenda_id'])
                        ->with('user') // Carrega o gestor da agenda
                        ->first()
                        ->user;
                    $gestores[] = $gestor; // Coleta os gestores para notificação
                    $reserva->horarios()->updateExistingPivot($horario->id, [
                        'situacao' => 'inativa'
                    ]);
                }
                $gestores = array_unique($gestores); // Remove gestores duplicados

                foreach ($gestores as $gestor) {
                    $partesDoNome = explode(' ', Auth::user()->name);
                    $doisPrimeirosNomesArray = array_slice($partesDoNome, 0, 2);
                    $resultado = implode(' ', $doisPrimeirosNomesArray);
                    // 3. Notifica cada gestor sobre o cancelamento da reserva.
                    $gestor->notify(
                        new NotificationModel(
                            'Reserva cancelada',
                            'O usuário ' . $resultado .
                                ' cancelou uma reserva.',
                            route('gestor.reservas.index')
                        )
                    );
                }
                // 2. Atualiza a situação da própria reserva para 'inativa'
                $reserva->update(['situacao' => 'inativa']);
            });

            return back()->with('success', 'Reserva cancelada com sucesso!');
        } catch (Exception $error) {
            Log::error('Erro ao cancelar (inativar) reserva: ' . $error->getMessage(), [
                'reserva_id' => $reserva->id,
                'user_id' => Auth::id()
            ]);

            return back()->with('error', 'Erro ao cancelar a reserva. Por favor, tente novamente.');
        }
    }
}
