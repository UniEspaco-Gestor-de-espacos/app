<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EspacoController;
use App\Http\Controllers\Gestor\GestorAndarController;
use App\Http\Controllers\Gestor\GestorEspacoController;
use App\Http\Controllers\Gestor\GestorReservaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Institucional\InstitucionalAndarController;
use App\Http\Controllers\Institucional\InstitucionalEspacoController;
use App\Http\Controllers\Institucional\InstitucionalInstituicaoController;
use App\Http\Controllers\Institucional\InstitucionalModuloController;
use App\Http\Controllers\Institucional\InstitucionalUnidadeController;
use App\Http\Controllers\Institucional\InstitucionalUsuarioController;
use App\Http\Controllers\ReservaController;
use App\Http\Middleware\AtualizarUsuarioMiddleware;
use App\Http\Middleware\AvaliarReservaMiddleware;
use App\Http\Middleware\CadastrarUsuarioMiddleware;
use App\Http\Middleware\CadastroEspacoMiddleware;
use App\Http\Middleware\CadastroReservaMiddleware;
use App\Http\Middleware\EditarEspacoMiddleware;

// Página inicial: redireciona para dashboard se autenticado, senão para login
Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // ---------------------------
    // Painel Geral
    // ---------------------------
    Route::get('dashboard', [HomeController::class, 'index'])->name('dashboard');

    // ---------------------------
    // Visualização de Espaços
    // ---------------------------
    Route::get('espacos', [EspacoController::class, 'index'])->name('espacos.index');
    Route::get('espacos/{espaco}', [EspacoController::class, 'show'])->name('espacos.show');

    // ---------------------------
    // Reservas
    // ---------------------------

    // Visualizar reservas do usuário
    Route::get('minhas-reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::get('minhas-reservas/{reserva}', [ReservaController::class, 'show'])->name('reservas.show'); // Não usada

    // Cadastrar nova reserva
    Route::get('reservas/criar', [ReservaController::class, 'create'])->name('reservas.create'); // Não usada
    Route::post('reservas', [ReservaController::class, 'store'])
        ->middleware(CadastroReservaMiddleware::class)->name('reservas.store');

    // Editar reserva (antes de ser avaliada)
    Route::middleware([])->group(function () {
        Route::get('reservas/{reserva}/editar', [ReservaController::class, 'edit'])->name('reserva.edit');
        Route::patch('reserva/{reserva}', [ReservaController::class, 'update'])->name('reservas.avaliar');
    });

    // Editar e a sala para favoritar.
    Route::middleware([])->group(function () { // Aplicar regra para ver se reserva ja foi avaliada
        /* 
        Obs: Essa informações pode apagar se quiser, só foi para ter uma noção 
        de como estava a estrutura antes de criar o controller de reservas.

        Get para favoritar a reserva, exibir o botão de favoritar.
        Patch para atualizar o status de favoritar a reserva.
        Isso é útil para que o usuário possa favoritar uma reserva e depois desfavoritar.
        */
        /*  
        Agora [ReservaController::class, 'favoritar'] e [ReservaController::class, 'updateFavoritar']
        são usados para lidar com a lógica de favoritar e desfavoritar reservas.
        O primeiro exibe o botão de favoritar, enquanto o segundo atualiza o status de favoritar.
        Isso permite que o usuário possa favoritar uma reserva e depois desfavoritar,
        mantendo a flexibilidade de interação com as reservas.
        Isso é útil para que o usuário possa favoritar uma reserva e depois desfavoritar.

        Vamos mandar essa parte do CRUD para o controller de reservas,
        pois é uma ação que envolve o usuário e a reserva, e não apenas o espaço.
        */

        Route::get('espacos/{espaco}/favoritar', [EspacoController::class, 'favoritar'])->name('espacos.favoritar');
        Route::patch('espacos/{espaco}/favoritar', [EspacoController::class, 'updateFavoritar'])
            ->name('espacos.update.favoritar');
    });


    // Excluir
    Route::delete('minhas-reservas/{reserva}', [ReservaController::class, 'destroy'])->name('reservas.destroy');

    // ---------------------------
    // Rotas para Usuário Gestor
    // ---------------------------
    Route::middleware([])->prefix('gestor')->name('gestor.')->group(function () {

        // Gestão de reservas
        Route::get('reservas', [GestorReservaController::class, 'index'])->name('reservas.index');
        Route::get('reservas/{reserva}', [GestorReservaController::class, 'show'])->name('reservas.show');
        Route::patch('reserva/{reserva}/avaliar', [GestorReservaController::class, 'update'])
            ->middleware(AvaliarReservaMiddleware::class)->name('reservas.avaliar'); // TODO: Criar regras de avaliar reserva

        // Gestão de espaços
        Route::get('espacos', [GestorEspacoController::class, 'index'])->name('espacos.index');
    });

    // ---------------------------
    // Rotas Institucionais
    // ---------------------------
    Route::prefix('institucional')->name('institucional.')->group(function () {

        // Usuários
        Route::resource('usuarios', InstitucionalUsuarioController::class)->except(['store', 'update']);
        Route::patch('usuarios/{usuario}', [InstitucionalUsuarioController::class, 'update'])
            ->middleware(AtualizarUsuarioMiddleware::class)->name('usuario.update'); // TODO: Criar Validação
        Route::post('usuarios', [InstitucionalUsuarioController::class, 'store'])
            ->middleware(CadastrarUsuarioMiddleware::class)->name('usuario.store'); // TODO: Criar Validação

        // Tela de criação de usuário
        Route::get('usuarios/criar', [InstitucionalUsuarioController::class, 'create'])->name('usuarios.create');
        // Tela de edição de usuário
        Route::get('usuarios/{usuario}/edit', [InstitucionalUsuarioController::class, 'edit'])->name('usuarios.edit');

        // Instituições
        Route::resource('instituicoes', InstitucionalInstituicaoController::class);

        // Unidades
        Route::resource('unidades', InstitucionalUnidadeController::class);

        // Módulos
        Route::resource('modulos', InstitucionalModuloController::class);

        // Andares
        Route::resource('andares', InstitucionalAndarController::class);

        // Espaços
        Route::resource('espacos', InstitucionalEspacoController::class)->except(['store', 'update']);
        Route::patch('espacos/{espaco}', [InstitucionalEspacoController::class, 'update'])
            ->middleware(EditarEspacoMiddleware::class)->name('espacos.update'); // TODO: Criar regras de editar espaço
        Route::post('espacos', [InstitucionalEspacoController::class, 'store'])
            ->middleware(CadastroEspacoMiddleware::class)->name('espacos.store');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
