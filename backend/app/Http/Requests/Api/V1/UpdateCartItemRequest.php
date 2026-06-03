<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
     public function authorize(): bool
    {
        return true;
    }
 
    public function rules(): array
    {
        return [
            // min:0 intentional — sending 0 means "remove this item".
            // The CartService interprets 0 as a delete so the frontend
            // needs only one endpoint for both quantity change and removal.
            'quantity' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
 
    public function messages(): array
    {
        return [
            'quantity.min' => 'Quantity cannot be negative.',
            'quantity.max' => 'You cannot set a quantity greater than 100.',
        ];
    }
}
