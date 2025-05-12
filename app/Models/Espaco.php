<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Espaco extends Model
{
    /** @use HasFactory<\Database\Factories\EspacoFactory> */
    use HasFactory;

    protected $fillable = [
        'modulo',
        'nome',
        'capacidadePessoas',
        'acessibilidade',
        'descricao',
        'setor_id',
    ];

    public function agendaTurnos()
    {
        return $this->hasMany(AgendaTurno::class);
    }
    public function setor()
    {
        return $this->belongsTo(Setor::class);
    }
    public function modulo()
    {
        return $this->belongsTo(Modulo::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
