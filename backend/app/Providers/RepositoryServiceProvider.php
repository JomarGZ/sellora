<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\IProductFilterRepository;
use App\Repositories\Contracts\IProductRepository;
use App\Repositories\ProductFilterRepository;
use App\Repositories\ProductRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(IProductRepository::class, ProductRepository::class);
        $this->app->bind(IProductFilterRepository::class, ProductFilterRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
