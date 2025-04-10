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
        Schema::create('reserva', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idEspaco')->constrained('espaco');
            $table->foreignId('idSolicitante')->constrained('usuario');
            $table->string('titulo');
            $table->text('descricao');
            $table->enum('situacao', ['Em_analise', 'Deferida', 'Indeferida']);
            $table->dateTime('dataInicio');
            $table->dateTime('dataFinal');
            $table->text('observacao')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserva');
    }
};
