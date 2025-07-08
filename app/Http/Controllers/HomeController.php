<?php

namespace App\Http\Controllers;

use App\Models\Espaco;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        switch ($user->permission_type_id) {
            case 1: // Institucional
                $users = User::all();
                $espacos = Espaco::with(['agendas.horarios.reservas'])->get();
                $reservas = Reserva::with(['horarios.agenda.espaco'])->get();
                return Inertia::render('Dashboard/DashboardInstitucionalPage', compact('user', 'users', 'espacos', 'reservas'));
            case 2: // Gestor
                $espacos = Espaco::whereHas('agendas', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->with(['agendas.horarios.reservas'])->get();
                $reservas = Reserva::whereHas('horarios.agenda', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->with(['horarios.agenda.espaco'])->get();
                return Inertia::render('Dashboard/DashboardGestorPage', compact('user', 'espacos', 'reservas'));
            default: // Usuario Comum
                $baseUserReservasQuery = Reserva::where('user_id', $user->id)->with(['horarios.agenda.espaco']);
                $reservas = (clone $baseUserReservasQuery)->get();
                $statusDasReservas = [
                    'em_analise' => (clone $baseUserReservasQuery)->where('situacao', 'em_analise')->count(),
                    'parcialmente_deferida' => (clone $baseUserReservasQuery)->where('situacao', 'parcialmente_deferida')->count(), // Novo status adicionado
                    'deferida'   => (clone $baseUserReservasQuery)->where('situacao', 'deferida')->count(),
                    'indeferida' => (clone $baseUserReservasQuery)->where('situacao', 'indeferida')->count(),
                ];

                // 1. Primeiro, busca apenas o objeto da próxima reserva
                $proximaReserva = (clone $baseUserReservasQuery)
                    ->where('data_inicial', '>=', now())->whereIn('situacao', ['deferida', 'parcialmente_deferida'])
                    ->orderBy('data_inicial', 'asc')
                    ->first();
                // 2. Se a reserva existir, carregue os relacionamentos nela

                if ($proximaReserva) {
                    $proximaReserva->load('horarios.agenda.espaco');
                }
                // 3. Agora você pode acessar o espaço da mesma forma
                $espacoDaProximaReserva = null;
                if ($proximaReserva && $proximaReserva->horarios->isNotEmpty()) {
                    $espacoDaProximaReserva = $proximaReserva->horarios->first()->agenda->espaco;
                }
                return Inertia::render('Dashboard/DashboardUsuarioPage', compact('user', 'proximaReserva', 'statusDasReservas', 'reservas', 'espacoDaProximaReserva'));
        }
    }
}
