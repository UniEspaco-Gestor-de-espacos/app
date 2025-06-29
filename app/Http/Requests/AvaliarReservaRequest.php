<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AvaliarReservaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->permission_type_id == 2; // Permite que qualquer usuário autenticado tente criar
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'situacao'   => 'required|in:deferida,indeferida', // Garante que o valor seja um dos esperados
            'motivo'     => 'required_if:situacao,indeferida|nullable',
        ];
    }
}
