<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreModuloRequest;
use App\Http\Requests\StoreSetorRequest;
use App\Http\Requests\UpdateEspacoRequest;
use App\Http\Requests\UpdateModuloRequest;
use App\Http\Requests\UpdateSetorRequest;
use App\Models\Instituicao;
use App\Models\Modulo;
use App\Models\Setor;
use App\Models\Unidade;
use App\Models\User;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InstitucionalSetorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $instituicao = $user->setor->unidade->instituicao->load(['unidades']);
        return Inertia::render('Administrativo/Setores/Setores', [
            'instituicao' => $instituicao,
            'unidades' => Unidade::whereInstituicaoId($instituicao->id)->with(['instituicao', 'setors'])->get(), // Carrega unidades com instituições e setores
            'setores' => Setor::whereHas('unidade', fn($q) => $q->where('instituicao_id', $instituicao->id))->with(['unidade.instituicao'])->get(),
            'usuarios' => User::with(['setor'])->get(), // Carrega setores com unidade e instituição
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()
            ->route('institucional.setors.index')
            ->with('error', 'A criação de setores é a partir do painel administrativo de setores.'); // Redireciona para a lista de setores com mensagem de erro
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSetorRequest $request)
    {
        $request->validated(); // Valida os dados usando a Form Request
        try {
            Setor::create([
                'nome' => $request->validated('nome'),
                'sigla' => $request->validated('sigla'),
                'unidade_id' => $request->validated('unidade_id'),
            ]);

            return redirect()
                ->route('institucional.setors.index')
                ->with('success', 'Setor cadastrado com sucesso!');
        } catch (\Exception $e) {
            return back()
                ->with(['error' => 'Erro ao cadastrar setor: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setor $setor) // Corrigido o nome do parâmetro para $instituico
    {
        return redirect()
            ->route('institucional.setors.index')
            ->with('error', 'A edição de setores é a partir do painel administrativo de setores.'); // Redireciona para a lista de setores com mensagem de erro
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSetorRequest $request, Setor $setor)
    {
        $request->validated(); // Valida os dados usando a Form Request
        try {
            $setor->update([
                'nome' => $request->validated('nome'),
                'sigla' => $request->validated('sigla'),
                'unidade_id' => $request->validated('unidade_id'),
            ]);

            return redirect()
                ->route('institucional.setors.index')
                ->with('success', 'Setor atualizado com sucesso!');
        } catch (\Exception $e) {
            return back()
                ->with(['error' => 'Erro ao atualizar setor: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setor $setor)
    {
        try {
            $setor->delete();
            return redirect()
                ->route('institucional.setors.index')
                ->with('success', 'Setor removido com sucesso!');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Erro ao remover setor: ' . $e->getMessage()]);
        }
    }
}
