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
        // Enum types (Laravel doesn't support enums nativamente em SQLite, mas em MySQL/PostgreSQL sim)
        DB::statement("CREATE TYPE turno AS ENUM ('Manha', 'Tarde', 'Noite')");
        DB::statement("CREATE TYPE situacao AS ENUM ('Em_analise', 'Deferida', 'Indeferida')");
        DB::statement("CREATE TYPE tipo_usuario AS ENUM ('Setor', 'Professor', 'Aluno', 'Externo')");    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop enums (PostgreSQL)
        DB::statement("DROP TYPE IF EXISTS turno");
        DB::statement("DROP TYPE IF EXISTS situacao");
        DB::statement("DROP TYPE IF EXISTS tipo_usuario");
    }
};
