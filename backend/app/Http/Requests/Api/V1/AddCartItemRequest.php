<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth enforced by route middleware (auth:sanctum)
    }
 
    public function rules(): array
    {
        return [
            // DB-level check that the UUID points to a real row.
            // Whether the product is active and has stock is a business
            // rule enforced in CartService, not here.
            'product_item_id' => ['required', 'exists:product_items,id'],
            'quantity'   => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
 
    public function messages(): array
    {
        return [
            'product_item_id.exists' => 'The selected product does not exist.',
            'quantity.min'      => 'Quantity must be at least 1.',
            'quantity.max'      => 'You cannot add more than 100 of the same item at once.',
        ];
    }
}
