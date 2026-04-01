<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\AttributeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Attribute extends Model
{
    /** @use HasFactory<AttributeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];
}
