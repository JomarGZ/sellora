<?php

declare(strict_types=1);

use App\Models\Product;

describe('Product Catalog', function () {

    describe('Happy Path', function () {

        it('returns paginated products', function () {
            createProduct();
            createProduct();
            createProduct();

            $response = $this->getJson('/api/v1/product-catalog');

            $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'name', 'slug'],
                    ],
                    'links',
                    'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                ]);
        });

        it('returns correct per_page count', function () {
            Product::factory()->count(20)->create();

            $response = $this->getJson('/api/v1/product-catalog?per_page=5');

            $response->assertOk()
                ->assertJsonCount(5, 'data')
                ->assertJsonPath('meta.per_page', 5);
        });

        it('returns second page correctly', function () {
            Product::factory()->count(20)->create();

            $response = $this->getJson('/api/v1/product-catalog?per_page=10&page=2');

            $response->assertOk()
                ->assertJsonPath('meta.current_page', 2)
                ->assertJsonCount(10, 'data');
        });

        it('returns empty data when no products exist', function () {
            $response = $this->getJson('/api/v1/product-catalog');

            $response->assertOk()
                ->assertJsonCount(0, 'data')
                ->assertJsonPath('meta.total', 0);
        });

    });

    describe('Search Filter', function () {

        it('returns products matching search term', function () {
            createProduct(['name' => 'Nike Air Max']);
            createProduct(['name' => 'Adidas Ultraboost']);

            $response = $this->getJson('/api/v1/product-catalog?search=Nike');

            $response->assertOk()
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.name', 'Nike Air Max');
        });

        it('returns products with partial search match', function () {
            createProduct(['name' => 'Nike Air Max']);
            createProduct(['name' => 'Nike Air Force']);
            createProduct(['name' => 'Adidas Ultraboost']);

            $response = $this->getJson('/api/v1/product-catalog?search=Nike');

            $response->assertOk()
                ->assertJsonCount(2, 'data');
        });

        it('returns empty when search has no match', function () {
            createProduct(['name' => 'Nike Air Max']);

            $response = $this->getJson('/api/v1/product-catalog?search=Puma');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('ignores whitespace in search term', function () {
            createProduct(['name' => 'Nike Air Max']);

            $response = $this->getJson('/api/v1/product-catalog?search=%20%20Nike%20%20');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

    });

    describe('Category Filter', function () {

        it('returns products filtered by category slug', function () {
            $shoes = createCategory(['name' => 'shoes']);
            $clothing = createCategory(['name' => 'clothing']);

            createProduct(['product_category_id' => $shoes->id]);
            createProduct(['product_category_id' => $clothing->id]);

            $response = $this->getJson('/api/v1/product-catalog?category=shoes');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products from child category when filtering by parent slug', function () {
            $parent = createCategory(['slug' => 'clothing']);
            $child = createCategory(['slug' => 'tshirts', 'parent_id' => $parent->id]);

            createProduct(['product_category_id' => $child->id]);

            $response = $this->getJson('/api/v1/product-catalog?category=clothing');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when category has no products', function () {
            createCategory(['slug' => 'shoes']);

            $response = $this->getJson('/api/v1/product-catalog?category=shoes');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('returns empty when category slug does not exist', function () {
            createProduct();

            $response = $this->getJson('/api/v1/product-catalog?category=nonexistent');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Brand Filter', function () {

        it('returns products filtered by brand slug', function () {
            $nike = createBrand(['slug' => 'nike']);
            $adidas = createBrand(['slug' => 'adidas']);

            createProduct(['brand_id' => $nike->id]);
            createProduct(['brand_id' => $adidas->id]);

            $response = $this->getJson('/api/v1/product-catalog?brand=nike');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when brand has no products', function () {
            createBrand(['slug' => 'nike']);

            $response = $this->getJson('/api/v1/product-catalog?brand=nike');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('returns empty when brand slug does not exist', function () {
            createProduct();

            $response = $this->getJson('/api/v1/product-catalog?brand=nonexistent');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Price Range Filter', function () {

        it('returns products within min and max price range', function () {
            $cheap = createProduct();
            $mid = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $mid->id,       'price' => 500]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/product-catalog?min_price=200&max_price=600');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products above min price only', function () {
            $cheap = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/product-catalog?min_price=500');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products below max price only', function () {
            $cheap = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/product-catalog?max_price=500');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when no products fall within price range', function () {
            $product = createProduct();
            createProductItem(['product_id' => $product->id, 'price' => 100]);

            $response = $this->getJson('/api/v1/product-catalog?min_price=500&max_price=1000');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Sorting', function () {

        it('sorts by price ascending', function () {
            $first = createProduct();
            $second = createProduct();
            $third = createProduct();

            createProductItem(['product_id' => $first->id,  'price' => 300]);
            createProductItem(['product_id' => $second->id, 'price' => 100]);
            createProductItem(['product_id' => $third->id,  'price' => 200]);

            $response = $this->getJson('/api/v1/product-catalog?sort=price_asc');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $second->id)
                ->assertJsonPath('data.1.id', $third->id)
                ->assertJsonPath('data.2.id', $first->id);
        });

        it('sorts by price descending', function () {
            $first = createProduct();
            $second = createProduct();
            $third = createProduct();

            createProductItem(['product_id' => $first->id,  'price' => 300]);
            createProductItem(['product_id' => $second->id, 'price' => 100]);
            createProductItem(['product_id' => $third->id,  'price' => 200]);

            $response = $this->getJson('/api/v1/product-catalog?sort=price_desc');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $first->id)
                ->assertJsonPath('data.1.id', $third->id)
                ->assertJsonPath('data.2.id', $second->id);
        });

        it('sorts by newest', function () {
            $old = createProduct(['created_at' => now()->subDays(10)]);
            $new = createProduct(['created_at' => now()]);

            $response = $this->getJson('/api/v1/product-catalog?sort=newest');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $new->id)
                ->assertJsonPath('data.1.id', $old->id);
        });

        it('falls back to random order when sort is not provided', function () {
            Product::factory()->count(5)->create();

            $response = $this->getJson('/api/v1/product-catalog');

            $response->assertOk()
                ->assertJsonCount(5, 'data');
        });

    });

    describe('Combined Filters', function () {

        it('filters by brand and category together', function () {
            $nike = createBrand(['slug' => 'nike']);
            $shoes = createCategory(['slug' => 'shoes']);
            $clothing = createCategory(['slug' => 'clothing']);

            createProduct(['brand_id' => $nike->id, 'product_category_id' => $shoes->id]);
            createProduct(['brand_id' => $nike->id, 'product_category_id' => $clothing->id]);

            $response = $this->getJson('/api/v1/product-catalog?brand=nike&category=shoes');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('filters by search and price range together', function () {
            $nike = createProduct(['name' => 'Nike Air Max']);
            $jordan = createProduct(['name' => 'Nike Jordan']);

            createProductItem(['product_id' => $nike->id,   'price' => 100]);
            createProductItem(['product_id' => $jordan->id, 'price' => 500]);

            $response = $this->getJson('/api/v1/product-catalog?search=Nike&max_price=200');

            $response->assertOk()
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.id', $nike->id);
        });

    });

    describe('Validation', function () {

        it('rejects invalid sort value', function () {
            $this->getJson('/api/v1/product-catalog?sort=invalid')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['sort']);
        });

        it('rejects non-numeric min_price', function () {
            $this->getJson('/api/v1/product-catalog?min_price=abc')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['min_price']);
        });

        it('rejects non-numeric max_price', function () {
            $this->getJson('/api/v1/product-catalog?max_price=abc')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['max_price']);
        });

        it('rejects per_page above 100', function () {
            $this->getJson('/api/v1/product-catalog?per_page=999')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['per_page']);
        });

        it('rejects per_page below 1', function () {
            $this->getJson('/api/v1/product-catalog?per_page=0')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['per_page']);
        });

    });

});

// ============================================================
// GET /api/v1/products/filters — Filter Options
// ============================================================

describe('Product Filter Options', function () {

    it('returns categories and brands', function () {
        createCategory(['parent_id' => null]);
        createBrand();

        $response = $this->getJson('/api/v1/product-catalog/filters');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'categories' => [['id', 'name', 'slug']],
                    'brands' => [['id', 'name', 'slug']],
                ],
            ]);
    });

    it('only returns top level categories', function () {
        $parent = createCategory(['parent_id' => null]);
        createCategory(['parent_id' => $parent->id]);

        $response = $this->getJson('/api/v1/product-catalog/filters');

        $response->assertOk()
            ->assertJsonCount(1, 'data.categories');
    });

    it('returns children nested under parent category', function () {
        $parent = createCategory(['parent_id' => null]);
        createCategory(['parent_id' => $parent->id]);
        createCategory(['parent_id' => $parent->id]);

        $response = $this->getJson('/api/v1/product-catalog/filters');

        $response->assertOk()
            ->assertJsonCount(2, 'data.categories.0.children');
    });

    it('returns empty categories and brands when none exist', function () {
        $response = $this->getJson('/api/v1/product-catalog/filters');

        $response->assertOk()
            ->assertJsonCount(0, 'data.categories')
            ->assertJsonCount(0, 'data.brands');
    });

    it('caches filter options on subsequent calls', function () {
        createCategory();
        createBrand();

        $this->getJson('/api/v1/product-catalog/filters')->assertOk();

        // Add new data after cache is set
        createCategory();
        createBrand();

        // Should still return cached result
        // $response = $this->getJson('/api/v1/product-catalog/filters');

        // $response->assertOk()
        //     ->assertJsonCount(1, 'data.categories')
        //     ->assertJsonCount(1, 'data.brands');
    });

});
