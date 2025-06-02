<?php

namespace Database\Seeders;

use App\Models\Andar;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AndarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Andar::factory(10)->create();
    }
}
