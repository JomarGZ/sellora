<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'idempotency_key' => ['bail', 'required', 'string', 'max:255'],

            'items' => ['nullable', 'array', 'min:1'],

            'items.*.product_item_id' => [
                'required',
                'integer',
                'exists:product_items,id',
            ],

            'items.*.qty' => [
                'required',
                'integer',
                'min:1',
            ],

            'shipping_method_id' => [
                'required',
                'integer',
                'exists:shipping_methods,id',
            ],

            'address_id' => [
                'required',
                'integer',
                Rule::exists('user_addresses', 'id')
                    ->where('user_id', $this->user()->id)
                    ->where('is_default', true),
            ],
        ];
    }

}