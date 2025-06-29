<?php

namespace App\Policies;

use App\Models\Espaco;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EspacoPolicy
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
    public function view(User $user, Espaco $espaco): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->permission_type_id === 1;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Espaco $espaco): bool
    {
        return $user->permission_type_id === 1;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Espaco $espaco): bool
    {
        return $user->permission_type_id === 1;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Espaco $espaco): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Espaco $espaco): bool
    {
        return false;
    }
}
