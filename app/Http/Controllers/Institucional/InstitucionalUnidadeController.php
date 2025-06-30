<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Models\Instituicao;
use App\Models\Unidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitucionalUnidadeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instituicoes = Instituicao::all();
        $unidades = Unidade::with(['instituicao'])->latest()->paginate(10);

        return Inertia::render('Administrativo/Unidades/Unidades', [
            'unidades' => $unidades,
            'instituicoes' => $instituicoes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $instituicoes = Instituicao::all();
        return Inertia::render('Administrativo/Unidades/CadastrarUnidade', [
            'instituicoes' => $instituicoes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:10',
            'instituicao_id' => 'required|exists:instituicaos,id',
        ]);
        try {
            Unidade::create($validated);
            return redirect()->route('institucional.unidades.index')->with('success', 'Unidade criada com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.unidades.index')->with('error', 'Erro ao criar o unidade: ' . $th->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unidade $unidade) // Corrigido o nome do parâmetro para $instituico
    {
        $unidade->load('instituicao'); // Carrega a unidade e a instituição associada ao módulo
        // Verifica se o módulo existe
        $instituicoes = Instituicao::all();
        return Inertia::render('Administrativo/Unidades/EditarUnidade', [
            'instituicoes' => $instituicoes,
            'unidade' => $unidade,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unidade $unidade)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:10',
            'instituicao_id' => 'required|exists:instituicaos,id',
        ]);

        try {
            $unidade->update([
                'nome' => $validated['nome'],
                'sigla' => $validated['sigla'],
                'instituicao_id' => $validated['instituicao_id'],
            ]);

            $unidade->save();

            return redirect()->route('institucional.unidades.index')->with('success', 'Unidade atualizada com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.unidades.index')->with('error', 'Erro ao atualizar a unidade: ' . $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unidade $unidade)
    {
        try {
            $unidade->delete();

            return back()->with('success', 'Unidade excluída com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.unidades.index')->with('error', 'Erro ao deletar o unidade: ' . $th->getMessage());
        }
    }
}
