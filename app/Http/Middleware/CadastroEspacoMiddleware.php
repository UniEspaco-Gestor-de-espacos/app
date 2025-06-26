<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CadastroEspacoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        /*$messages = [
            'nome.required' => 'O nome é obrigatório.',
            'capacidade_pessoas.required' => 'A capacidade de pessoas é obrigatória.',
            'descricao.required' => 'A descrição é obrigatória.',
            'unidade_id.required' => 'O campo unidade é obrigatório.',
            'modulo_id.required' => 'O campo módulo é obrigatório.',
            'andar_id.required' => 'O campo andar é obrigatório.',
        ];
        $request->validate([
            'unidade_id' => 'required|exists:unidades,id',
            'modulo_id' => 'required|exists:modulos,id',
            'andar_id' => 'required|exists:andars,id',
            'nome' => 'required|string|max:255',
            'capacidade_pessoas' => 'required|integer|min:1',
            'descricao' => 'nullable|string',
            'imagens' => 'nullable|array',
            'imagens.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120', // Max 5MB por imagem
            'main_image_index' => 'nullable|integer', // Ou 'required_with:imagens|integer'
        ], $messages); // Valida se todos os campos foram preenchidos corretamente.

*/
        return $next($request);
    }
}
