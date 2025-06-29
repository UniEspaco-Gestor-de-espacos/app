<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEspacoRequest;
use App\Http\Requests\UpdateEspacoRequest;
use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Modulo;
use App\Models\Unidade;
use App\Models\User;
use Exception;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class InstitucionalEspacoController extends Controller
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
            ->with([
                'andar.modulo.unidade', // Carrega a unidade do módulo do andar
                'agendas' => function ($query) {
                    $query->with('user'); // Carrega o gestor da agenda
                }
            ])
            ->latest('espacos.created_at')
            ->paginate(2)
            // Adiciona a query string à paginação para que os filtros sejam mantidos ao mudar de página
            ->withQueryString();
            return Inertia::render('Espacos/Institucional/GerenciarEspacosPage', [
            'espacos' => $espacos, // Agora é um objeto paginador
            'andares' => Andar::all(), // Ainda precisa de todos para popular os selects
            'modulos' => Modulo::all(),
            'unidades' => Unidade::all(),
            'filters' => $filters, // Envia os filtros de volta para a view
            'user' => $user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $unidades = Unidade::all();
        $modulos = Modulo::all();
        $andares = Andar::all();
        return Inertia::render('Espacos/Institucional/CadastroEspacoPage', compact('unidades', 'modulos', 'andares'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEspacoRequest $request)
    {
        // A validação já foi feita pela Form Request!
        $validated = $request->validated();
        dd($validated);
        try {
            // Envolve toda a lógica em uma transação. Ou tudo funciona, ou nada é salvo.
            $espaco = DB::transaction(function () use ($validated, $request) {

                $storedImagePaths = [];
                $mainImagePath = null;

                if ($request->hasFile('imagens')) {
                    foreach ($request->file('imagens') as $index => $file) {
                        $path = $file->store('espacos_images', 'public');
                        $storedImagePaths[] = $path;

                        // Corrigido: usa o dado validado 'main_image_index'
                        if (isset($validated['main_image_index']) && (int)$validated['main_image_index'] === $index) {
                            $mainImagePath = $path;
                        }
                    }
                    if (!$mainImagePath && !empty($storedImagePaths)) {
                        $mainImagePath = $storedImagePaths[0];
                    }
                }

                // Cria o Espaço
                $espaco = Espaco::create([
                    'nome' => $validated['nome'],
                    'capacidade_pessoas' => $validated['capacidade_pessoas'],
                    'descricao' => $validated['descricao'],
                    'andar_id' => $validated['andar_id'],
                    'imagens' => $storedImagePaths,
                    'main_image_index' => $mainImagePath,
                ]);

                // Cria as 3 agendas de forma mais eficiente usando o relacionamento
                $espaco->agendas()->createMany([
                    ['turno' => 'manha', 'user_id' => null], // Adicionado user_id nulo por padrão
                    ['turno' => 'tarde', 'user_id' => null],
                    ['turno' => 'noite', 'user_id' => null],
                ]);

                return $espaco;
            });

            return redirect()->route('espacos.index')->with('success', 'Espaço cadastrado com sucesso!');
        } catch (\Exception $e) {
            Log::error("Erro ao criar espaço: " . $e->getMessage());
            return redirect()->back()->with('error', 'Ocorreu um erro inesperado ao criar o espaço.')->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Espaco $espaco)
    {
        try {
            $agendas = Agenda::whereEspacoId($espaco->id)->get();
            $andar = $espaco->andar;
            $modulo = $andar->modulo;
            $gestores_espaco = [];
            foreach ($agendas as $agenda) {
                $horarios_reservados[$agenda->turno] = [];

                // Busca informações do gestor caso haja
                if ($agenda->user_id != null) {
                    $user = User::whereId($agenda->user_id)->get();
                    $gestores_espaco[$agenda->turno] = [
                        'nome' => $user->first()->name,
                        'email' => $user->first()->email,
                        'setor' => $user->first()->setor()->get()->first()->nome,
                        'agenda_id' => $agenda->id
                    ];
                }
                // Busca horarios reservados da agenda
                foreach ($agenda->horarios as $horario) {
                    $reserva = $horario->reservas()->where('situacao', 'deferida')->first();
                    if ($reserva) {
                        $user_name = User::find($reserva->user_id);
                        array_push($horarios_reservados[$agenda->turno], ['horario' => $horario, 'autor' => $user_name->name]);
                    }
                };
            }
            if (count($gestores_espaco) <= 0) {
                throw new Exception();
            }
            return Inertia::render('Espacos/VisualizarEspacoPage', compact('espaco', 'agendas', 'modulo', 'andar', 'gestores_espaco', 'horarios_reservados'));
        } catch (Exception $th) {
            return redirect()->route('espacos.index')->with('error', 'Espaço sem gestor cadastrado - Aguardando cadastro');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Espaco $espaco)
    {
        $espaco->load('andar.modulo.unidade', 'imagens', 'mainImageIndex');

        return inertia('Espacos/Institucional/CadastroEspacoPage', [ // Usamos a MESMA página React!
            // Dados necessários para os selects
            'unidades' => Unidade::all(),
            'modulos' => Modulo::all(),
            'andares' => Andar::all(),
            // A grande diferença: passamos o 'espaco' a ser editado.
            // No modo de criação, este valor será null.
            'espaco' => $espaco,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateEspacoRequest $request, Espaco $espaco)
    {
        $validated = $request->validated();
        dd($validated);
        try {
            DB::transaction(function () use ($validated, $request, $espaco) {
                // 1. Pega a lista de imagens atuais do espaço
                $currentImagePaths = $espaco->imagens ?? [];

                // 2. Remove imagens marcadas para exclusão
                if (!empty($validated['images_to_delete'])) {
                    // Deleta os arquivos do storage
                    Storage::disk('public')->delete($validated['images_to_delete']);

                    // Remove os paths da lista atual
                    $currentImagePaths = array_diff($currentImagePaths, $validated['images_to_delete']);
                }

                // 3. Adiciona novas imagens
                $newImagePaths = [];
                if ($request->hasFile('imagens')) {
                    foreach ($request->file('imagens') as $file) {
                        $path = $file->store('espacos_images', 'public');
                        $newImagePaths[] = $path;
                    }
                }

                // 4. Junta as listas de imagens (as antigas que sobraram + as novas)
                // Usar array_values para reindexar o array
                $allImagePaths = array_values(array_merge($currentImagePaths, $newImagePaths));

                // 5. Determina a nova imagem principal
                $mainImagePath = null;
                // O frontend envia o índice baseado na lista combinada (antigas + novas)
                if (isset($validated['main_image_index']) && isset($allImagePaths[$validated['main_image_index']])) {
                    $mainImagePath = $allImagePaths[$validated['main_image_index']];
                } elseif (!empty($allImagePaths)) {
                    // Fallback: se o índice não for válido ou a imagem principal foi removida,
                    // usa a primeira imagem da lista como principal.
                    $mainImagePath = $allImagePaths[0];
                }

                // 6. Atualiza o registro do Espaço
                $espaco->update([
                    'nome' => $validated['nome'],
                    'capacidade_pessoas' => $validated['capacidade_pessoas'],
                    'descricao' => $validated['descricao'],
                    'andar_id' => $validated['andar_id'],
                    'imagens' => $allImagePaths, // Salva o array de paths atualizado
                    'main_image_index' => $mainImagePath, // Salva o path da imagem principal
                ]);
            });

            return redirect()->route('espacos.index')->with('success', 'Espaço atualizado com sucesso!');
        } catch (\Exception $e) {
            Log::error("Erro ao atualizar espaço: " . $e->getMessage());
            return redirect()->back()->with('error', 'Ocorreu um erro inesperado ao atualizar o espaço.')->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Espaco $espaco)
    {
        try {
            $espaco->delete();
            return redirect()->route('espacos.index')->with('success', 'Espaço excluído com sucesso!');
        } catch (Exception $error) {
            dd($error->getMessage());
            return redirect()->back()->with('error', 'Erro ao excluir, favor tentar novamente');
        }
    }
}
