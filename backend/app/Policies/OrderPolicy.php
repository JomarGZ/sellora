<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Any authenticated user can list their own orders
    }

    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->user_id || $this->isAdmin($user);
    }

    public function updateStatus(User $user, Order $order): bool
    {
        return $this->isAdmin($user);
    }

    private function isAdmin(User $user): bool
    {
        return (bool) ($user->is_admin ?? false);
    }
}
