<?php

namespace App\Http\Middleware;

use App\Models\Horario;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ReservaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'recorrencia' => ['required', Rule::in(['unica', '15dias', '1mes', 'personalizado'])], // Ajuste as opções conforme necessário
            'data_inicial' => 'required|date',
            'data_final' => 'required|date|after_or_equal:data_inicial',
            'user_id' => 'required|integer|exists:users,id', // Garante que o user_id exista na tabela 'users'
            'horarios_solicitados' => 'required|array|min:1', // Garante que seja um array e tenha pelo menos um item
            'horarios_solicitados.*.id' => 'required|string', // Valida cada 'id' dentro do array 'horarios_solicitados'
            'horarios_solicitados.*.agenda_id' => 'required|integer|exists:agendas,id', // Garante que agenda_id exista na tabela 'agendas'
            'horarios_solicitados.*.horario_inicio' => 'required|date_format:H:i:s',
            'horarios_solicitados.*.horario_fim' => 'required|date_format:H:i:s|after:horarios_solicitados.*.horario_inicio',
            'horarios_solicitados.*.data' => 'required|date',
            'horarios_solicitados.*.status' => ['required', Rule::in(['livre'])], // Ajuste as opções de status
        ]);
        $horarios_solicitados = $validatedData['horarios_solicitados'];

        foreach ($horarios_solicitados as $index => $horario) {
            // Validação de tempo de intervalo de horario
            try {
                $inicio = Carbon::createFromTimeString($horario['horario_inicio']);
                $fim = Carbon::createFromTimeString($horario['horario_fim']);
            } catch (\Exception $e) {
                $mensagem = 'Formato inválido para horário de início ou fim no item ' .
                    ($index + 1) . ' da sua solicitação: ' . $horario['horario_inicio'] .
                    ' - ' . $horario['horario_fim'];
                return redirect(status: 400)->route('espacos.index')->with('error', $mensagem);
            }

            if ($fim->lte($inicio)) { // lte = menor ou igual a
                $mensagem = 'No item ' . ($index + 1) .
                    ', o horário de término (' . $horario['horario_fim'] . ') deve ser posterior ao horário de início (' . $horario['horario_inicio'] . ').';
                return redirect(status: 422)->route('espacos.index')->with('error', $mensagem);
            }

            $duracaoEmMinutos = $inicio->diffInMinutes($fim);
            if ($duracaoEmMinutos != 50) {
                $mensagem = 'A duração do horário no item ' . ($index + 1) . ' (de ' . $horario['horario_inicio'] . ' a ' . $horario['horario_fim'] . ') deve ser de exatamente 50 minutos. Duração atual: ' . $duracaoEmMinutos . ' minutos.';
                return redirect(status: 422)->route('espacos.index')->with('error', $mensagem);
            }
            // VERIFICAÇÃO DE DISPONIBILIDADE (RESERVA DEFERIDA)

            try {
                // A 'data' no input é algo como "2025-05-27T03:00:00.000Z" (UTC)
                // Precisamos converter para o formato de data do banco (ex: YYYY-MM-DD)
                $dataParaBusca = Carbon::parse($horario['data'])->toDateString();
            } catch (\Exception $e) {
                $mensagem = 'Formato de data inválido para o item ' . ($index + 1) . ': ' . $horario['data'];
                return redirect(status: 400)->route('espacos.index')->with('error', $mensagem);
            }

            // Busca o Horario específico no banco.
            // Ajuste os nomes das colunas ('data_horario', 'hora_inicio', 'agenda_id')
            // conforme a estrutura da sua tabela 'horarios'.
            $horarioExistenteNoBanco = Horario::where('data', $dataParaBusca)
                ->where('horario_inicio', $horario['horario_inicio']) // Assume que hora_inicio é 'HH:MM:SS'
                ->where('agenda_id', $horario['agenda_id'])
                ->first();

            if ($horarioExistenteNoBanco) {
                // O Horario existe no banco, agora verificamos suas reservas
                $temReservaDeferida = $horarioExistenteNoBanco->reservas()
                    ->where('situacao', 'deferido')
                    ->exists();

                if ($temReservaDeferida) {
                    // Se tem reserva deferida, redireciona com erro
                    $dataLegivel = Carbon::parse($dataParaBusca)->format('d/m/Y');
                    $mensagemErro = 'O horário das ' . $horario['horario_inicio'] . ' do dia ' . $dataLegivel .
                        ' (Agenda: ' . $horario['agenda_id'] . ') já possui uma reserva confirmada e não está disponível.';
                    return redirect(status: 409)->route('espacos.index')->with('error', $mensagemErro);
                }
            }
        }
        return $next($request);
    }
}
