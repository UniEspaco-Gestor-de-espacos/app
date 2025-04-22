<?php

namespace App\Http\Controllers;

use App\Models\Espaco;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\Inertia;

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
        try{
            $espaco->update($request->validate([
                'campus' => 'required',
                'modulo' => 'required',
                'andar' => 'required',
                'nome' => 'required',
                'capacidadePessoas' => 'required',
                'acessibilidade' => 'required',
                'descricao' => 'required'
            ]));
            return redirect()->back()->with('success', 'Usuário atualizado com sucesso!');
        }catch(){

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
