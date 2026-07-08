<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

final class EcommerceStatsOverview extends StatsOverviewWidget
{
    use InteractsWithPageFilters;

    protected function getStats(): array
    {
        $startDate = ($this->pageFilters['startDate'] ?: now()->subDays(6)->toDateString());
        $endDate = ($this->pageFilters['endDate'] ?: now()->toDateString());

        $query = Order::query()
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate));
            
        $revenueDescription = match(true) {
            $startDate && $endDate => 'Revenue from ' . Carbon::parse($startDate)->format('M j, Y') . ' to ' . Carbon::parse($endDate)->format('M j, Y'),
            $startDate => 'Revenue since ' . Carbon::parse($startDate)->format('M j, Y'),
            $endDate => 'Revenue until ' . Carbon::parse($endDate)->format('M j, Y'),
            default => 'Revenue for the last 7 days',
        };

        $orderDescription = match(true) {
            $startDate && $endDate => 'Orders from ' . Carbon::parse($startDate)->format('M j, Y') . ' to ' . Carbon::parse($endDate)->format('M j, Y'),
            $startDate => 'Orders since ' . Carbon::parse($startDate)->format('M j, Y'),
            $endDate => 'Orders until ' . Carbon::parse($endDate)->format('M j, Y'),
            default => 'Orders for the last 7 days'
        };

        return [
            Stat::make('Total Revenue (Paid)', '$ '.number_format(
                (float) (clone $query)->whereIn('status',  Order::saleStatus())->whereNull('refunded_at')->sum('total'),
                2
            ))
                ->chart(
                    collect(CarbonPeriod::create($startDate, $endDate))
                    ->map(fn (Carbon $date) => Order::query()
                        ->whereIn('status', Order::saleStatus())
                        ->whereDate('created_at', $date)
                        ->whereNull('refunded_at')
                        ->sum('total')
                    )->toArray()
                )
                ->description($revenueDescription)
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Total Orders', number_format((clone $query)->count()))
                ->description($orderDescription)
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->chart(
                    collect(CarbonPeriod::create($startDate, $endDate))
                        ->map(fn (Carbon $date) => Order::query()->whereDate('created_at', $date)->count())->toArray()
                )
                ->color('primary'),

            Stat::make('Active Customers', number_format(
                (clone $query)->whereNotNull('user_id')->distinct('user_id')->count('user_id')
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
