<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservaHorario extends Model
{
    /** @use HasFactory<\Database\Factories\ReservaHorarioFactory> */
    use HasFactory;
    protected $fillable = [
        'id_reserva',
        'id_horario'
    ];
}