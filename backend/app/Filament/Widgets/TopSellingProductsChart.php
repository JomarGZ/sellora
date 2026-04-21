<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

final class TopSellingProductsChart extends ChartWidget
{
    protected ?string $heading = 'Top Selling Products Chart';

    protected function getData(): array
    {
        $data = OrderItem::query()
            ->selectRaw('product_item_id, SUM(quantity) as total_sold')
            ->with('productItem.product') // assuming relationships exist
            ->groupBy('product_item_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Units Sold',
                    'data' => $data->pluck('total_sold')->toArray(),
                ],
            ],
            'labels' => $data->map(function ($item) {
                return $item->productItem->product->name ?? 'Unknown';
            })->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    // 👇 THIS makes it horizontal
    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
        ];
    }
}
