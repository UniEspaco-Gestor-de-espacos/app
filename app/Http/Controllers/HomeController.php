<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
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
                return Inertia::render('dashboard/institucional', compact('user'));
            case 2: // Gestor
                return Inertia::render('dashboard/gestor', compact('user'));
            default: // Usuario Comum
                $baseUserReservasQuery = Reserva::where('user_id', $user->id);

                $reservas = (clone $baseUserReservasQuery)->with('horarios.agenda.espaco')->get();
                $statusDasReservas = [
                    'em_analise' => (clone $baseUserReservasQuery)->where('situacao', 'em_analise')->count(),
                    'deferida'   => (clone $baseUserReservasQuery)->where('situacao', 'deferida')->count(),
                    'indeferida' => (clone $baseUserReservasQuery)->where('situacao', 'indeferida')->count(),
                ];

                // 1. Primeiro, busca apenas o objeto da próxima reserva
                $proximaReserva = (clone $baseUserReservasQuery)
                    ->where('data_inicial', '>=', now())->where('situacao', 'deferida')
                    ->orderBy('data_inicial', 'asc')
                    ->first();
                // 2. Se a reserva existir, carregue os relacionamentos nela

                if ($proximaReserva) {
                    // A MÁGICA ACONTECE AQUI:
                    $proximaReserva->load('horarios.agenda.espaco');
                }

                // 3. Agora você pode acessar o espaço da mesma forma
                $espacoDaProximaReserva = null;
                if ($proximaReserva && $proximaReserva->horarios->isNotEmpty()) {
                    $espacoDaProximaReserva = $proximaReserva->horarios->first()->agenda->espaco;
                }
                return Inertia::render('dashboard/usuario', compact('user', 'proximaReserva', 'statusDasReservas', 'reservas', 'espacoDaProximaReserva'));
        }
    }
}