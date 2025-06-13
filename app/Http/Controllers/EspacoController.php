<?php

namespace App\Http\Controllers;

use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Modulo;
use App\Models\Unidade;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EspacoController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        // Pega os parâmetros de filtro da URL (query string)
        $filters = Request::only(['search', 'unidade', 'modulo', 'andar', 'capacidade']);

        $espacos = Espaco::query()
            // O join com 'andars' e 'modulos' é necessário para filtrar por eles
            ->join('andars', 'espacos.andar_id', '=', 'andars.id')
            ->join('modulos', 'andars.modulo_id', '=', 'modulos.id')
            // Começa a aplicar os filtros
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('espacos.nome', 'like', '%' . $search . '%')
                        ->orWhere('andars.nome', 'like', '%' . $search . '%')
                        ->orWhere('modulos.nome', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['unidade'] ?? null, function ($query, $unidade) {
                $query->where('modulos.unidade_id', $unidade);
            })
            ->when($filters['modulo'] ?? null, function ($query, $modulo) {
                $query->where('andars.modulo_id', $modulo);
            })
            ->when($filters['andar'] ?? null, function ($query, $andar) {
                $query->where('espacos.andar_id', $andar);
            })
            ->when($filters['capacidade'] ?? null, function ($query, $capacidade) {
                if ($capacidade === 'pequeno') $query->where('espacos.capacidade_pessoas', '<=', 30);
                if ($capacidade === 'medio') $query->whereBetween('espacos.capacidade_pessoas', [31, 100]);
                if ($capacidade === 'grande') $query->where('espacos.capacidade_pessoas', '>', 100);
            })
            // Seleciona as colunas de espacos para evitar conflitos de 'id'
            ->select('espacos.*')
            ->latest('espacos.created_at')
            ->paginate(15)
            // Adiciona a query string à paginação para que os filtros sejam mantidos ao mudar de página
            ->withQueryString();

        return Inertia::render('espacos/index', [
            'espacos' => $espacos, // Agora é um objeto paginador
            'andares' => Andar::all(), // Você ainda precisa de todos para popular os selects
            'modulos' => Modulo::all(),
            'unidades' => Unidade::all(),
            'filters' => $filters, // Envie os filtros de volta para a view
            'user' => $user
        ]);
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
                        $q->wherePivot('situacao', 'deferida')->with('user'); // Carrega o autor (user) da reserva
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
