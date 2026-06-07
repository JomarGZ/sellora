<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = Order::find($this->route('order'));
 
        // Delegate authorization to the policy.
        // Laravel resolves OrderPolicy::updateStatus automatically
        // because the route parameter is type-hinted as Order.
        return $order && $this->user()->can('cancel', $order);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([]),
            ],
        ];
    }

    public function messages(): array
    {
        $valid = implode(', ', []);
 
        return [
            'status.in' => "Status must be one of: {$valid}.",
        ];
    }
}
