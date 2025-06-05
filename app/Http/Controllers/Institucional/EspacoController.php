<?php

namespace App\Http\Controllers;

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


class InstitucionalEspacoController extends Controller
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $unidades = Unidade::all();
        $modulos = Modulo::all();
        $andares = Andar::all();
        return Inertia::render('espacos/cadastrar', compact('unidades', 'modulos', 'andares'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $storedImagePaths = [];
        $mainImagePath = null;
        try {
            if ($request->hasFile('imagens')) {
                $uploadedImages = $request->file('imagens'); // Pega o array de UploadedFile

                foreach ($uploadedImages as $index => $uploadedFile) {
                    // Salva a imagem em no diretorio publico espacos_images
                    $path = $uploadedFile->store('espacos_images', 'public');
                    $storedImagePaths[] = $path;

                    // Verifica se esta é a imagem principal baseada no índice enviado
                    if (isset($form_validado['main_image_index']) && (int)$form_validado['main_image_index'] === $index) {
                        $mainImagePath = $path;
                    }
                }
                // Se mainImagePath não foi definido pelo índice (ex: índice inválido ou não enviado)
                // e há imagens, defina a primeira como principal por padrão.
                if (!$mainImagePath && !empty($storedImagePaths)) {
                    $mainImagePath = $storedImagePaths[0];
                }
            }

            $espaco = Espaco::create([
                'nome' => $request['nome'],
                'capacidade_pessoas' => $request['capacidade_pessoas'],
                'descricao' => $request['descricao'],
                'imagens' => $storedImagePaths, // Eloquent vai converter para JSON por causa do $casts
                'main_image_index' => $mainImagePath,
                'andar_id' => $request['andar_id'],
            ]);
            // Criar agenda
            $agenda_manha = Agenda::create(['turno' => 'manha', 'espaco_id' => $espaco->id]);
            $agenda_tarde = Agenda::create(['turno' => 'tarde', 'espaco_id' => $espaco->id]);
            $agenda_noite = Agenda::create(['turno' => 'noite', 'espaco_id' => $espaco->id]);

            return redirect()->route('espacos.index')->with('success', 'Espaco cadastrado com sucesso!');
        } catch (QueryException $e) { // Captura erro no banco de dados
            return redirect()->back()->with('error', 'Erro ao salvar no banco de dados: ' . $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocorreu um erro inesperado: ' . $e->getMessage());
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
            return Inertia::render('espacos/visualizar', compact('espaco', 'agendas', 'modulo', 'andar', 'gestores_espaco', 'horarios_reservados'));
        } catch (Exception $th) {
            return redirect()->route('espacos.index')->with('error', 'Espaço sem gestor cadastrado - Aguardando cadastro');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Espaco $espaco)
    {
        return Inertia::render('espacos/editar', compact('espaco'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Espaco $espaco)
    {
        $messages = [
            'campus.required' => 'O campo campus é obrigatório.',
            'modulo.required' => 'O campo módulo é obrigatório.',
            'andar.required' => 'O campo andar é obrigatório.',
            'nome.required' => 'O nome é obrigatório.',
            'capacidadePessoas.required' => 'A capacidade de pessoas é obrigatória.',
            'acessibilidade.required' => 'O campo acessibilidade é obrigatório.',
            'descricao.required' => 'A descrição é obrigatória.',
        ];
        try {
            $espaco->update($request->validate([
                'campus' => 'required',
                'modulo' => 'required',
                'andar' => 'required',
                'nome' => 'required',
                'capacidadePessoas' => 'required',
                'acessibilidade' => 'required',
                'descricao' => 'required'
            ], $messages));
            return redirect()->route('espacos.index')->with('success', 'Espaço atualizado com sucesso!');
        } catch (QueryException $e) {
            // Aqui você captura erros específicos do banco de dados
            // Exemplo: erro de chave estrangeira, erro de duplicidade, etc.
            return redirect()->back()->with('error', 'Erro ao salvar no banco de dados: ' . $e->getMessage());
        } catch (Exception $e) {
            // Captura erros gerais
            return redirect()->back()->with('warning', 'Ocorreu um erro inesperado: ' . $e->getMessage());
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
