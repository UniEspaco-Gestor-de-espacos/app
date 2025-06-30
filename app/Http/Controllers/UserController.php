<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Agenda;
use App\Models\Modulo;
use App\Models\Andar;
use App\Models\Espaco;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('GerenciarUsuarios', [
            'users' => User::with('agendas')->get(),
            'roles' => ['Institucional', 'Gestor', 'Comum'],
            'spaces' => Espaco::all(),
            'modulos' => Modulo::all(),
            'andares' => Andar::all(),
            'turnos' => Agenda::distinct()->pluck('turno'),
            'agendas' => Agenda::with('espaco')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permission_type_id' => 'required|integer',
            'space_id' => 'nullable|integer|exists:espacos,id',
            'agendas' => 'array',
            'agendas.*' => 'integer|exists:agendas,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'permission_type_id' => $validated['permission_type_id'],
            'space_id' => $validated['space_id'] ?? null,
        ]);

        $agendasIds = $validated['agendas'] ?? [];

        // Limpa todas as agendas antigas deste usuário
        Agenda::where('user_id', $user->id)
            ->whereNotIn('id', $agendasIds)
            ->update(['user_id' => null]);

        // Atribui as novas agendas a este usuário
        Agenda::whereIn('id', $agendasIds)
            ->update(['user_id' => $user->id]);

        return redirect()->route('usuario.index')->with('success', 'Usuário atualizado com sucesso.');
    }

    public function verificar()
    {
        $gestores = User::where('permission_type_id', 2)
            ->with(['agendas.espaco'])
            ->get();

        return Inertia::render('Usuarios/VerificarUsuarios', [
            'gestores' => $gestores,
        ]);
    }
}
