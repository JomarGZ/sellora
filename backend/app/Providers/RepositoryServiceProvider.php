<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\IOrderAddressRepository;
use App\Repositories\Contracts\IOrderItemRepository;
use App\Repositories\Contracts\IOrderRepository;
use App\Repositories\Contracts\IPaymentRepository;
use App\Repositories\Contracts\IProductFilterRepository;
use App\Repositories\Contracts\IProductItemRepository;
use App\Repositories\OrderAddressRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductFilterRepository;
use App\Repositories\ProductItemRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(IProductItemRepository::class, ProductItemRepository::class);
        $this->app->bind(IProductFilterRepository::class, ProductFilterRepository::class);
        $this->app->bind(IOrderRepository::class, OrderRepository::class);
        $this->app->bind(IOrderAddressRepository::class, OrderAddressRepository::class);
        $this->app->bind(IOrderItemRepository::class, OrderItemRepository::class);
        $this->app->bind(IOrderItemRepository::class, OrderItemRepository::class);
        $this->app->bind(IPaymentRepository::class, PaymentRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
