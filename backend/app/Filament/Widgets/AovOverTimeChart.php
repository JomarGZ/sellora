<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

final class AovOverTimeChart extends ChartWidget
{
    protected static ?int $sort = 4;

    protected ?string $heading = 'Average Order Value (AOV)';

    protected function getData(): array
    {
        $data = Order::query()
            ->selectRaw('DATE(created_at) as date, AVG(order_total) as aov')
            ->where('created_at', '>=', now()->subDays(7))
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