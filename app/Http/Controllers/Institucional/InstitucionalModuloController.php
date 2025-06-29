<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Models\Instituicao;
use App\Models\Modulo;
use App\Models\Unidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitucionalModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modulos = Modulo::with(['unidade.instituicao'])->latest()->paginate(10);

        return Inertia::render('Administrativo/Modulos/Modulos', [
            'modulos' => $modulos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $instituicoes = Instituicao::all();
        $unidades = Unidade::with(['instituicao'])->get();
        return Inertia::render('Administrativo/Modulos/CadastrarModulo', [
            'instituicoes' => $instituicoes,
            'unidades' => $unidades,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'unidade_id' => 'required|exists:unidades,id',
        ]);
        try {
            Modulo::create($validated);
            return redirect()->route('institucional.modulos.index')->with('success', 'Modulo criado com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.modulos.index')->with('error', 'Erro ao criar o modulo: ' . $th->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modulo $modulo) // Corrigido o nome do parâmetro para $instituico
    {
        $modulo->load('unidade.instituicao'); // Carrega a unidade e a instituição associada ao módulo
        // Verifica se o módulo existe
        $instituicoes = Instituicao::all();
        $unidades = Unidade::with(['instituicao'])->get();
        return Inertia::render('Administrativo/Modulos/EditarModulo', [
            'instituicoes' => $instituicoes,
            'unidades' => $unidades,
            'modulo' => $modulo,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Modulo $modulo)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'unidade_id' => 'required|exists:unidades,id',
        ]);

        try {
            $modulo->update([
                'nome' => $validated['nome'],
                'unidade_id' => $validated['unidade_id'],
            ]);

            $modulo->save();

            return redirect()->route('institucional.modulos.index')->with('success', 'Modulo atualizado com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.modulos.index')->with('error', 'Erro ao atualizar a modulo: ' . $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modulo $modulo)
    {
        try {
            $modulo->delete();

            return back()->with('success', 'Modulo excluído com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.modulos.index')->with('error', 'Erro ao deletar o modulo: ' . $th->getMessage());
        }
    }
}
