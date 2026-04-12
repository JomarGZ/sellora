<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Nnjeim\World\Models\City;
use Nnjeim\World\Models\Country;

final class UserAddress extends Model
{
    /** @use HasFactory<\Database\Factories\UserAddressFactory> */
    use HasFactory;

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
