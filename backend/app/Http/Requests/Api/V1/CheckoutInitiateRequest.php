<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutInitiateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
             'idempotency_key' => [
                'required',
                'string',
                // UUID format validation ensures the key is well-formed
                // and not a user-controlled arbitrary string.
                'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',
                'max:36',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'idempotency_key.regex' => 'The idempotency key must be a valid UUID v4.',
        ];
    }
}
