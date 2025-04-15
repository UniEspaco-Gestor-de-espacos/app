<?php

namespace App\Enums\SituacaoReserva;


enum SituacaoReservaEnum: string
{
    case EM_ANALISE = 'em_analise';
    case INDEFERIDO = 'indeferido';
    case DEFERIDO = 'deferido';
}
