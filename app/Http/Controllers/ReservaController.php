<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Horario;
use App\Models\Modulo;
use App\Models\Reserva;
use Exception;
use Illuminate\Foundation\Exceptions\Renderer\Renderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $reservasUsuario = Reserva::whereUserId($user->id)->get();
        $reservas = [];
        foreach ($reservasUsuario as $reserva) { //
            $horariosReservaAgenda = $reserva->horarios()->get();
            $primeiroHorario = $horariosReservaAgenda->first();
            $agenda = Agenda::whereId($primeiroHorario->agenda_id)->first();
            $espaco = Espaco::whereId($agenda->espaco_id)->first();
            $andar = Andar::whereId($espaco->andar_id)->first();
            $modulo = Modulo::whereId($andar->modulo_id)->first();
            $reservas[] = [
                'reserva' => $reserva,
                'horarios' => $horariosReservaAgenda,
                'agenda' => $agenda,
                'espaco' => $espaco,
                'andar' => $andar,
                'modulo' => $modulo
            ];
        }
        return Inertia::render('reservas/minhasReservas', compact('reservas'));
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
        // A validação já foi executada pela Form Request.
        // Usamos uma transação para garantir que tudo seja salvo, ou nada.
        try {
            $reserva = DB::transaction(function () use ($request) {
                // Pega os dados validados da reserva, mas adiciona o user_id seguro.
                $reservaData = $request->only(['titulo', 'descricao', 'data_inicial', 'data_final']);
                $reservaData['user_id'] = Auth::id(); // Forma segura de pegar o ID do usuário.

                // 1. Cria a reserva
                $reserva = Reserva::create($reservaData);

                $horariosIds = [];

                // 2. Itera sobre os horários validados
                foreach ($request['horarios_solicitados'] as $horarioData) {
                    // Cria o horário
                    $horario = Horario::create($horarioData);
                    // Guarda o ID para o attach
                    $horariosIds[] = $horario->id;
                }

                // 3. Anexa TODOS os horários à reserva de uma só vez.
                $reserva->horarios()->attach($horariosIds);

                // A transação retorna a reserva criada
                return $reserva;
            });

            return to_route('espacos.index')
                ->with('success', 'Reserva solicitada com sucesso! Aguarde avaliação.');
        } catch (Exception $error) {
            // Registra o erro para depuração
            Log::error('Erro ao solicitar reserva: ' . $error->getMessage());
            return to_route('espacos.index')
                ->with('error', 'Erro ao solicitar reserva. Por favor, tente novamente ou contate o administrador.');
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
