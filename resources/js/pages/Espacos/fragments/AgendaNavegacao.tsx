import { Button } from '@/components/ui/button';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AgendaNavegacaoProps = {
    semanaAtual: Date;
    onAnterior: () => void;
    onProxima: () => void;
};
export default function AgendaNavegacao({ semanaAtual, onAnterior, onProxima }: AgendaNavegacaoProps) {
    return (
        <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={onAnterior}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Semana Anterior</span>
                <span className="sm:hidden">Anterior</span>
            </Button>
            <h2 className="text-sm font-medium sm:text-base">
                {format(semanaAtual, 'dd/MM', { locale: ptBR })} - {format(addDays(semanaAtual, 6), 'dd/MM', { locale: ptBR })}
            </h2>
            <Button variant="outline" size="sm" onClick={onProxima}>
                <span className="hidden sm:inline">Próxima Semana</span>
                <span className="sm:hidden">Próxima</span>
                <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
    );
}
