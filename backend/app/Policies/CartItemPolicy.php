<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;

final class CartItemPolicy
{
    public function update(User $user, CartItem $item)
    {
        return $item->cart->user_id === $user->id;
    }

    public function delete(User $user, CartItem $item)
    {
        return $item->cart->user_id === $user->id;
    }
}
