<?php

namespace App\Policies;

use App\Models\Reserva;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReservaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Reserva $reserva): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * Esta ação agora pode ser realizada por dois atores diferentes com regras distintas:
     * 1. O USUÁRIO dono da reserva, SE a situação for 'em analise'.
     * 2. O GESTOR da agenda da reserva, a qualquer momento (para avaliar/reavaliar).
     */
    public function update(User $user, Reserva $reserva): bool
    {
        // REGRA 1: O usuário pode alterar a reserva caso ainda esteja em análise.
        if ($user->id === $reserva->user_id && $reserva->situacao === 'em_analise') return true;

        // REGRA 2: O Gestor pode avaliar (atualizar) a reserva.
        // Verificamos se existe ('exists') algum horário nesta reserva que satisfaça
        // a condição de ter uma agenda cujo gestor_id seja o id do usuário atual.
        if ($reserva->horarios()
            ->whereHas('agenda', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->exists()
        ) return true;

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reserva $reserva): bool
    {
        return $user->id === $reserva->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Reserva $reserva): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Reserva $reserva): bool
    {
        return false;
    }
}
