<?php

namespace App\Http\Controllers\Institucional;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Importar o modelo User para buscar o usuário
use Illuminate\Validation\Rule; // Importar Rule para validações


class InstitucionalUsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Exemplo de como você passaria dados para a tela de listagem de usuários
        // Para uma tela de edição, geralmente você renderiza a tela `edit` ou `create`
        $users = User::all(); // Busca todos os usuários
        return Inertia::render('Editar/UserController', [
            'users' => $users,
        ]);
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
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('institucional.usuarios.index')->with('success', 'Usuário excluído com sucesso.');
    }
}
