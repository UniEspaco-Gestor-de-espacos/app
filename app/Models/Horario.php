<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{

    use HasFactory;
    protected $fillable = [
        'agenda_id',
        'horario_inicio',
        'horario_fim',
        'data',
    ];

    public function reservas()
    {
        return $this->belongsToMany(Reserva::class, 'reserva_horario')
            ->withPivot(['situacao', 'justificativa', 'user_id'])
            ->withTimestamps();
    }
    public function agenda()
    {
        return $this->belongsTo(Agenda::class);
    }
}
