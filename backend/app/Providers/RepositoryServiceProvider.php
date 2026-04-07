<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\IProductCatalogRepository;
use App\Repositories\ProductCatalogRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(IProductCatalogRepository::class, ProductCatalogRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
