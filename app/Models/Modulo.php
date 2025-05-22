<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    protected $fillable = [
        'nome',
        'andar',
        'unidade_id'
    ];
    public function unidade()
    {
        return $this->belongsTo(Unidade::class);
    }
    public function espacos()
    {
        return $this->hasMany(Espaco::class);
    }
    public function locals()
    {
        return $this->hasMany(Local::class);
    }
}
