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

class GestorReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $agendas = Agenda::whereUserId($user->id)->get(); // Busca agendas em que o usuario é gestor
        $todasReservas = Reserva::all();
        $reservasGestor = [];

        foreach ($todasReservas as $reserva) {
            foreach ($agendas as $agenda) { // Verifica se a reserva tem horario da agenda
                $horariosReservaAgenda = $reserva->horarios->whereIn('agenda_id', $agenda->id);
                $espaco = Espaco::whereId($agenda->espaco_id)->first();
                $andar = Andar::whereId($espaco->andar_id)->first();
                $modulo = Modulo::whereId($andar->modulo_id)->first();
                if ($horariosReservaAgenda->isNotEmpty()) {
                    $reservasGestor[] = [
                        'reserva' => $reserva,
                        'horarios' => $horariosReservaAgenda,
                        'agenda' => $agenda,
                        'espaco' => $espaco,
                        'andar' => $andar,
                        'modulo' => $modulo
                    ];
                }
                continue;
            }
        }
        return Inertia::render('reservas/gestor/verReservas', compact('reservasGestor'));
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
        // 1. Eager Loading: Carrega todas as relações necessárias em poucas queries.
        $reserva->load([
            'user', // Carrega o usuário que fez a reserva
            'horarios.agenda.espaco.andar.modulo' // Carrega toda a árvore de dependências
        ]);

        // 2. Pega o gestor.
        $gestor = Auth::user();

        // 3. Filtra os horários já carregados e usa ->values() para reindexar.
        $horariosDoGestor = $reserva->horarios->filter(function ($horario) use ($gestor) {
            return $horario->agenda && $horario->agenda->user_id === $gestor->id;
        })->values();

        // 4. Verificação de segurança: O que acontece se nenhum horário pertencer a este gestor?
        if ($horariosDoGestor->isEmpty()) {
            // Você pode retornar um erro 403 (Proibido) ou redirecionar com uma mensagem de erro.
            return redirect(403)->route('gestor.reservas.index')->with('error', 'Você não tem permissão para avaliar os horários desta reserva.');
        }

        // 5. Acessa os dados já carregados, sem novas consultas ao banco.
        // Pega a agenda do primeiro horário filtrado.
        $agenda = $horariosDoGestor->first()->agenda;
        $espaco = $agenda->espaco;
        $andar = $espaco->andar;
        $modulo = $andar->modulo;

        return Inertia::render('reservas/gestor/avaliarReserva', [
            'reserva' => [
                'reserva' => $reserva,
                'horarios' => $horariosDoGestor, // Horários reindexados e corretos
                'agenda' => $agenda,
                'espaco' => $espaco,
                'andar' => $andar,
                'modulo' => $modulo
            ],
            'usuario' => $reserva->user // Usuário também já carregado
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
        $data = ['situacao' => $request->input('situacao')];
        // Se a situação NÃO for 'deferido', adicionamos o motivo ao array.
        if ($request->input('situacao') !== 'deferido') {
            $data['motivo'] = $request->input('motivo');
        }
        $reserva->update($data);
        return redirect(status: 201)->route('gestor.reservas.index')->with('success', 'Reserva avaliada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        //
    }
}
