<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ShoppingCart;
use App\Models\User;

final class ShoppingCartPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ShoppingCart $shoppingCart): bool
    {
        return $user->id === $shoppingCart->user_id;
    }

    public function clear(User $user, ShoppingCart $shoppingCart): bool
    {
        return $user->id === $shoppingCart->user_id;
    }
}
