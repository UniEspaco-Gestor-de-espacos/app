<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Andar extends Model
{
    /** @use HasFactory<\Database\Factories\AndarFactory> */
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo_acesso',
        'modulo_id'
    ];

    /**
     * Atributos que vão ser feito o cast
     *
     * @var array
     */
    protected $casts = [
        'tipo_acesso' => 'array'
    ];
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($andar) {
            if ($andar->isDirty('nome') || empty($andar->nome_normalizado)) {
                $andar->nome_normalizado = static::normalizarNome($andar->nome);
            }
        });
    }
    /**
     * Normaliza o nome do andar para comparação e unicidade.
     *
     * @param  string  $nome
     * @return string
     */
    public static function normalizarNome(string $nome): string
    {
        $nomeNormalizado = mb_strtolower($nome, 'UTF-8'); // Converte para minúsculas
        $nomeNormalizado = str_replace(['º', 'ª', '°'], '', $nomeNormalizado); // Remove indicadores ordinais
        $nomeNormalizado = preg_replace('/\s+/', '', $nomeNormalizado); // Remove todos os espaços em branco
        return $nomeNormalizado;
    }

    public function modulo()
    {
        return $this->belongsTo(Modulo::class);
    }
    public function espacos()
    {
        return $this->hasMany(Espaco::class);
    }
}
