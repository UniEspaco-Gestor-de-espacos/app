<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Instituicao;
use App\Models\Setor;

class Unidade extends Model
{
    protected $fillable = [
        'nome',
        'sigla',
        'instituicao_id'
    ];

    public function instituicao()
    {
        return $this->belongsTo(Instituicao::class);
    }

    public function setors()
    {
        return $this->hasMany(Setor::class);
    }
    public function modulos()
    {
        return $this->hasMany(Modulo::class);
    }
}
