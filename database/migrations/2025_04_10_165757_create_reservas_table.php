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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idEspaco')->constrained('espacos');
            $table->foreignId('idSolicitante')->constrained('users');
            $table->string('titulo');
            $table->text('descricao');
            $table->enum('situacao', ['Em_analise', 'Deferida', 'Indeferida'])->default('Em_analise');;
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
        Schema::dropIfExists('reservas');
    }
};
