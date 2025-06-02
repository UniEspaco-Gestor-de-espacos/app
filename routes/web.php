<?php

use App\Http\Controllers\AndarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EspacoController;
use App\Http\Controllers\ReservaController;
use App\Http\Middleware\EspacoMiddleware;
use App\Http\Middleware\ReservaMiddleware;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        return Inertia::render('dashboard/index', compact('user'));
    })->name('dashboard');

    // Espacos
    Route::resource('espacos', EspacoController::class)->except(['store', 'update']);
    Route::middleware(EspacoMiddleware::class)->group(function () {
        Route::post('espacos', [EspacoController::class, 'store'])->name('espacos.store');
        Route::put('espacos', [EspacoController::class, 'update'])->name('espacos.update');
        Route::patch('espacos', [EspacoController::class, 'update'])->name('espacos.update');
    });

    // Reservas
    Route::resource('reservas', ReservaController::class)->except(['store', 'update']);
    Route::middleware(ReservaMiddleware::class)->group(function () {
        Route::post('reservas', [ReservaController::class, 'store'])->name('reservas.store');
        Route::put('reservas', [ReservaController::class, 'update'])->name('reservas.update');
        Route::patch('reservas', [ReservaController::class, 'update'])->name('reservas.update');
    });


    Route::resource('agenda', ReservaController::class)->except(['index']);
    Route::resource('andar', AndarController::class);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
