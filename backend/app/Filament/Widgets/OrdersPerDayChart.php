<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

final class OrdersPerDayChart extends ChartWidget
{
    use InteractsWithPageFilters;
    
    protected static ?int $sort = 6;

    protected ?string $heading = 'Orders Per Day';

    protected function getData(): array
    {
        $startDate = ($this->pageFilters['startDate'] ?: now()->subDays(6)->toDateString());
        $endDate = ($this->pageFilters['endDate'] ?: now()->toDateString());
        $query = Order::query()
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate));

        $data = $query->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $data->pluck('total')->toArray(),
                ],
            ],
            'labels' => $data->pluck('date')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
