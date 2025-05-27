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
            $table->foreignId('agenda_id')->constrained('agenda_turnos')->onDelete('cascade');
            $table->time('horarioInicio');
            $table->time('horarioFim');
            $table->enum('dia_semana', ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']);
            $table->date('data');
            // $table->unique(['agenda_id', 'horarioInicio', 'data']); // Removido pois pode haver mais de uma solicitação para o mesmo dia e mesmo horario
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
