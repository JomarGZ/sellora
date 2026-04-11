<?php

declare(strict_types=1);

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductItem;

function createCategory(array $attributes = []): ProductCategory
{
    return ProductCategory::factory()->create($attributes);
}

function createBrand(array $attributes = []): Brand
{
    return Brand::factory()->create($attributes);
}

function createProduct(array $attributes = []): Product
{
    return Product::factory()->create($attributes);
}

function createProductItem(array $attributes = []): ProductItem
{
    return ProductItem::factory()->create($attributes);
}

function createAttribute(array $attributes = []): Attribute
{
    return Attribute::factory()->create($attributes);
}

function createAttributeValue(array $attributes = []): AttributeValue
{
    return AttributeValue::factory()->create($attributes);
}
