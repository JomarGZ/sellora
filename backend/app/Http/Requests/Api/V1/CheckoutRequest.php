<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items'                   => ['required', 'array', 'min:1'],
            'items.*.product_item_id' => ['required', 'integer', 'exists:product_items,id'],
            'items.*.qty'             => ['required', 'integer', 'min:1'],
            'shipping_method_id'      => ['required', 'integer', 'exists:shipping_methods,id'],
            'address_id'              => [
                'required',
                'integer',
                // ensures the address belongs to the authenticated user
                'exists:addresses,id,user_id,' . auth()->id(),
            ],
        ];
    }
}
