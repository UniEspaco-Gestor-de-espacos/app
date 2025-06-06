<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Espaco extends Model
{
    /** @use HasFactory<\Database\Factories\EspacoFactory> */
    use HasFactory;

    protected $fillable = [
        'nome',
        'capacidade_pessoas',
        'descricao',
        'imagens',
        'main_image_index',
        'andar_id',
        'user_id'
    ];

    /**
     * Casting para array os urls das imagens
     *
     * @var array
     */
    protected $casts = [
        'imagens' => 'array'
    ];

    public function agendas()
    {
        return $this->hasMany(Agenda::class);
    }
    public function andar()
    {
        return $this->belongsTo(Andar::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
