<?php

namespace Database\Seeders;

use App\Models\Local;
use App\Models\Modulo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Local::factory(10)->create();
    }
}
