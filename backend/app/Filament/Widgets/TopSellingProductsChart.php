<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

final class TopSellingProductsChart extends ChartWidget
{
    protected static ?int $sort = 3;
    protected ?string $heading = 'Top Selling Products';

    protected function getData(): array
    {
        $data = OrderItem::query()
            ->selectRaw('
                products.id as product_id,
                products.name as product_name,
                SUM(order_items.quantity) as total_sold
            ')
            ->join('product_items', 'product_items.id', '=', 'order_items.product_item_id')
            ->join('products', 'products.id', '=', 'product_items.product_id')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        $colors = [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
        ];

        $dataColors = $data->map(function ($_, $index) use ($colors) {
            return $colors[$index % count($colors)];
        });

        return [
            'datasets' => [
                [
                    'label' => 'Units Sold',
                    'data' => $data->pluck('total_sold'),
                    'backgroundColor' => $dataColors
                ],
            ],
            'labels' => $data->pluck('product_name'),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
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