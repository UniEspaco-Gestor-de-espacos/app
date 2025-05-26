<?php

namespace App\Http\Controllers;

use App\Models\AgendaTurno;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Local;
use App\Models\Modulo;
use App\Models\Setor;
use App\Models\Unidade;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

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
        # ESCREVER AS PROPRIEDADES QUE TAO VINDO DO FRONT
        $messages = [
            'modulo.required' => 'O campo módulo é obrigatório.',
            'nome.required' => 'O nome é obrigatório.',
            'capacidadePessoas.required' => 'A capacidade de pessoas é obrigatória.',
            'acessibilidade.required' => 'O campo acessibilidade é obrigatório.',
            'descricao.required' => 'A descrição é obrigatória.',
        ];
        try {
            // Criar agenda
            $espaco = Espaco::create($request->validate([
                'modulo' => 'required',
                'andar' => 'required',
                'nome' => 'required',
                'capacidadePessoas' => 'required',
                'acessibilidade' => 'required',
                'descricao' => 'required',

            ], $messages)); // Valida se todos os campos foram preenchidos corretamente.
            AgendaTurno::create(['turno' => 'manha', 'espaco_id' => $espaco->id]);
            AgendaTurno::create(['turno' => 'tarde', 'espaco_id' => $espaco->id]);
            AgendaTurno::create(['turno' => 'noite', 'espaco_id' => $espaco->id]);

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
        return Inertia::render('espacos/visualizar', compact('espaco'));
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
