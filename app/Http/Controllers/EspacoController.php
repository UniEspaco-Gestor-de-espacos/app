<?php

namespace App\Http\Controllers;

use App\Http\Middleware\EspacoMiddleware;
use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Modulo;
use App\Models\Setor;
use App\Models\Unidade;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class EspacoController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $espacos = Espaco::all();
        $user = Auth::user();
        $modulos = Modulo::all();
        $setores = Setor::all();
        return Inertia::render('espacos/index', compact('espacos', 'user', 'modulos', 'setores'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Espaco $espaco)
    {
        // Carrega TUDO que vamos precisar em poucas queries
        $espaco->load([
            'andar.modulo', // Carrega o andar e seu módulo
            'agendas' => function ($query) {
                $query->with([
                    'user.setor', // Carrega o gestor (user) da agenda e seu setor
                    'horarios.reservas' => function ($q) {
                        // Carrega as reservas dos horários, mas só as deferidas
                        $q->where('situacao', 'deferida')->with('user'); // Carrega o autor (user) da reserva
                    }
                ]);
            }
        ]);

        // Agora processamos os dados que já estão na memória, sem novas consultas
        $gestores_espaco = [];
        $horarios_reservados = ['manha' => [], 'tarde' => [], 'noite' => []];

        foreach ($espaco->agendas as $agenda) {
            // O gestor e o setor já foram carregados
            if ($agenda->user) {
                $gestores_espaco[$agenda->turno] = [
                    'nome' => $agenda->user->name,
                    'email' => $agenda->user->email,
                    'setor' => $agenda->user->setor->nome ?? 'Não informado', // Usa ?? para evitar erro se setor for nulo
                    'agenda_id' => $agenda->id
                ];
            }

            foreach ($agenda->horarios as $horario) {
                // A reserva e seu autor já foram carregados
                if ($horario->reservas->isNotEmpty()) {
                    // Como filtramos por 'deferida', pegamos a primeira
                    $reserva = $horario->reservas->first();
                    $horarios_reservados[$agenda->turno][] = [
                        'horario' => $horario,
                        'autor' => $reserva->user->name ?? 'Usuário removido'
                    ];
                }
            }
        }

        // Lógica de negócio (não uma exceção) para verificar se há gestor
        if (empty($gestores_espaco)) {
            return redirect()->route('espacos.index')->with('error', 'Este espaço ainda não possui um gestor definido.');
        }

        return Inertia::render('espacos/visualizar', [
            'espaco' => $espaco,
            'andar' => $espaco->andar,
            'modulo' => $espaco->andar->modulo,
            'gestores_espaco' => $gestores_espaco,
            'horarios_reservados' => $horarios_reservados,
        ]);
    }
}
