<?php

namespace App\Http\Controllers\Gestor;

use App\Models\Agenda;
use App\Models\Horario;
use App\Models\Reserva;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Modulo;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class GestorReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gestor = Auth::user();
        $agendasDoGestorIds = Agenda::where('user_id', $gestor->id)->pluck('id');

        if ($agendasDoGestorIds->isEmpty()) {
            return Inertia::render('reservas/gestor/verReservas', [
                'reservas' => collect(), // Envia uma coleção vazia
            ]);
        }

        $reservaIds = DB::table('reserva_horario')
            ->join('horarios', 'reserva_horario.horario_id', '=', 'horarios.id')
            ->whereIn('horarios.agenda_id', $agendasDoGestorIds)
            ->distinct()
            ->pluck('reserva_horario.reserva_id');
        if ($reservaIds->isEmpty()) {
            return Inertia::render('reservas/gestor/verReservas', [
                'reservas' => collect(),
            ]);
        }
        $reservasParaAvaliar = Reserva::whereIn('id', $reservaIds)
            ->with([
                'user', // O usuário que solicitou a reserva
                'horarios.agenda.espaco.andar.modulo.unidade.instituicao'
            ])
            ->latest()
            ->get();
        return Inertia::render('reservas/gestor/verReservas', [
            'reservas' => $reservasParaAvaliar,
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
    public function store(Request $request)
    {
        // Não utiliza no gestor
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        $gestor = Auth::user();
        // Carrega a reserva com todos os dados necessários para a tela de detalhes do gestor.
        $agendasDoGestorIds = Agenda::where('user_id', $gestor->id)->pluck('id');

        // Se o gestor não gerencia agendas, não deveria estar aqui.
        // Podemos retornar um erro ou redirecionar.
        if ($agendasDoGestorIds->isEmpty()) {
            abort(403, 'Acesso não autorizado.');
        }
        $reserva->load([
            'user',
            'horarios' => function ($query) use ($agendasDoGestorIds) {
                // Condição: O 'agenda_id' do horário DEVE estar na lista de IDs do gestor.
                $query->whereIn('agenda_id', $agendasDoGestorIds)
                    ->orderBy('data')
                    ->orderBy('horario_inicio');
            },
            'horarios.agenda.espaco.andar.modulo.unidade.instituicao'
        ]);


        return Inertia::render('reservas/gestor/avaliarReserva', [
            'reserva' => $reserva
        ]);
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
        // 1. Validação da entrada: garante que a situação seja 'deferido' ou 'indeferido'.
        $request->validate([
            'situacao' => 'required|in:deferida,indeferia',
        ]);

        $gestor = Auth::user();
        $novaSituacao = $request->input('situacao');

        // 2. Obter um array com os IDs de todas as agendas gerenciadas pelo gestor.
        $agendasDoGestorIds = Agenda::where('user_id', $gestor->id)->pluck('id');

        // Se o gestor não gerencia nenhuma agenda, ele não pode avaliar nada.
        if ($agendasDoGestorIds->isEmpty()) {
            return back()->with('error', 'Você não é gestor de nenhuma agenda.');
        }

        DB::beginTransaction();
        try {
            // 3. Encontrar os IDs dos horários DENTRO DESTA RESERVA que:
            //    a) Pertencem a uma das agendas do gestor.
            //    b) Ainda estão com o status 'em_analise'.
            $horariosIdsParaAvaliar = $reserva->horarios()
                ->whereIn('agenda_id', $agendasDoGestorIds)
                ->wherePivot('situacao', 'em_analise')
                ->pluck('horarios.id');

            // Se não houver horários pendentes para este gestor nesta reserva, informa e sai.
            if ($horariosIdsParaAvaliar->isEmpty()) {
                DB::rollBack(); // Não há nada para fazer, então desfazemos a transação.
                return redirect()->route('gestor.reservas.index')->with('error', 'Reserva já avaliada!');
            }

            // 4. Atualiza a 'situacao' na tabela pivô APENAS para os horários encontrados.
            $reserva->horarios()->updateExistingPivot($horariosIdsParaAvaliar, [
                'situacao' => $novaSituacao,
                'user_id' => $gestor->id
            ]);

            // 5. Atualiza o status GERAL da reserva (para 'deferido', 'indeferido', 'parcialmente_deferido').
            $this->atualizarStatusGeralDaReserva($reserva);

            DB::commit(); // Confirma todas as alterações no banco.
            return Redirect::route('gestor.reservas.index')->with('success', 'solicitação avaliada com sucesso!');
        } catch (Exception $e) {
            DB::rollBack(); // Em caso de erro, desfaz tudo.
            Log::error("Erro ao avaliar reserva {$reserva->id}: " . $e->getMessage());
            return back()->with('error', 'Ocorreu um erro inesperado ao avaliar a reserva.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        //
    }


    protected function atualizarStatusGeralDaReserva(Reserva $reserva)
    {
        // Recarrega os status da tabela pivô para ter os dados mais recentes.
        $statusDosHorarios = $reserva->horarios()->get()->pluck('pivot.situacao');
        if ($statusDosHorarios->every(fn($status) => $status === 'deferida')) {
            $reserva->situacao = 'deferida';
        } elseif ($statusDosHorarios->every(fn($status) => $status === 'indeferida')) {
            $reserva->situacao = 'indeferida';
        } elseif ($statusDosHorarios->contains('deferida')) {
            // Se pelo menos um foi deferido (e não todos), é parcial.
            $reserva->situacao = 'parcialmente_deferida';
        } else {
            // Se nenhum foi deferido ainda, mas nem todos foram indeferidos, continua em análise.
            $reserva->situacao = 'em_analise';
        }

        $reserva->save();
    }
}
