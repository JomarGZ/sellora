<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

final class AovOverTimeChart extends ChartWidget
{
    protected static ?int $sort = 3;

    protected ?string $heading = 'Average Order Value (AOV)';

    protected function getData(): array
    {
        $data = Order::selectRaw('DATE(created_at) as date, SUM(order_total) / COUNT(*) as aov')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'AOV',
                    'data' => $data->pluck('aov')->toArray(),
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
