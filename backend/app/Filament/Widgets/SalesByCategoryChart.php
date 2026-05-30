<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

final class SalesByCategoryChart extends ChartWidget
{
    protected static ?int $sort = 1;
    protected ?string $heading = 'Category Sales Performance';

    protected function getData(): array
    {
        $data = OrderItem::query()
            ->selectRaw('product_categories.name as category_name, SUM(order_items.quantity * order_items.price) as total_sales')
            ->join('product_items', 'order_items.product_item_id', '=', 'product_items.id')
            ->join('products', 'product_items.product_id', '=', 'products.id')
            ->join('product_categories', 'products.product_category_id', '=', 'product_categories.id')
            ->groupBy('category_name')
            ->orderByDesc('total_sales')
            ->get();

        $colors = [
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // amber
            '#EF4444', // red
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#14B8A6', // teal
        ];

        $backgroundColors = $data->map(function ($_, $index) use ($colors) {
            return $colors[$index % count($colors)];
        });

        return [
            'datasets' => [
                [
                    'label' => 'Sales',
                    'data' => $data->pluck('total_sales')->toArray(),
                    'backgroundColor' => $backgroundColors,
                    'borderColor' => '#ffffff',
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $data->pluck('category_name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}
