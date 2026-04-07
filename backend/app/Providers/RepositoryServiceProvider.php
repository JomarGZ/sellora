<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\IProductCatalogRepository;
use App\Repositories\Contracts\IProductFilterRepository;
use App\Repositories\ProductCatalogRepository;
use App\Repositories\ProductFilterRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(IProductCatalogRepository::class, ProductCatalogRepository::class);
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
