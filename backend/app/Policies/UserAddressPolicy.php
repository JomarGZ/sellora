<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Auth\Access\Response;

final class UserAddressPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserAddress $userAddress): Response
    {
        return $user->id === $userAddress->user_id
            ? Response::allow()
            : Response::deny('You do not own this address');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserAddress $userAddress): Response
    {

        if ($user->id !== $userAddress->user_id) {
            return Response::deny('You do not own this address');
        }

        if ($userAddress->is_default) {
            return Response::deny('You cannot delete your default address');
        }

        return Response::allow();
    }
}
