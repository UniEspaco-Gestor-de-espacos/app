<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaTurno extends Model
{
    /** @use HasFactory<\Database\Factories\AgendaTurnoFactory> */
    use HasFactory;
    protected $fillable = [
        'turno',
        'espaco_id',
        'user_id'
    ];
    public function espaco()
    {
        return $this->belongsTo(Espaco::class);
    }
    public function horarios()
    {
        return $this->hasMany(Horario::class);
    }
}
