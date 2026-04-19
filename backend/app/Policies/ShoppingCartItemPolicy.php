<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ShoppingCartItem;
use App\Models\User;

final class ShoppingCartItemPolicy
{
    public function update(User $user, ShoppingCartItem $item)
    {
        return $item->cart->user_id === $user->id;
    }

    public function delete(User $user, ShoppingCartItem $item)
    {
        return $item->cart->user_id === $user->id;
    }
}
