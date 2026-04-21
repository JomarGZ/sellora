<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

final class EcommerceStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Revenue (Paid)', '$ '.number_format(
                Order::WHERE('status', OrderStatus::Paid)->sum('order_total'),
                2
            ))
                ->chart(
                    collect(range(6, 0))
                        ->map(fn ($daysAgo) => Order::where('status', OrderStatus::Paid)
                            ->whereDate('created_at', now()->subDays($daysAgo))
                            ->sum('order_total')
                        )->toArray()
                )
                ->description('Last 7 days revenue trend')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Total Orders', number_format(Order::count()))
                ->description('Last 7 days order trend')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->chart(
                    collect(range(6, 0))
                        ->map(fn ($daysAgo) => Order::whereDate('created_at', now()->subDays($daysAgo))
                            ->count()
                        )->toArray()
                )
                ->color('primary'),
            Stat::make('Active Customers', number_format(
                Order::whereNotNull('user_id')->distinct('user_id')->count('user_id')
            ))
                ->description('Customers who placed at least one order')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('info'),
        ];
    }

    protected function getHeading(): ?string
    {
        return 'Ecommerce Dashboard';
    }

    protected function getDescription(): ?string
    {
        return 'Overview of sales, orders, and customer activity.';
    }
}
