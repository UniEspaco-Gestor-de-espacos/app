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
        // 1. Carrega todos os dados necessários de forma aninhada.
        // A sua consulta aqui já estava correta!
        $espaco->load([
            'andar.modulo.unidade.instituicao', // Carrega a hierarquia completa
            'agendas' => function ($query) {
                $query->with([
                    'user.setor', // Carrega o gestor (user) da agenda e seu setor
                    'horarios.reservas' => function ($q) {
                        // Carrega as reservas dos horários APROVADOS (deferidos)
                        $q->wherePivot('situacao', 'deferida')->with('user');
                    }
                ]);
            }
        ]);

        // 2. Verifica se o espaço tem pelo menos uma agenda (e, portanto, um gestor).
        // Esta é uma regra de negócio válida para o backend.
        if ($espaco->agendas->isEmpty()) {
            return redirect()->route('espacos.index')->with('error', 'Este espaço ainda não possui um gestor definido.');
        }

        //dd($espaco);
        // 3. Renderiza a view, passando APENAS o objeto 'espaco'.
        // O frontend agora é responsável por processar e exibir os dados aninhados.
        return Inertia::render('espacos/visualizar', [
            'espaco' => $espaco,
        ]);
    }
}
