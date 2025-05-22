<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Local extends Model
{
    /** @use HasFactory<\Database\Factories\LocalFactory> */
    use HasFactory;

    protected $fillable = [
        'andar',
        'tipo_acesso'
    ];

    /**
     * Atributos que vão ser feito o cast
     *
     * @var array
     */
    protected $casts = [
        'tipo_acesso' => 'array'
    ];

    public function modulo()
    {
        return $this->belongsTo(Modulo::class);
    }
}
