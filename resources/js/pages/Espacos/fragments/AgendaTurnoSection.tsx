import { cn } from '@/lib/utils';
import { AgendaDiasSemanaType, SlotCalendario } from '@/types';
import AgendaSlotCalendarioCell from './AgendaSlotCalendarioCell';

type AgendaTurnoSectionProps = {
    titulo: string;
    slotsDoTurno: Record<string, SlotCalendario[]>;
    diasSemana: AgendaDiasSemanaType[];
    isSlotSelecionado: (slot: SlotCalendario) => boolean;
    alternarSelecaoSlot: (slot: SlotCalendario) => void;
    hoje: Date;
};
export default function AgendaTurnoSection({
    titulo,
    slotsDoTurno,
    diasSemana,
    isSlotSelecionado,
    alternarSelecaoSlot,
    hoje,
}: AgendaTurnoSectionProps) {
    return (
        <>
            <div
                className={cn(
                    'grid grid-cols-[80px_repeat(7,1fr)] border-b',
                    titulo === 'MANHÃ' && 'bg-accent/10',
                    titulo === 'TARDE' && 'bg-secondary/10',
                    titulo === 'NOITE' && 'bg-muted/20',
                )}
            >
                <div className="p-2 text-center text-xs font-semibold">{titulo}</div>
                {diasSemana.map((dia) => (
                    <div key={`${titulo}-${dia.valor}`} className="border-l p-2 text-center text-xs font-medium"></div>
                ))}
            </div>
            {Object.entries(slotsDoTurno).map(([hora, slots]) => (
                <div
                    key={hora}
                    className={cn(
                        'grid grid-cols-[80px_repeat(7,1fr)] border-b',
                        titulo === 'MANHÃ' && 'bg-accent/5',
                        titulo === 'TARDE' && 'bg-secondary/5',
                        titulo === 'NOITE' && 'bg-muted/10',
                    )}
                >
                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                        {hora} - {hora.split(':')[0]}:50
                    </div>
                    {slots.map((slot) => (
                        <AgendaSlotCalendarioCell
                            key={slot.id}
                            slot={slot}
                            isSelecionado={isSlotSelecionado(slot)}
                            onSelect={() => alternarSelecaoSlot(slot)}
                            hoje={hoje}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}
