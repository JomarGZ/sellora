<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ProductItem;
use Exception;
use Illuminate\Support\Str;

final class SkuGenerator
{
    public static function generate(ProductItem $record): string
    {
        $record->loadMissing('product', 'attributeValues.attribute');
        throw_if(empty($record->product), Exception::class, 'Product is required for SKU generation.');

        $baseSku = Str::slug($record->product->name);

        throw_if($record->attributeValues->isEmpty(), Exception::class, 'Attribute values are required for SKU generation.');

        $attributePart = collect($record->attributeValues)
            ->sortBy('attribute_id')
            ->pluck('value')
            ->implode('-');

        return Str::upper($baseSku.'-'.$attributePart.'-'.random_int(100000, 999999));
    }
}
