<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Setor;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telefone',
        'profile_pic',
        'permission_type_id',
        'setor_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function setor()
    {
        return $this->belongsTo(Setor::class);
    }
    public function agendas()
    {
        return $this->hasMany(Agenda::class, 'user_id');
    }
    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    public function espaco()
    {
        return $this->belongsTo(Espaco::class, 'espaco_id', 'id');
    }

    // Espaco.php
    public function andar()
    {
        return $this->espaco->andar();
    }

    // Andar.php
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }
}
