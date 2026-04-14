<?php

declare(strict_types=1);

namespace App\Filament\Resources\OrderStatuses\Pages;

use App\Filament\Resources\OrderStatuses\OrderStatusResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateOrderStatus extends CreateRecord
{
    protected static string $resource = OrderStatusResource::class;
}
