<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Espaco;
use App\Models\Horario;
use App\Models\Reserva;
use Exception;
use Illuminate\Foundation\Exceptions\Renderer\Renderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GestorReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $agendas = Agenda::whereUserId($user->id);
        $reservas = Reserva::all();

        #VOU BUSCAR OS HORARIOS QUE PERTENCEM AS AGENDAS DO GESTOR
        # Estou pensando em fazer um find many e passar como atributo a agenda mas parece q nao vai dar certo.
        foreach ($reservas as $reserva) {
            $reserva->horarios()->findMany()

        }
        $reservas = [];
        foreach ($reservasUsuario as $reserva) {
            $horarios_reserva = $reserva->horarios()->get();
            array_push($reservas, ['reserva' => $reserva, 'horarios' => $horarios_reserva]);
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
