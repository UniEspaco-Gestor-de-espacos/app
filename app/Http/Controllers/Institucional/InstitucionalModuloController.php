<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreModuloRequest;
use App\Http\Requests\UpdateEspacoRequest;
use App\Http\Requests\UpdateModuloRequest;
use App\Models\Instituicao;
use App\Models\Modulo;
use App\Models\Unidade;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InstitucionalModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modulos = Modulo::with(['andars', 'unidade.instituicao'])->latest()->paginate(10);

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
    public function store(StoreModuloRequest $request)
    {
        $request->validated(); // Valida os dados usando a Form Request
        try {
            DB::beginTransaction();

            // Criar o módulo
            $modulo = Modulo::create([
                'nome' => $request->validated('nome'),
                'unidade_id' => $request->validated('unidade_id'),
            ]);

            // Criar os andares
            foreach ($request->validated('andares') as $andarData) {
                $modulo->andars()->create([
                    'nome' => $andarData['nome'],
                    'tipo_acesso' => $andarData['tipo_acesso'],
                ]);
            }

            DB::commit();

            return redirect()
                ->route('institucional.modulos.index')
                ->with('success', 'Módulo cadastrado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->with(['error' => 'Erro ao cadastrar módulo: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modulo $modulo) // Corrigido o nome do parâmetro para $instituico
    {
        $modulo->load(['andars', 'unidade.instituicao']); // Carrega a unidade e a instituição associada ao módulo
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
    public function update(UpdateModuloRequest $request, Modulo $modulo)
    {
        try {
            DB::beginTransaction();

            // Atualizar dados básicos do módulo
            $modulo->update([
                'nome' => $request->validated('nome'),
                'unidade_id' => $request->validated('unidade_id'),
            ]);

            // Remover andares existentes e recriar
            $modulo->andars()->delete();

            // Criar novos andares
            foreach ($request->validated('andares') as $andarData) {
                $modulo->andars()->create([
                    'nome' => $andarData['nome'],
                    'tipo_acesso' => $andarData['tipo_acesso'],
                ]);
            }

            DB::commit();

            return redirect()
                ->route('institucional.modulos.index')
                ->with('success', 'Módulo atualizado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->with(['error' => 'Erro ao atualizar módulo: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modulo $modulo)
    {
        try {
            DB::beginTransaction();

            // Remover andares primeiro (devido à foreign key)
            $modulo->andars()->delete();

            // Remover o módulo
            $modulo->delete();

            DB::commit();

            return redirect()
                ->route('institucional.modulos.index')
                ->with('success', 'Módulo removido com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Erro ao remover módulo: ' . $e->getMessage()]);
        }
    }
}
