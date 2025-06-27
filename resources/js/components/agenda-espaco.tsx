import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Espaco, Horario, OpcoesRecorrencia, Reserva, ReservaFormData, SlotCalendario, ValorOcorrenciaType } from '@/types';
import { useForm } from '@inertiajs/react';
import { addDays, addMonths, addWeeks, format, isSameDay, parse, startOfWeek, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, FileText, Info, MapPin, Pencil, Repeat, Type, User, Users } from 'lucide-react';
import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// --- Tipos e Constantes ---

type AgendaEspacoProps = {
    isEditMode?: boolean;
    espaco: Espaco;
    reserva?: Reserva;
};

const opcoesRecorrencia: OpcoesRecorrencia[] = [
    {
        valor: 'unica',
        label: 'Apenas esta semana',
        descricao: 'A reserva será feita apenas para os dias selecionados nesta semana',
        calcularDataFinal: (dataInicial: Date) => addDays(dataInicial, 6),
    },
    {
        valor: '15dias',
        label: 'Próximos 15 dias',
        descricao: 'A reserva será replicada pelos próximos 15 dias',
        calcularDataFinal: (dataInicial: Date) => addDays(dataInicial, 14),
    },
    {
        valor: '1mes',
        label: '1 mês',
        descricao: 'A reserva será replicada por 1 mês',
        calcularDataFinal: (dataInicial: Date) => addMonths(dataInicial, 1),
    },
    {
        valor: 'personalizado',
        label: 'Período personalizado',
        descricao: 'Defina um período personalizado para a recorrência',
        calcularDataFinal: (dataInicial: Date) => dataInicial,
    },
];

const identificarTurno = (hora: number): 'manha' | 'tarde' | 'noite' => {
    if (hora >= 7 && hora <= 12) return 'manha';
    if (hora >= 13 && hora <= 18) return 'tarde';
    return 'noite';
};

// ============================================================================
// --- Componentes Modularizados (Versão Corrigida) ---
// ============================================================================

const EspacoHeader: FC<{ espaco: Espaco; gestoresPorTurno: any }> = ({ espaco, gestoresPorTurno }) => (
    <Card className="shadow-sm">
        <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-5 w-5" />
                Nome: {espaco.nome}
            </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
            <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {espaco.andar?.modulo?.nome}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {espaco.andar?.nome}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {espaco.capacidade_pessoas} pessoas
                </Badge>
            </div>
            <div className="border-t pt-2">
                <h3 className="mb-2 text-xs font-medium">Gestores por Turno:</h3>
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3">
                    {['manha', 'tarde', 'noite'].map((turno) => (
                        <TooltipProvider key={turno}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`flex items-center justify-center gap-2 rounded-md p-1 text-xs transition-colors`}>
                                        <div className="font-semibold">{turno.toUpperCase()}:</div>
                                        <div className="flex items-center gap-1">
                                            <User className="text-muted-foreground h-3 w-3" />
                                            <span>{gestoresPorTurno[turno]?.nome ?? 'N/A'}</span>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {gestoresPorTurno[turno] ? (
                                        <div className="space-y-1">
                                            <p className="font-medium">{gestoresPorTurno[turno].nome}</p>
                                            <p className="text-xs">{gestoresPorTurno[turno].email}</p>
                                            <p className="text-muted-foreground text-xs">{gestoresPorTurno[turno].departamento}</p>
                                        </div>
                                    ) : (
                                        <p>Nenhum gestor para este turno.</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
);

const AgendaNavegacao: FC<{ semanaAtual: Date; onAnterior: () => void; onProxima: () => void }> = ({ semanaAtual, onAnterior, onProxima }) => (
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

const SlotCalendarioCell: FC<{ slot: SlotCalendario; isSelecionado: boolean; hoje: Date; onSelect: () => void }> = ({
    slot,
    isSelecionado,
    hoje,
    onSelect,
}) => {
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
};

const TurnoSection: FC<{
    titulo: string;
    slotsDoTurno: Record<string, SlotCalendario[]>;
    diasSemana: any[];
    isSlotSelecionado: (slot: SlotCalendario) => boolean;
    alternarSelecaoSlot: (slot: SlotCalendario) => void;
    hoje: Date;
}> = ({ titulo, slotsDoTurno, diasSemana, isSlotSelecionado, alternarSelecaoSlot, hoje }) => (
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
                    <SlotCalendarioCell
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

const AgendaCalendario: FC<{
    diasSemana: any[];
    slotsPorTurno: any;
    isSlotSelecionado: (slot: SlotCalendario) => boolean;
    alternarSelecaoSlot: (slot: SlotCalendario) => void;
    hoje: Date;
}> = ({ diasSemana, slotsPorTurno, isSlotSelecionado, alternarSelecaoSlot, hoje }) => (
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
                <TurnoSection
                    titulo="MANHÃ"
                    slotsDoTurno={slotsPorTurno.manha}
                    diasSemana={diasSemana}
                    isSlotSelecionado={isSlotSelecionado}
                    alternarSelecaoSlot={alternarSelecaoSlot}
                    hoje={hoje}
                />
                <TurnoSection
                    titulo="TARDE"
                    slotsDoTurno={slotsPorTurno.tarde}
                    diasSemana={diasSemana}
                    isSlotSelecionado={isSlotSelecionado}
                    alternarSelecaoSlot={alternarSelecaoSlot}
                    hoje={hoje}
                />
                <TurnoSection
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

const DialogReserva: FC<{
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: FormEvent) => void;
    formData: ReservaFormData;
    setFormData: (key: keyof ReservaFormData | 'data_inicial' | 'data_final', value: any) => void;
    recorrencia: ValorOcorrenciaType;
    setRecorrencia: (value: ValorOcorrenciaType) => void;
    slotsSelecao: SlotCalendario[];
    hoje: Date;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ isEditMode, isOpen, onOpenChange, onSubmit, formData, setFormData, recorrencia, setRecorrencia, slotsSelecao, hoje, isSubmitting }) => {
    const periodoRecorrencia = useMemo(
        () => ({
            inicio: format(formData.data_inicial ?? hoje, 'dd/MM/yyyy'),
            fim: format(formData.data_final ?? addMonths(hoje, 1), 'dd/MM/yyyy'),
        }),
        [formData.data_inicial, formData.data_final, hoje],
    );

    const slotsAgrupadosPorDia = useMemo(
        () =>
            slotsSelecao.reduce(
                (acc, horario) => {
                    const diaKey = format(horario.data, 'yyyy-MM-dd');
                    if (!acc[diaKey]) {
                        acc[diaKey] = { data: horario.data, slots: [] };
                    }
                    acc[diaKey].slots.push(horario);
                    return acc;
                },
                {} as Record<string, { data: Date; slots: SlotCalendario[] }>,
            ),
        [slotsSelecao],
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="shadow-lg">
                    {isEditMode ? 'Editar' : 'Reservar'} {slotsSelecao.length} horário{slotsSelecao.length > 1 ? 's' : ''} em{' '}
                    {Object.keys(slotsAgrupadosPorDia).length} dia
                    {Object.keys(slotsAgrupadosPorDia).length > 1 ? 's' : ''}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Atualizar Reserva' : 'Confirmar Reserva'}</DialogTitle>
                        <DialogDescription>
                            {' '}
                            {isEditMode ? 'Ajuste os detalhes da sua reserva.' : 'Preencha os detalhes da sua reserva.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="titulo" className="flex items-center gap-2 font-medium">
                                <Type className="text-muted-foreground h-4 w-4" /> Título da Reserva
                            </Label>
                            <Input
                                id="titulo"
                                placeholder="Ex: Aula, Reunião"
                                value={formData.titulo}
                                onChange={(e) => setFormData('titulo', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descricao" className="flex items-center gap-2 font-medium">
                                <FileText className="text-muted-foreground h-4 w-4" /> Descrição
                            </Label>
                            <Textarea
                                id="descricao"
                                placeholder="Descreva o propósito da reserva..."
                                value={formData.descricao}
                                onChange={(e) => setFormData('descricao', e.target.value)}
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                        <div className="space-y-2 border-t pt-2">
                            <h3 className="flex items-center gap-2 font-medium">
                                <Repeat className="text-muted-foreground h-4 w-4" /> Período de Recorrência
                            </h3>
                            <RadioGroup value={recorrencia} onValueChange={(v: ValorOcorrenciaType) => setRecorrencia(v)} className="space-y-2">
                                {opcoesRecorrencia.map((opcao) => (
                                    <div key={opcao.valor} className="flex items-start space-x-2">
                                        <RadioGroupItem value={opcao.valor} id={opcao.valor} />
                                        <div className="grid gap-1">
                                            <Label htmlFor={opcao.valor} className="font-medium">
                                                {opcao.label}
                                            </Label>
                                            <p className="text-muted-foreground text-xs">{opcao.descricao}</p>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        {recorrencia === 'personalizado' && (
                            <div className="bg-muted/10 grid grid-cols-2 gap-4 rounded-md border p-3">
                                <div className="space-y-2">
                                    <Label htmlFor="data-inicial" className="text-xs">
                                        Início
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !formData.data_inicial && 'text-muted-foreground',
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formData.data_inicial ? (
                                                    format(new Date(formData.data_inicial), 'dd/MM/yyyy')
                                                ) : (
                                                    <span>Selecione</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={formData.data_inicial ? new Date(formData.data_inicial) : undefined}
                                                onSelect={(date) => setFormData('data_inicial', date ?? null)}
                                                initialFocus
                                                disabled={(date) => date < hoje}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="data-final" className="text-xs">
                                        Término
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !formData.data_final && 'text-muted-foreground',
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formData.data_final ? format(new Date(formData.data_final), 'dd/MM/yyyy') : <span>Selecione</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={formData.data_final ? new Date(formData.data_final) : undefined}
                                                onSelect={(date) => setFormData('data_final', date ?? null)}
                                                initialFocus
                                                disabled={(date) => (formData.data_inicial ? date < new Date(formData.data_inicial) : date < hoje)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        )}
                        <div className="bg-muted/30 flex items-start gap-2 rounded-md p-3">
                            <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">Período da reserva</p>
                                <p className="text-muted-foreground text-xs">
                                    De {periodoRecorrencia.inicio} até {periodoRecorrencia.fim}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 border-t pt-2">
                            <h3 className="flex items-center gap-2 font-medium">
                                <Calendar className="text-muted-foreground h-4 w-4" /> Horários selecionados
                            </h3>
                            <ScrollArea className="h-[150px] rounded-md border p-2">
                                {Object.entries(slotsAgrupadosPorDia).map(([diaKey, { data, slots }]) => (
                                    <div key={diaKey} className="mb-3 last:mb-0">
                                        <div className="mb-1 text-sm font-medium">{format(data, 'EEEE, dd/MM', { locale: ptBR })}</div>
                                        <div className="border-muted border-l-2 pl-2">
                                            {slots.map((horario) => (
                                                <div key={horario.id} className="text-muted-foreground py-1 text-sm">
                                                    {horario.horario_inicio} - {horario.horario_fim}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!formData.titulo.trim() || isSubmitting}>
                            {isSubmitting
                                ? isEditMode
                                    ? 'Salvando...'
                                    : 'Confirmando...'
                                : isEditMode
                                  ? 'Atualizar Reserva'
                                  : 'Confirmar Reserva'}{' '}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

/**
 * @component EditModeAlert
 * @description Um alerta exibido no topo da página quando o isEditMode é true.
 */
const EditModeAlert: FC<{ reserva: Reserva }> = ({ reserva }) => (
    <Alert variant="default" className="border-yellow-400 bg-yellow-50 text-yellow-800">
        <Pencil className="h-4 w-4 !text-yellow-600" />
        <AlertTitle className="font-semibold !text-yellow-900">Modo de Edição</AlertTitle>
        <AlertDescription className="!text-yellow-700">
            Você está editando a reserva: <strong>{reserva.titulo}</strong>. As alterações nos horários e detalhes serão salvas nesta reserva.
        </AlertDescription>
    </Alert>
);
// ============================================================================
// --- Componente Principal (Orquestrador) ---
// ============================================================================

export default function AgendaEspaço({ isEditMode = false, espaco, reserva }: AgendaEspacoProps) {
    const { agendas } = espaco;
    const hoje = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);

    const slotsIniciais = useMemo(
        () =>
            !isEditMode || !reserva?.horarios
                ? []
                : reserva.horarios.map(
                      (horario) =>
                          ({
                              id: `${horario.data}|${horario.horario_inicio}`,
                              status: 'selecionado',
                              data: parse(horario.data, 'yyyy-MM-dd', new Date()),
                              horario_inicio: horario.horario_inicio,
                              horario_fim: horario.horario_fim,
                              agenda_id: horario.agenda?.id,
                              dadosReserva: { horarioDB: horario, autor: reserva.user!.name, reserva_titulo: reserva.titulo },
                          }) as SlotCalendario,
                  ),
        [isEditMode, reserva],
    );

    const [semanaAtual, setSemanaAtual] = useState(() => startOfWeek(slotsIniciais.length > 0 ? slotsIniciais[0].data : hoje, { weekStartsOn: 1 }));
    const [slotsSelecao, setSlotsSelecao] = useState<SlotCalendario[]>(slotsIniciais);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [todosSlots, setTodosSlots] = useState<SlotCalendario[]>([]);
    const [recorrencia, setRecorrencia] = useState<ValorOcorrenciaType>(reserva?.recorrencia || 'unica');

    const { data, setData, post, patch, reset, processing } = useForm<ReservaFormData>({
        titulo: reserva?.titulo ?? '',
        descricao: reserva?.descricao ?? '',
        data_inicial: reserva?.data_inicial ? new Date(reserva.data_inicial) : hoje,
        data_final: reserva?.data_final ? new Date(reserva.data_final) : addMonths(hoje, 1),
        horarios_solicitados: reserva?.horarios ?? [],
    });

    const { gestoresPorTurno, horariosReservadosMap } = useMemo(() => {
        const gestores: any = {};
        const reservadosMap = new Map<string, { horario: Horario; autor: string; reserva_titulo: string }>();

        agendas?.forEach((agenda) => {
            if (agenda.user) {
                gestores[agenda.turno] = {
                    nome: agenda.user.name,
                    email: agenda.user.email,
                    departamento: agenda.user.setor?.nome ?? 'N/I',
                    agenda_id: agenda.id,
                };
            }
            agenda.horarios?.forEach((horario) => {
                const reservaValida = horario.reservas?.find((r) => ['deferida', 'parcialmente_deferida'].includes(r.situacao));
                if (reservaValida) {
                    if (isEditMode && reservaValida.id === reserva?.id) return;
                    const chave = `${horario.data}|${horario.horario_inicio}`;
                    reservadosMap.set(chave, {
                        horario: horario,
                        autor: reservaValida.user?.name ?? 'Indefinido',
                        reserva_titulo: reservaValida.titulo,
                    });
                }
            });
        });
        return { gestoresPorTurno: gestores, horariosReservadosMap: reservadosMap };
    }, [agendas, isEditMode, reserva?.id]);

    useEffect(() => {
        const gerarSlotsParaSemana = (semanaInicio: Date) => {
            const slotsGerados: SlotCalendario[] = [];
            for (let diaOffset = 0; diaOffset < 7; diaOffset++) {
                const diaAtual = addDays(semanaInicio, diaOffset);
                const diaFormatado = format(diaAtual, 'yyyy-MM-dd');
                for (let hora = 7; hora < 22; hora++) {
                    const turno = identificarTurno(hora);
                    const inicio = `${String(hora).padStart(2, '0')}:00:00`;
                    const chave = `${diaFormatado}|${inicio}`;
                    const horarioReservado = horariosReservadosMap.get(chave);
                    if (horarioReservado) {
                        slotsGerados.push({
                            id: chave,
                            status: 'reservado',
                            data: diaAtual,
                            horario_inicio: inicio,
                            horario_fim: `${String(hora).padStart(2, '0')}:50:00`,
                            dadosReserva: {
                                horarioDB: horarioReservado.horario,
                                autor: horarioReservado.autor,
                                reserva_titulo: horarioReservado.reserva_titulo,
                            },
                        });
                    } else if (gestoresPorTurno[turno]) {
                        slotsGerados.push({
                            id: chave,
                            status: 'livre',
                            data: diaAtual,
                            horario_inicio: inicio,
                            horario_fim: `${String(hora).padStart(2, '0')}:50:00`,
                            agenda_id: gestoresPorTurno[turno].agenda_id,
                        });
                    }
                }
            }
            return slotsGerados;
        };
        setTodosSlots(gerarSlotsParaSemana(semanaAtual));
    }, [semanaAtual, horariosReservadosMap, gestoresPorTurno]);

    const diasSemana = useMemo(
        () =>
            Array.from({ length: 7 }).map((_, i) => {
                const dia = addDays(semanaAtual, i);
                return {
                    data: dia,
                    nome: format(dia, 'EEEE', { locale: ptBR }),
                    abreviado: format(dia, 'EEE', { locale: ptBR }),
                    diaMes: format(dia, 'dd/MM'),
                    valor: format(dia, 'yyyy-MM-dd'),
                    ehHoje: isSameDay(dia, hoje),
                };
            }),
        [semanaAtual, hoje],
    );

    const slotsPorTurno = useMemo(() => {
        // Primeiro, agrupa todos os slots por hora (07:00, 08:00, etc.), como na lógica original.
        const slotsPorHora: Record<string, SlotCalendario[]> = {};
        for (let hora = 7; hora < 22; hora++) {
            const horaFormatada = `${String(hora).padStart(2, '0')}:00`;
            slotsPorHora[horaFormatada] = todosSlots.filter((slot) => slot.horario_inicio.startsWith(horaFormatada));
        }

        // Depois, distribui essas horas nos seus respectivos turnos.
        const resultado = {
            manha: {} as Record<string, SlotCalendario[]>,
            tarde: {} as Record<string, SlotCalendario[]>,
            noite: {} as Record<string, SlotCalendario[]>,
        };

        Object.entries(slotsPorHora).forEach(([hora, slotsDaHora]) => {
            const horaNum = parseInt(hora.split(':')[0], 10);
            const turno = identificarTurno(horaNum);
            if (slotsDaHora.length > 0) {
                // Só adiciona a linha se houver slots
                resultado[turno][hora] = slotsDaHora;
            }
        });

        return resultado;
    }, [todosSlots]);

    const irParaSemanaAnterior = () => setSemanaAtual(subWeeks(semanaAtual, 1));
    const irParaProximaSemana = () => setSemanaAtual(addWeeks(semanaAtual, 1));
    const limparSelecao = () => setSlotsSelecao([]);
    const isSlotSelecionado = (slot: SlotCalendario) => slotsSelecao.some((s) => s.id === slot.id);

    const alternarSelecaoSlot = (slot: SlotCalendario) => {
        if (slot.status !== 'livre') return;
        const novaSelecao = isSlotSelecionado(slot)
            ? slotsSelecao.filter((s) => s.id !== slot.id)
            : [...slotsSelecao, slot].sort((a, b) => a.data.getTime() - b.data.getTime() || a.horario_inicio.localeCompare(b.horario_inicio));
        setSlotsSelecao(novaSelecao);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const opcaoRecorrencia = opcoesRecorrencia.find((op) => op.valor === recorrencia);
        if (!opcaoRecorrencia || slotsSelecao.length === 0) return;

        const dataInicialCalculada = new Date(Math.min(...slotsSelecao.map((s) => s.data.getTime())));
        let dataFinalCalculada = data.data_final;

        if (recorrencia !== 'personalizado') {
            dataFinalCalculada = opcaoRecorrencia.calcularDataFinal(dataInicialCalculada);
        }

        setData((prevData) => ({
            ...prevData,
            data_inicial: dataInicialCalculada,
            data_final: dataFinalCalculada,
            horarios_solicitados: slotsSelecao.map((s) => ({
                data: format(s.data, 'yyyy-MM-dd'),
                horario_inicio: s.horario_inicio,
                horario_fim: s.horario_fim,
                agenda_id: s.agenda_id,
            })),
        }));

        const options = {
            onSuccess: () => {
                limparSelecao();
                setDialogAberto(false);
                reset();
                toast.success(isEditMode ? 'Reserva atualizada com sucesso!' : 'Reserva solicitada com sucesso!');
            },
            onError: (errors: any) => {
                toast.error((Object.values(errors)[0] as string) || 'Ocorreu um erro de validação.');
            },
        };
        if (isEditMode) {
            patch(route('reservas.update', { reserva: reserva?.id }), options);
        } else {
            post(route('reservas.store'), options);
        }
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-4 py-4">
            {isEditMode && reserva && <EditModeAlert reserva={reserva} />}
            <EspacoHeader espaco={espaco} gestoresPorTurno={gestoresPorTurno} />
            <AgendaNavegacao semanaAtual={semanaAtual} onAnterior={irParaSemanaAnterior} onProxima={irParaProximaSemana} />
            <AgendaCalendario
                diasSemana={diasSemana}
                slotsPorTurno={slotsPorTurno}
                isSlotSelecionado={isSlotSelecionado}
                alternarSelecaoSlot={alternarSelecaoSlot}
                hoje={hoje}
            />

            {slotsSelecao.length > 0 && (
                <div className="fixed right-4 bottom-4 z-20 flex flex-col items-end gap-2">
                    <DialogReserva
                        isOpen={dialogAberto}
                        isEditMode={isEditMode}
                        onOpenChange={setDialogAberto}
                        onSubmit={handleFormSubmit}
                        formData={data}
                        setFormData={(key, value) => setData(key as any, value)}
                        recorrencia={recorrencia}
                        setRecorrencia={setRecorrencia}
                        slotsSelecao={slotsSelecao}
                        hoje={hoje}
                        isSubmitting={processing}
                    />
                    <Button variant="outline" size="sm" onClick={limparSelecao}>
                        Limpar seleção
                    </Button>
                </div>
            )}
        </div>
    );
}
