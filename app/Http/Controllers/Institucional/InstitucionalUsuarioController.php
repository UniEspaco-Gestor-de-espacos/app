<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\Andar;
use App\Models\Espaco;
use App\Models\Instituicao;
use App\Models\Modulo;
use App\Models\PermissionType;
use App\Models\Setor;
use App\Models\Unidade;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Importar o modelo User para buscar o usuário
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule; // Importar Rule para validações


class InstitucionalUsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with([
            'setor.unidade.instituicao',
            'agendas.espaco.andar.modulo.unidade.instituicao'
        ])->get();

        $permissionTypes = PermissionType::all()->map(function ($type) {
            return [
                'id' => $type->id,
                'nome' => $type->nome,
                'label' => $type->nome,
            ];
        });

        return Inertia::render('Administrativo/Usuarios/Usuarios', [
            'users' => $users,
            'permissionTypes' => $permissionTypes,
            'instituicoes' => Instituicao::with([
                'unidades.modulos.andars.espacos.agendas'
            ])->get(),
            'setores' => Setor::with([
                'unidade.instituicao',
                'users.agendas.espaco.andar.modulo.unidade.instituicao'
            ])->get(),

        ]);
    }



    public function updatePermissions(Request $request, User $user)
    {
        $validated = $request->validate([
            'permission_type_id' => ['required', 'exists:permission_types,id'],
            'agendas' => ['array'], // Permite que agendas seja um array vazio ou com IDs
        ]);
        $userId = $user->id;
        $agendaIds = $validated['agendas'] ?? []; // Pega os IDs das agendas ou um array vazio se não houver
        try {
            DB::transaction(function () use ($validated, $user, $userId, $agendaIds) {
                // Atualiza a permissão do usuário
                $user->permission_type_id = $validated['permission_type_id'];
                $user->save();

                if ($validated['permission_type_id'] == 1 || $validated['permission_type_id'] == 3) {
                    // Se a permissão for de administrador, limpa as agendas associadas
                    Agenda::where('user_id', $userId)
                        ->update(['user_id' => null]);
                } else {
                    Agenda::where('user_id', $userId)
                        ->whereNotIn('id', $agendaIds)
                        ->update(['user_id' => null]);

                    // 2. Associa as novas (ou existentes) agendas a este usuário
                    // Pega agendas da nova lista e define o user_id para o ID deste usuário
                    Agenda::whereIn('id', $agendaIds)
                        ->update(['user_id' => $userId]);
                }
            });
            DB::commit();
            return redirect()->route('institucional.usuarios.index')->with('success', 'Permissões atualizadas com sucesso.');
        } catch (\Throwable $th) {
            DB::rollBack();
            // Captura qualquer erro e retorna uma resposta de erro
            return redirect()->route('institucional.usuarios.index')->with('error', 'Erro ao atualizar permissões: ' . $th->getMessage());
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Renderiza o componente UserController para criação de um novo usuário
        // Você pode passar listas de roles e statuses disponíveis
        $roles = ['admin', 'gestor', 'user']; // Exemplo de funções
        $statuses = ['active', 'inactive', 'suspended']; // Exemplo de status
        return Inertia::render('Editar/UserController', [
            'roles' => $roles,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'role' => ['required', 'string', Rule::in(['admin', 'gestor', 'user'])],
            'status' => ['required', 'string', Rule::in(['active', 'inactive', 'suspended'])],
            // 'password' => ['required', 'string', 'min:8', 'confirmed'], // Adicionar senha para criação
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
            // 'password' => bcrypt($request->password), // Criptografar a senha
        ]);

        return redirect()->route('institucional.usuarios.index')->with('success', 'Usuário criado com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Geralmente, a tela de "show" exibe os detalhes de um usuário.
        // Você pode renderizar um componente React para isso, ou usar os dados diretamente.
        $user = User::findOrFail($id);
        return Inertia::render('Editar/UserDetail', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);
        $roles = ['admin', 'gestor', 'user']; // Exemplo de funções
        $statuses = ['active', 'inactive', 'suspended']; // Exemplo de status

        // Renderiza o componente UserController passando o usuário a ser editado
        return Inertia::render('Editar/UserController', [
            'user' => $user,
            'roles' => $roles,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['admin', 'gestor', 'user'])],
            'status' => ['required', 'string', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
        ]);

        return redirect()->route('institucional.usuarios.index')->with('success', 'Usuário atualizado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return redirect()->route('institucional.usuarios.index')->with('success', 'Usuário excluído com sucesso.');
        } catch (\Throwable $th) {
            return redirect()->route('institucional.usuarios.index')->with('error', 'Erro ao Usuário excluir.');
        }
    }
}
