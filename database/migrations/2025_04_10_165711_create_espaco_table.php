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
        Schema::create('espaco', function (Blueprint $table) {
            $table->id();
            $table->string('campus');
            $table->string('modulo');
            $table->string('andar');
            $table->string('numero');
            $table->integer('capacidadePessoas');
            $table->boolean('acessibilidade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('espaco');
    }
};
