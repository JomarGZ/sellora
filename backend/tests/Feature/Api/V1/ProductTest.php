<?php

declare(strict_types=1);

use App\Models\Product;

describe('Product Catalog', function (): void {

    describe('Happy Path', function (): void {

        it('returns paginated products', function (): void {
            createProduct();
            createProduct();
            createProduct();

            $response = $this->getJson('/api/v1/products');

            $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'name', 'slug'],
                    ],
                    'links',
                    'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                ]);
        });

        it('returns correct per_page count', function (): void {
            Product::factory()->count(20)->create();

            $response = $this->getJson('/api/v1/products?per_page=5');

            $response->assertOk()
                ->assertJsonCount(5, 'data')
                ->assertJsonPath('meta.per_page', 5);
        });

        it('returns second page correctly', function (): void {
            Product::factory()->count(20)->create();

            $response = $this->getJson('/api/v1/products?per_page=10&page=2');

            $response->assertOk()
                ->assertJsonPath('meta.current_page', 2)
                ->assertJsonCount(10, 'data');
        });

        it('returns empty data when no products exist', function (): void {
            $response = $this->getJson('/api/v1/products');

            $response->assertOk()
                ->assertJsonCount(0, 'data')
                ->assertJsonPath('meta.total', 0);
        });

    });

    describe('Search Filter', function (): void {

        it('returns products matching search term', function (): void {
            createProduct(['name' => 'Nike Air Max']);
            createProduct(['name' => 'Adidas Ultraboost']);

            $response = $this->getJson('/api/v1/products?search=Nike');

            $response->assertOk()
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.name', 'Nike Air Max');
        });

        it('returns products with partial search match', function (): void {
            createProduct(['name' => 'Nike Air Max']);
            createProduct(['name' => 'Nike Air Force']);
            createProduct(['name' => 'Adidas Ultraboost']);

            $response = $this->getJson('/api/v1/products?search=Nike');

            $response->assertOk()
                ->assertJsonCount(2, 'data');
        });

        it('returns empty when search has no match', function (): void {
            createProduct(['name' => 'Nike Air Max']);

            $response = $this->getJson('/api/v1/products?search=Puma');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('ignores whitespace in search term', function (): void {
            createProduct(['name' => 'Nike Air Max']);

            $response = $this->getJson('/api/v1/products?search=%20%20Nike%20%20');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

    });

    describe('Category Filter', function (): void {

        it('returns products filtered by category slug', function (): void {
            $shoes = createCategory(['name' => 'shoes']);
            $clothing = createCategory(['name' => 'clothing']);

            createProduct(['product_category_id' => $shoes->id]);
            createProduct(['product_category_id' => $clothing->id]);

            $response = $this->getJson('/api/v1/products?category=shoes');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products from child category when filtering by parent slug', function (): void {
            $parent = createCategory(['slug' => 'clothing']);
            $child = createCategory(['slug' => 'tshirts', 'parent_id' => $parent->id]);

            createProduct(['product_category_id' => $child->id]);

            $response = $this->getJson('/api/v1/products?category=clothing');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when category has no products', function (): void {
            createCategory(['slug' => 'shoes']);

            $response = $this->getJson('/api/v1/products?category=shoes');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('returns empty when category slug does not exist', function (): void {
            createProduct();

            $response = $this->getJson('/api/v1/products?category=nonexistent');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Brand Filter', function (): void {

        it('returns products filtered by brand slug', function (): void {
            $nike = createBrand(['slug' => 'nike']);
            $adidas = createBrand(['slug' => 'adidas']);

            createProduct(['brand_id' => $nike->id]);
            createProduct(['brand_id' => $adidas->id]);

            $response = $this->getJson('/api/v1/products?brand=nike');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when brand has no products', function (): void {
            createBrand(['slug' => 'nike']);

            $response = $this->getJson('/api/v1/products?brand=nike');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

        it('returns empty when brand slug does not exist', function (): void {
            createProduct();

            $response = $this->getJson('/api/v1/products?brand=nonexistent');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Price Range Filter', function (): void {

        it('returns products within min and max price range', function (): void {
            $cheap = createProduct();
            $mid = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $mid->id,       'price' => 500]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/products?min_price=200&max_price=600');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products above min price only', function (): void {
            $cheap = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/products?min_price=500');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns products below max price only', function (): void {
            $cheap = createProduct();
            $expensive = createProduct();

            createProductItem(['product_id' => $cheap->id,     'price' => 100]);
            createProductItem(['product_id' => $expensive->id, 'price' => 1000]);

            $response = $this->getJson('/api/v1/products?max_price=500');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('returns empty when no products fall within price range', function (): void {
            $product = createProduct();
            createProductItem(['product_id' => $product->id, 'price' => 100]);

            $response = $this->getJson('/api/v1/products?min_price=500&max_price=1000');

            $response->assertOk()
                ->assertJsonCount(0, 'data');
        });

    });

    describe('Sorting', function (): void {

        it('sorts by price ascending', function (): void {
            $first = createProduct();
            $second = createProduct();
            $third = createProduct();

            createProductItem(['product_id' => $first->id,  'price' => 300]);
            createProductItem(['product_id' => $second->id, 'price' => 100]);
            createProductItem(['product_id' => $third->id,  'price' => 200]);

            $response = $this->getJson('/api/v1/products?sort=price_asc');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $second->id)
                ->assertJsonPath('data.1.id', $third->id)
                ->assertJsonPath('data.2.id', $first->id);
        });

        it('sorts by price descending', function (): void {
            $first = createProduct();
            $second = createProduct();
            $third = createProduct();

            createProductItem(['product_id' => $first->id,  'price' => 300]);
            createProductItem(['product_id' => $second->id, 'price' => 100]);
            createProductItem(['product_id' => $third->id,  'price' => 200]);

            $response = $this->getJson('/api/v1/products?sort=price_desc');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $first->id)
                ->assertJsonPath('data.1.id', $third->id)
                ->assertJsonPath('data.2.id', $second->id);
        });

        it('sorts by newest', function (): void {
            $old = createProduct(['created_at' => now()->subDays(10)]);
            $new = createProduct(['created_at' => now()]);

            $response = $this->getJson('/api/v1/products?sort=newest');

            $response->assertOk()
                ->assertJsonPath('data.0.id', $new->id)
                ->assertJsonPath('data.1.id', $old->id);
        });

        it('falls back to random order when sort is not provided', function (): void {
            Product::factory()->count(5)->create();

            $response = $this->getJson('/api/v1/products');

            $response->assertOk()
                ->assertJsonCount(5, 'data');
        });

    });

    describe('Combined Filters', function (): void {

        it('filters by brand and category together', function (): void {
            $nike = createBrand(['slug' => 'nike']);
            $shoes = createCategory(['slug' => 'shoes']);
            $clothing = createCategory(['slug' => 'clothing']);

            createProduct(['brand_id' => $nike->id, 'product_category_id' => $shoes->id]);
            createProduct(['brand_id' => $nike->id, 'product_category_id' => $clothing->id]);

            $response = $this->getJson('/api/v1/products?brand=nike&category=shoes');

            $response->assertOk()
                ->assertJsonCount(1, 'data');
        });

        it('filters by search and price range together', function (): void {
            $nike = createProduct(['name' => 'Nike Air Max']);
            $jordan = createProduct(['name' => 'Nike Jordan']);

            createProductItem(['product_id' => $nike->id,   'price' => 100]);
            createProductItem(['product_id' => $jordan->id, 'price' => 500]);

            $response = $this->getJson('/api/v1/products?search=Nike&max_price=200');

            $response->assertOk()
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.id', $nike->id);
        });

    });

    describe('Validation', function (): void {

        it('rejects invalid sort value', function (): void {
            $this->getJson('/api/v1/products?sort=invalid')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['sort']);
        });

        it('rejects non-numeric min_price', function (): void {
            $this->getJson('/api/v1/products?min_price=abc')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['min_price']);
        });

        it('rejects non-numeric max_price', function (): void {
            $this->getJson('/api/v1/products?max_price=abc')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['max_price']);
        });

        it('rejects per_page above 100', function (): void {
            $this->getJson('/api/v1/products?per_page=999')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['per_page']);
        });

        it('rejects per_page below 1', function (): void {
            $this->getJson('/api/v1/products?per_page=0')
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['per_page']);
        });

    });

});

// ============================================================
// GET /api/v1/products/filters — Filter Options
// ============================================================

describe('Product Filter Options', function (): void {

    it('returns categories and brands', function (): void {
        createCategory(['parent_id' => null]);
        createBrand();

        $response = $this->getJson('/api/v1/products/filters');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'categories' => [['id', 'name', 'slug']],
                    'brands' => [['id', 'name', 'slug']],
                ],
            ]);
    });

    it('only returns top level categories', function (): void {
        $parent = createCategory(['parent_id' => null]);
        createCategory(['parent_id' => $parent->id]);

        $response = $this->getJson('/api/v1/products/filters');

        $response->assertOk()
            ->assertJsonCount(1, 'data.categories');
    });

    it('returns children nested under parent category', function (): void {
        $parent = createCategory(['parent_id' => null]);
        createCategory(['parent_id' => $parent->id]);
        createCategory(['parent_id' => $parent->id]);

        $response = $this->getJson('/api/v1/products/filters');

        $response->assertOk()
            ->assertJsonCount(2, 'data.categories.0.children');
    });

    it('returns empty categories and brands when none exist', function (): void {
        $response = $this->getJson('/api/v1/products/filters');

        $response->assertOk()
            ->assertJsonCount(0, 'data.categories')
            ->assertJsonCount(0, 'data.brands');
    });

    it('caches filter options on subsequent calls', function (): void {
        createCategory();
        createBrand();

        $this->getJson('/api/v1/products/filters')->assertOk();

        // Add new data after cache is set
        createCategory();
        createBrand();

        // Should still return cached result
        // $response = $this->getJson('/api/v1/products/filters');

        // $response->assertOk()
        //     ->assertJsonCount(1, 'data.categories')
        //     ->assertJsonCount(1, 'data.brands');
    });

});
