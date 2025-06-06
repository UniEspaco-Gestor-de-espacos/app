<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EspacoController;
use App\Http\Controllers\Gestor\GestorEspacoController;
use App\Http\Controllers\Gestor\GestorReservaController;
use App\Http\Controllers\Institucional\InstitucionalAndarController;
use App\Http\Controllers\Institucional\InstitucionalEspacoController;
use App\Http\Controllers\Institucional\InstituicaoController;
use App\Http\Controllers\ModuloController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\UnidadeController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\AtualizarUsuarioMiddleware;
use App\Http\Middleware\AvaliarReservaMiddleware;
use App\Http\Middleware\CadastrarUsuarioMiddleware;
use App\Http\Middleware\CadastroEspacoMiddleware;
use App\Http\Middleware\CadastroReservaMiddleware;
use App\Http\Middleware\EditarEspacoMiddleware;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {

    // Painel geral
    Route::get('dashboard', function () {
        $user = Auth::user();
        switch ($user->permission_type_id) {
            case 1: // Institucional
                return Inertia::render('dashboard/institucional', compact('user'));
            case 2: // Gestor
                return Inertia::render('dashboard/gestor', compact('user'));
            default: // Usuario Comum
                return Inertia::render('dashboard/usuario', compact('user'));
        }
    })->name('dashboard');

    // Visualização de espaços
    Route::get('espacos', [EspacoController::class, 'index'])->name('espacos.index');
    Route::get('espacos/{espaco}', [EspacoController::class, 'show'])->name('espacos.show');

    // Reservas
    // Visualizar
    Route::get('minhas-reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::get('minhas-reservas/{reserva}', [ReservaController::class, 'show'])->name('reservas.show'); // Não usada
    // Cadastrar
    Route::get('reservas/criar', [ReservaController::class, 'create'])->name('reservas.create'); // Não usada
    Route::post('reservas', [ReservaController::class, 'store'])
        ->middleware(CadastroReservaMiddleware::class)->name('reservas.store');
    // Editar antes de avaliada
    Route::middleware([])->group(function () { // Aplicar regra para ver se reserva ja foi avaliada
        Route::get('reservas/{reserva}/editar', [ReservaController::class, 'edit'])->name('reserva.edit');
        Route::patch('reserva/{reserva}', [ReservaController::class, 'update'])->name('reservas.avaliar');
    });

    // Excluir
    Route::delete('minhas-reservas/{reserva}', [ReservaController::class, 'destroy'])->name('reservas.destroy');


    // Rotas Usuario gestor
    Route::prefix('gestor')->name('gestor.')->group(function () {

        // Gestão de reservas
        Route::get('reservas', [GestorReservaController::class, 'index'])->name('reservas.index');
        Route::get('reservas/{reserva}', [GestorReservaController::class, 'show'])->name('reservas.show');
        Route::patch('reserva/{reserva}/avaliar', [GestorReservaController::class, 'avaliar'])
            ->middleware(AvaliarReservaMiddleware::class)->name('reservas.avaliar'); // TODO: Criar regras de avaliar reserva

        // Gestão de espaços
        Route::get('espacos', [GestorEspacoController::class, 'index'])->name('espacos.index');
        // Criar
        Route::get('espacos/criar', [GestorEspacoController::class, 'create'])->name('espacos.create');
        Route::post('espacos', [GestorEspacoController::class, 'store'])
            ->middleware(CadastroEspacoMiddleware::class)->name('espacos.store');
        // Editar
        Route::get('espacos/{espaco}/editar', [GestorEspacoController::class, 'edit'])->name('espacos.edit');
        Route::patch('espacos/{espaco}', [GestorEspacoController::class, 'update'])
            ->middleware(EditarEspacoMiddleware::class)->name('espacos.update'); // TODO: Criar regras de editar espaço
        // Deleta
        Route::delete('espacos/{espaco}', [GestorEspacoController::class, 'destroy'])->name('espacos.destroy');
    });


    Route::prefix('institucional')->name('institucional.')->group(function () {

        // Usuarios
        Route::resource('usuarios', UsuarioController::class)->except(['store', 'update']);
        Route::patch('usuarios/{usuario}', [UsuarioController::class, 'update'])
            ->middleware(AtualizarUsuarioMiddleware::class)->name('usuario.update'); // TODO: Criar Validação
        Route::post('usuarios', [UsuarioController::class, 'store'])
            ->middleware(CadastrarUsuarioMiddleware::class)->name('usuario.store'); // TODO: Criar Validação

        // Instituicao
        Route::resource('instituicoes', InstituicaoController::class);

        // Unidades
        Route::resource('unidades', UnidadeController::class);

        // Modulos
        Route::resource('modulos', ModuloController::class);

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
