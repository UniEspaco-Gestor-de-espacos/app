<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Modulo;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Buscar usuários com agendas, espaços, andares e módulos carregados
        $users = User::with('agendas.espaco.andar.modulo')->get();

        return Inertia::render('GerenciarUsuarios', [
            'users' => $users,
            'modulos' => Modulo::all(),
            'andares' => Andar::all(),
            'spaces' => Espaco::all(),
            'agendas' => Agenda::all(),
        ]);
    }

    public function verificar()
    {
        $gestores = User::with('agendas.espaco.andar.modulo')
            ->where('permission_type_id', 2) // só gestores
            ->get();

        return response()->json($gestores);
    }
}
