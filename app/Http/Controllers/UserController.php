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
            'name' => ['required'],
            'permission_type_id' => ['required'],
            'space_id' => ['required', 'exists:espacos,id'],
            'agendas' => ['array'],
            'agendas.*' => ['exists:agendas,id'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'permission_type_id' => $validated['permission_type_id'],
        ]);

        // Limpa o user_id das agendas que NÃO foram selecionadas para este usuário
        Agenda::where('user_id', $user->id)
            ->whereNotIn('id', $validated['agendas'] ?? [])
            ->update(['user_id' => null, 'espaco_id' => null]);

        // Atualiza o user_id e espaco_id das agendas selecionadas
        if (!empty($validated['agendas'])) {
            foreach ($validated['agendas'] as $agendaId) {
                $agenda = Agenda::find($agendaId);
                if ($agenda) {
                    $agenda->update([
                        'user_id' => $user->id,
                        'espaco_id' => $validated['space_id'],
                    ]);
                }
            }
        }

        return redirect()->route('usuarios.index')->with('success', 'Usuário atualizado e agendas vinculadas!');
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
