<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agenda_turno', function (Blueprint $table) {
            $table->id();
            $table->enum('turno', ['Manha', 'Tarde', 'Noite']);
            $table->foreignId('espacoId')->constrained('espaco');
            $table->foreignId('gestorId')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda_turno');
    }
};
