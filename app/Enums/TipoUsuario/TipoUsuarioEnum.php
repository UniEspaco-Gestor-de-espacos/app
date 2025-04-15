<?php

namespace App\Enums\TipoUsuario;

enum TipoUsuarioEnum: string
{
    case SETOR = 'setor';
    case PROFESSOR = 'professor';
    case ALUNO = 'aluno';
    case EXTERNO = 'externo';
}
