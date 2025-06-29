import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AgendaDiasSemanaType, AgendaSlotsPorTurnoType, SlotCalendario } from '@/types';
import AgendaTurnoSection from './AgendaTurnoSection';

type AgendaCalendarioProps = {
    diasSemana: AgendaDiasSemanaType[];
    slotsPorTurno: AgendaSlotsPorTurnoType;
    isSlotSelecionado: (slot: SlotCalendario) => boolean;
    alternarSelecaoSlot: (slot: SlotCalendario) => void;
    hoje: Date;
};

export default function AgendaCalendario({ diasSemana, slotsPorTurno, isSlotSelecionado, alternarSelecaoSlot, hoje }: AgendaCalendarioProps) {
    return (
        <Card>
            <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="min-w-[800px]">
                    <div className="bg-background sticky top-0 z-10 grid grid-cols-[80px_repeat(7,1fr)] border-b">
                        <div className="text-muted-foreground p-2 text-center text-sm font-medium"></div>
                        {diasSemana.map((dia) => (
                            <div key={dia.valor} className={cn('border-l p-2 text-center text-sm font-medium', dia.ehHoje && 'bg-primary/5')}>
                                <div>{dia.abreviado}</div>
                                <div className={cn('text-xs', dia.ehHoje ? 'text-primary font-bold' : 'text-muted-foreground')}>{dia.diaMes}</div>
                            </div>
                        ))}
                    </div>
                    <AgendaTurnoSection
                        titulo="MANHÃ"
                        slotsDoTurno={slotsPorTurno.manha}
                        diasSemana={diasSemana}
                        isSlotSelecionado={isSlotSelecionado}
                        alternarSelecaoSlot={alternarSelecaoSlot}
                        hoje={hoje}
                    />
                    <AgendaTurnoSection
                        titulo="TARDE"
                        slotsDoTurno={slotsPorTurno.tarde}
                        diasSemana={diasSemana}
                        isSlotSelecionado={isSlotSelecionado}
                        alternarSelecaoSlot={alternarSelecaoSlot}
                        hoje={hoje}
                    />
                    <AgendaTurnoSection
                        titulo="NOITE"
                        slotsDoTurno={slotsPorTurno.noite}
                        diasSemana={diasSemana}
                        isSlotSelecionado={isSlotSelecionado}
                        alternarSelecaoSlot={alternarSelecaoSlot}
                        hoje={hoje}
                    />
                </div>
            </ScrollArea>
        </Card>
    );
}
