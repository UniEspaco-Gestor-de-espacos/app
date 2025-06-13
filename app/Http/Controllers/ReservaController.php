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
        dd($request['data_inicial']);
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reserva $reserva)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        //
    }
}
