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
        Schema::create('horarios', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('agenda_id')->constrained('agendas')->onDelete('cascade');
            $table->time('horario_inicio');
            $table->time('horario_fim');
            $table->enum('dia_semana', ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']);
            $table->date('data');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios');
    }
};
