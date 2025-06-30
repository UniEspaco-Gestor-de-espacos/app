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
use App\Http\Middleware\GestorMiddleware;
use App\Http\Middleware\InstitucionalMiddleware;

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

    Route::resource('reservas', ReservaController::class);

    // ---------------------------
    // Rotas para Usuário Gestor
    // ---------------------------
    Route::middleware([GestorMiddleware::class])->prefix('gestor')->name('gestor.')->group(function () {
        Route::resource('reservas', GestorReservaController::class)->except('patch');
    });

    // ---------------------------
    // Rotas Institucionais
    // ---------------------------
    Route::middleware([InstitucionalMiddleware::class])->prefix('institucional')->name('institucional.')->group(function () {

        // Usuários
        Route::resource('usuarios', InstitucionalUsuarioController::class)->except(['store', 'update']);

        // Instituições
        Route::resource('instituicoes', InstitucionalInstituicaoController::class)->except(['show']);

        // Unidades
        Route::resource('unidades', InstitucionalUnidadeController::class);

        // Módulos
        Route::resource('modulos', InstitucionalModuloController::class);

        // Andares
        Route::resource('andares', InstitucionalAndarController::class);

        // Espaços
        Route::resource('espacos', InstitucionalEspacoController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
