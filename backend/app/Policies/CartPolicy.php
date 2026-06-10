<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Cart;
use App\Models\User;

final class CartPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Cart $cart): bool
    {
        return $user->id === $cart->user_id;
    }
}
