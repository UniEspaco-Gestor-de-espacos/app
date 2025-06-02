import { Horario } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function pegarPrimeiroHorario(horarios: Horario[]) {
    if (horarios.length == 1) return horarios[0];
    let horario_tmp = horarios[0];
    horarios.forEach((horario) => {
        if (horario.data < horario_tmp.data) {
            horario_tmp = horario;
        } else if (horario.data == horario_tmp.data && horario.horario_inicio < horario_tmp.horario_inicio) {
            horario_tmp = horario;
        }
    });

    return horario_tmp;
}
export function pegarUltimoHorario(horarios: Horario[]) {
    if (horarios.length == 1) return horarios[0];
    let horario_tmp = horarios[0];
    horarios.forEach((horario) => {
        if (horario.data > horario_tmp.data) {
            horario_tmp = horario;
        } else if (horario.data == horario_tmp.data && horario.horario_inicio > horario_tmp.horario_inicio) {
            horario_tmp = horario;
        }
    });

    return horario_tmp;
}

export const formatDate = (dateString: string | Date) => {
    if (typeof dateString === 'string') {
        return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    }
    return format(dateString, "dd 'de' MMMM", { locale: ptBR });
};

export const formatDateTime = (dateString: string | Date) => {
    if (typeof dateString === 'string') {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    }
    return format(dateString, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};
