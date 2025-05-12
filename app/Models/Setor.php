<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Unidade;

class Setor extends Model
{
    /** @use HasFactory<\Database\Factories\SetorFactory> */
    use HasFactory;

    protected $fillable = [
        'nome',
        'sigla',
        'unidade_id'
    ];


    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function unidade()
    {
        return $this->belongsTo(Unidade::class);
    }
    public function espacos()
    {
        return $this->hasMany(Espaco::class);
    }
}
