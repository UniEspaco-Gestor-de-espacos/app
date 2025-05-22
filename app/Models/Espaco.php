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
        'imagens',
        'modulo_id'
    ];

    /**
     * Casting para array os urls das imagens
     *
     * @var array
     */
    protected $casts = [
        'imagens' => 'array'
    ];

    public function agendaTurnos()
    {
        return $this->hasMany(AgendaTurno::class);
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
