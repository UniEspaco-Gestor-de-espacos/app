<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Unidade;

class Instituicao extends Model
{
    /** @use HasFactory<\Database\Factories\InstituicaoFactory> */
    use HasFactory;

    protected $fillable = [
        'nome',
        'sigla'
    ];

    public function Unidades()
    {
        return $this->hasMany(Unidade::class);
    }
}
