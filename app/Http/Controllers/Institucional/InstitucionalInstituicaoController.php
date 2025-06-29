<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Models\Instituicao;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitucionalInstituicaoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instituicoes = Instituicao::latest();

        return Inertia::render('Administrativo/Instituicoes/Instituicoes', [
            'instituicoes' => $instituicoes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Instituicoes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:50',
            'endereço' => 'nullable|string|max:255',
        ]);

        Instituicao::create($validated);

        return to_route('admin.instituicoes.index')->with('success', 'Instituição criada com sucesso.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Instituicao $instituicao)
    {
        return Inertia::render('Admin/Instituicoes/Edit', [
            'instituicao' => $instituicao,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Instituicao $instituicao)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:50',
            'endereço' => 'nullable|string|max:255',
        ]);

        $instituicao->update($validated);

        return to_route('admin.instituicoes.index')->with('success', 'Instituição atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Instituicao $instituicao)
    {
        $instituicao->delete();

        // O 'back()' é útil aqui para que o usuário permaneça na mesma página da paginação
        return back()->with('success', 'Instituição excluída com sucesso.');
    }
}
