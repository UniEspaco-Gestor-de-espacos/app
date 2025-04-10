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
        Schema::create('reserva_horario', function (Blueprint $table) {
            $table->foreignId('idReserva')->constrained('reserva');
            $table->foreignId('idHorario')->constrained('horario');
            $table->primary(['idReserva', 'idHorario']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserva_horario');
    }
};
