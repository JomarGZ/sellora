<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\EcommerceStatsOverview;
use Filament\Pages\Page;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected string $view = 'filament.pages.dashboard';

    protected function getHeaderWidgets(): array
    {
        return [
            EcommerceStatsOverview::class,
        ];
    }
}
