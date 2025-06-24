<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AvaliarReservaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->validate([
            'situacao'   => 'required|in:deferida,indeferida', // Garante que o valor seja um dos esperados
            'motivo'     => 'required_if:situacao,indeferida|nullable',
        ]);

        return $next($request);
    }
}
