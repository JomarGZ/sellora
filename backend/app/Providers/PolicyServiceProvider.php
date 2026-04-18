<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\ShoppingCart;
use App\Models\ShoppingCartItem;
use App\Models\UserAddress;
use App\Policies\ShoppingCartItemPolicy;
use App\Policies\ShoppingCartPolicy;
use App\Policies\UserAddressPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class PolicyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(UserAddress::class, UserAddressPolicy::class);
        Gate::policy(ShoppingCart::class, ShoppingCartPolicy::class);
        Gate::policy(ShoppingCartItem::class, ShoppingCartItemPolicy::class);
    }
}
