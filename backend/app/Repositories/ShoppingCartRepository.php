<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ShoppingCart;

final class ShoppingCartRepository extends BaseRepository
{
    public function __construct(ShoppingCart $model)
    {
        parent::__construct($model);
    }

    public function getOrCreateByUserId(int $userId)
    {
        return $this->model
            ->firstOrCreate([
                'user_id' => $userId,
            ]);
    }
}
