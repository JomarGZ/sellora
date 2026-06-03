<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;

final class SalesByBrandChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected ?string $heading = 'Brand Sales Performance';

    protected function getData(): array
    {
        $data = OrderItem::query()
            ->selectRaw('brands.name as brand_name, SUM(order_items.quantity * order_items.unit_price) as total_sales')
            ->join('product_items', 'order_items.product_item_id', '=', 'product_items.id')
            ->join('products', 'product_items.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->groupBy('brands.name')
            ->orderByDesc('total_sales')
            ->get();

        $colors = [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
            '#EC4899',
            '#14B8A6',
        ];

        $backgroundColors = $data->map(function ($_, $index) use ($colors) {
            return $colors[$index % count($colors)];
        });

        return [
            'datasets' => [
                [
                    'label' => 'Sales',
                    'data' => $data->pluck('total_sales'),
                    'backgroundColor' => $backgroundColors,
                    'borderColor' => '#ffffff',
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $data->pluck('brand_name'),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut'; // 👈 better than pie for brands
    }
}