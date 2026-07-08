<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Support\Carbon;

final class AovOverTimeChart extends ChartWidget
{
    use InteractsWithPageFilters;
    
    protected static ?int $sort = 4;

    protected ?string $heading = 'Average Order Value (AOV)';

    protected function getData(): array
    {
        $startDate = ($this->pageFilters['startDate'] ?: now()->subDays(6)->toDateString());
        $endDate = ($this->pageFilters['endDate'] ?: now()->toDateString());
        $query = Order::query()
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate));

        $data = $query
            ->selectRaw('DATE(created_at) as date, AVG(total) as aov')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'AOV',
                    'data' => $data->pluck('aov'),
                    'tension' => 0.4,
                ],
            ],
            'labels' => $data->pluck('date')->map(
                fn ($date) => Carbon::parse($date)->format('M d')
            ),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
                'tooltip' => [
                    'enabled' => true,
                ],
            ],
        ];
    }
}