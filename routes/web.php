<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EspacoController;


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

    Route::resource('espacos', EspacoController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
