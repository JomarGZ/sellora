<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

final class SalesByCategoryChart extends ChartWidget
{
    protected ?string $heading = 'Sales By Category Chart';

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

        return [
            'datasets' => [
                [
                    'label' => 'Sales',
                    'data' => $data->pluck('total_sales')->toArray(),
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
