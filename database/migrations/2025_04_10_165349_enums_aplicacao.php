<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enum types (Laravel doesn't support enums nativamente em SQLite, mas em MySQL/PostgreSQL sim)
        DB::statement("CREATE TYPE turno AS ENUM ('manha', 'tarde', 'noite')");
        DB::statement("CREATE TYPE situacao AS ENUM ('em_analise', 'deferida', 'indeferida')");
        DB::statement("CREATE TYPE dia_semana AS ENUM ('seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop enums (PostgreSQL)
        DB::statement("DROP TYPE IF EXISTS turno");
        DB::statement("DROP TYPE IF EXISTS situacao");
        DB::statement("DROP TYPE IF EXISTS dia_semana");
    }
};
