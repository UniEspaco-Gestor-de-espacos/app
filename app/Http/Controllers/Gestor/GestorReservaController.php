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

    public function avaliar() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Cria primeiro a reserva para depois vincular ao horario
            $reserva = Reserva::create([
                'titulo' => $request['titulo'],
                'descricao' => $request['descricao'],
                'data_inicial' => $request['data_inicial'],
                'data_final' => $request['data_final'],
                'user_id' => $request['user_id']
            ]);
            foreach ($request['horarios_solicitados'] as $horario) {
                $temp_horario = Horario::create([
                    'agenda_id' => $horario['agenda_id'],
                    'horario_inicio' => $horario['horario_inicio'],
                    'horario_fim' => $horario['horario_fim'],
                    'data' => $horario['data']
                ]);
                $reserva->horarios()->attach($temp_horario->id);
            };
            return redirect(status: 201)->route('espacos.index')->with('success', 'Reserva solicitada com sucesso! Aguarde avaliação');
        } catch (Exception $error) {
            return redirect(status: 501)->route('espacos.index')->with('error', 'Erro ao solicitar reserva, favor verificar com administrador do sistema');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        $usuario = User::whereId($reserva->user_id)->first();
        $horariosReservaAgenda = $reserva->horarios()->get();
        $agenda = $horariosReservaAgenda->first()->agenda()->get();
        $espaco = Espaco::whereId($agenda->first()->espaco_id)->first();
        $andar = Andar::whereId($espaco->andar_id)->first();
        $modulo = Modulo::whereId($andar->modulo_id)->first();

        return Inertia::render('reservas/gestor/avaliarReserva', ['reserva' => [
            'reserva' => $reserva,
            'horarios' => $horariosReservaAgenda,
            'agenda' => $agenda,
            'espaco' => $espaco,
            'andar' => $andar,
            'modulo' => $modulo
        ], 'usuario' => $usuario]);
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
