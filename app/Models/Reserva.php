<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    /** @use HasFactory<\Database\Factories\ReservaFactory> */
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descricao',
        'situacao',
        'data_inicial',
        'data_final',
        'observacao',
        'user_id'
    ];

    public function horarios()
    {
        return $this->belongsToMany(Horario::class, 'reserva_horario')->withTimestamps();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
