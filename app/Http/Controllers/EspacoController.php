<?php

namespace App\Http\Controllers;

use App\Models\Espaco;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\Inertia;
use Illuminate\Database\QueryException;


class EspacoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $espacos = Espaco::all();
        return Inertia::render('espacos/index', compact('espacos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('espacos/cadastrar');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Espaco::create($request->validate([
            'campus' => 'required',
            'modulo' => 'required',
            'andar' => 'required',
            'nome' => 'required',
            'capacidadePessoas' => 'required',
            'acessibilidade' => 'required',
            'descricao' => 'required',

        ]));

        return Route::redirect('espacos');
    }

    /**
     * Display the specified resource.
     */
    public function show(Espaco $espaco)
    {
        return Inertia::render('espacos/visualizar_espaco', compact('espaco'));
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
            return redirect()->route('espacos.index')->with('success', 'Usuário atualizado com sucesso!');
        } catch (QueryException $e) {
            // Aqui você captura erros específicos do banco de dados
            // Exemplo: erro de chave estrangeira, erro de duplicidade, etc.
            return redirect()->back()->with('error', 'Erro ao salvar no banco de dados: ' . $e->getMessage());
        } catch (\Exception $e) {
            // Captura erros gerais
            return redirect()->back()->with('error', 'Ocorreu um erro inesperado: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Espaco $espaco)
    {
        //
    }
}
