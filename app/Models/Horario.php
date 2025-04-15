<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    /** @use HasFactory<\Database\Factories\HorarioFactory> */
    use HasFactory;
    protected $fillable = [
        'horarioInicio',
        'horarioFim'
    ];

    public function reserva(){
        return $this->belongsToMany(Reserva::class, 'reserva_horario', 'reserva_id', 'horario_id')->withoutTimestamps();
    }
}
