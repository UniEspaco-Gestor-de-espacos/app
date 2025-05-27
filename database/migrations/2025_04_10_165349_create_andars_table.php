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
        Schema::create('andars', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('nome');
            $table->string('nome_normalizado');
            $table->json('tipo_acesso')->nullable();
            $table->foreignId('modulo_id')->constrained('modulos')->onDelete('cascade');
            $table->unique(['nome_normalizado', 'modulo_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('andars');
    }
};
