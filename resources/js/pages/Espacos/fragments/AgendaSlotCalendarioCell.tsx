import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SlotCalendario } from '@/types';
import { isSameDay } from 'date-fns';

type AgendaSlotCalendarioCellProps = {
    slot: SlotCalendario;
    isSelecionado: boolean;
    hoje: Date;
    onSelect: () => void;
};
export default function AgendaSlotCalendarioCell({ slot, isSelecionado, hoje, onSelect }: AgendaSlotCalendarioCellProps) {
    const isReservado = slot.status === 'reservado';
    return (
        <div
            key={slot.id}
            className={cn(
                'relative cursor-pointer border-l p-1 transition-all',
                isReservado ? 'bg-muted/30 cursor-not-allowed' : 'hover:bg-muted/10',
                isSelecionado && 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset',
                isSameDay(slot.data, hoje) && !isSelecionado && 'bg-primary/5',
            )}
            onClick={onSelect}
        >
            {isReservado ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex h-full w-full items-center justify-center">
                                <Badge variant="outline" className="text-xs">
                                    {slot.dadosReserva?.autor}
                                </Badge>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">{slot.dadosReserva?.reserva_titulo}</p>
                            <p>Reservado por: {slot.dadosReserva?.autor}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                isSelecionado && (
                    <div className="flex h-full w-full items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                            Selecionado
                        </Badge>
                    </div>
                )
            )}
        </div>
    );
}
