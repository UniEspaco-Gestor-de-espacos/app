<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Instituicao;
use App\Models\Setor;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unidade extends Model
{
    use HasFactory;
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
