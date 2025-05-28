import { addDays, addMonths, addWeeks, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, FileText, Info, MapPin, Repeat, Type, User, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Agenda, Andar, BreadcrumbItem, Espaco, Modulo } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
    {
        title: 'Visualizar agenda',
        href: '/espaço/agenda',
    },
];
// Tipos
interface Horario {
    id: string;
    dia: Date;
    inicio: string;
    fim: string;
    horaInicio: number;
    minutoInicio: number;
    status: 'livre' | 'reservado';
    setor?: string;
}

interface GestoresEspaco {
    manha: GestorTurno;
    tarde: GestorTurno;
    noite: GestorTurno;
}

interface ReservasTurno {
    manha: Horario[];
    tarde: Horario[];
    noite: Horario[];
}

interface GestorTurno {
    nome: string;
    email: string;
    departamento: string;
}

interface ReservaFormData {
    titulo: string;
    descricao: string;
    recorrencia: string;
    dataInicio?: Date;
    dataFim?: Date;
}

// Tipos para recorrência
type OpcaoRecorrencia = {
    valor: string;
    label: string;
    descricao: string;
    calcularDataFinal: (dataInicial: Date) => Date;
};

// Opções de recorrência
const opcoesRecorrencia: OpcaoRecorrencia[] = [
    {
        valor: 'unica',
        label: 'Apenas esta semana',
        descricao: 'A reserva será feita apenas para os dias selecionados nesta semana',
        calcularDataFinal: (dataInicial: Date) => addDays(dataInicial, 6), // Até o fim da semana atual
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
        calcularDataFinal: (dataInicial: Date) => dataInicial, // Será substituído pela data personalizada
    },
];

// Função para gerar slots de horário para a semana
const gerarSlotsParaSemana = (semanaInicio: Date) => {
    const slots: Horario[] = [];
    const horaInicio = 7;
    const horaFim = 22;

    // Gerar para cada dia da semana (segunda a sábado)
    for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
        const dia = addDays(semanaInicio, diaSemana);

        // Gerar para cada hora do dia
        for (let hora = horaInicio; hora < horaFim; hora++) {
            const inicio = `${hora.toString().padStart(2, '0')}:00`;
            const fim = `${hora.toString().padStart(2, '0')}:50`;

            // Gerar status aleatório para demonstração
            const status = Math.random() > 0.3 ? 'livre' : 'reservado';
            const setor = status === 'reservado' ? ['CPD', 'DIREÇÃO', 'COORDENAÇÃO'][Math.floor(Math.random() * 3)] : undefined;

            slots.push({
                id: `${format(dia, 'yyyy-MM-dd')}-${inicio}`,
                dia,
                inicio,
                fim,
                horaInicio: hora,
                minutoInicio: 0,
                status,
                setor,
            });
        }
    }

    return slots;
};

// Função para identificar o turno com base na hora
const identificarTurno = (hora: number): 'manha' | 'tarde' | 'noite' => {
    if (hora >= 7 && hora <= 12) return 'manha';
    if (hora >= 13 && hora <= 18) return 'tarde';
    return 'noite'; // 19-22
};

export default function AgendaEspaço() {
    const { props } = usePage<{
        agendas: Agenda[];
        espaco: Espaco;
        modulo: Modulo;
        andar: Andar;
        gestores_espaco: GestoresEspaco;
        horarios_turno: ReservasTurno
    }>();
    const { agendas, espaco, modulo, andar, gestores_espaco,  } = props;

    const hoje = new Date();
    const [semanaAtual, setSemanaAtual] = useState(startOfWeek(hoje, { weekStartsOn: 1 }));
    const [slotsSelecao, setSlotsSelecao] = useState<Slot[]>([]);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [todosSlots, setTodosSlots] = useState<Slot[]>([]);
    const [formData, setFormData] = useState<ReservaFormData>({
        titulo: '',
        descricao: '',
        recorrencia: 'unica',
        dataInicio: hoje,
        dataFim: addMonths(hoje, 1),
    });

    // Gerar dias da semana (segunda a sábado)
    const diasSemana = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const dia = addDays(semanaAtual, i);
            return {
                data: dia,
                nome: format(dia, 'EEEE', { locale: ptBR }),
                abreviado: format(dia, 'EEE', { locale: ptBR }),
                diaMes: format(dia, 'dd/MM'),
                valor: format(dia, 'yyyy-MM-dd'),
                ehHoje: format(dia, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd'),
            };
        });
    }, [semanaAtual, hoje]);

    console.log(diasSemana);
    // Gerar slots apenas quando a semana mudar
    useEffect(() => {
        setTodosSlots(gerarSlotsParaSemana(semanaAtual));
    }, [semanaAtual]);

    // Agrupar slots por hora para facilitar a renderização da tabela
    const slotsPorHora = useMemo(() => {
        const resultado: Record<string, Slot[]> = {};

        for (let hora = 7; hora < 22; hora++) {
            const horaFormatada = `${hora.toString().padStart(2, '0')}:00`;
            resultado[horaFormatada] = todosSlots.filter((slot) => slot.horaInicio === hora);
        }

        return resultado;
    }, [todosSlots]);

    // Agrupar slots por turno para facilitar a renderização
    const slotsPorTurno = useMemo(() => {
        const resultado = {
            manha: {} as Record<string, Slot[]>,
            tarde: {} as Record<string, Slot[]>,
            noite: {} as Record<string, Slot[]>,
        };

        Object.entries(slotsPorHora).forEach(([hora, slots]) => {
            const horaNum = Number.parseInt(hora.split(':')[0], 10);
            const turno = identificarTurno(horaNum);
            resultado[turno][hora] = slots;
        });

        return resultado;
    }, [slotsPorHora]);

    // Funções para navegar entre semanas
    const irParaSemanaAnterior = () => {
        setSemanaAtual(subWeeks(semanaAtual, 1));
        // Limpar seleção ao mudar de semana
        setSlotsSelecao([]);
    };

    const irParaProximaSemana = () => {
        setSemanaAtual(addWeeks(semanaAtual, 1));
        // Limpar seleção ao mudar de semana
        setSlotsSelecao([]);
    };

    // Função para alternar seleção de slot
    const alternarSelecaoSlot = (slot: Slot) => {
        if (slot.status !== 'livre') return;

        const jaExiste = slotsSelecao.some((s) => s.id === slot.id);

        if (jaExiste) {
            setSlotsSelecao(slotsSelecao.filter((s) => s.id !== slot.id));
        } else {
            // Adicionar o slot à seleção sem restrição de dia
            // Ordenar slots por dia e hora
            const novaSelecao = [...slotsSelecao, slot].sort(
                (a, b) => a.dia.getTime() - b.dia.getTime() || a.horaInicio - b.horaInicio || a.minutoInicio - b.minutoInicio,
            );

            setSlotsSelecao(novaSelecao);
        }
    };

    // Handler para atualizar os campos do formulário
    const handleFormChange = (field: keyof ReservaFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Função para solicitar reserva em período
    const solicitarReservaPeriodo = () => {
        // Obter a opção de recorrência selecionada
        const opcaoRecorrencia = opcoesRecorrencia.find((opcao) => opcao.valor === formData.recorrencia);

        if (!opcaoRecorrencia) return;

        // Calcular a data final com base na recorrência
        const dataInicial = new Date(Math.min(...slotsSelecao.map((s) => s.dia.getTime())));
        let dataFinal: Date;

        if (formData.recorrencia === 'personalizado' && formData.dataFim) {
            dataFinal = formData.dataFim;
        } else {
            dataFinal = opcaoRecorrencia.calcularDataFinal(dataInicial);
        }

        console.log('Reserva solicitada:', {
            titulo: formData.titulo,
            descricao: formData.descricao,
            slots: slotsSelecao,
            recorrencia: formData.recorrencia,
            dataInicial: format(dataInicial, 'dd/MM/yyyy'),
            dataFinal: format(dataFinal, 'dd/MM/yyyy'),
        });

        // Aqui seria implementada a lógica de reserva em período com recorrência
        setSlotsSelecao([]);
        setDialogAberto(false);

        // Reset do formulário
        setFormData({
            titulo: '',
            descricao: '',
            recorrencia: 'unica',
            dataInicio: hoje,
            dataFim: addMonths(hoje, 1),
        });
    };

    // Função para limpar seleção
    const limparSelecao = () => {
        setSlotsSelecao([]);
    };

    // Verificar se um slot está selecionado
    const isSlotSelecionado = (slot: Slot) => {
        return slotsSelecao.some((s) => s.id === slot.id);
    };

    // Calcular período de recorrência
    const calcularPeriodoRecorrencia = () => {
        if (slotsSelecao.length === 0) return null;

        const dataInicial = new Date(Math.min(...slotsSelecao.map((s) => s.dia.getTime())));
        let dataFinal: Date;

        if (formData.recorrencia === 'personalizado' && formData.dataFim) {
            dataFinal = formData.dataFim;
        } else {
            const opcaoRecorrencia = opcoesRecorrencia.find((opcao) => opcao.valor === formData.recorrencia);
            if (!opcaoRecorrencia) return null;
            dataFinal = opcaoRecorrencia.calcularDataFinal(dataInicial);
        }

        return {
            inicio: format(dataInicial, 'dd/MM/yyyy'),
            fim: format(dataFinal, 'dd/MM/yyyy'),
        };
    };

    const periodoRecorrencia = calcularPeriodoRecorrencia();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head />
            <div className="container mx-auto max-w-6xl space-y-4 py-4">
                {/* Cabeçalho com informações do espaço */}
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
                                {modulo.nome}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {andar.nome}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {espaco.capacidade_pessoas} pessoas
                            </Badge>
                        </div>

                        <div className="border-t pt-2">
                            <h3 className="mb-2 text-xs font-medium">Gestores por Turno:</h3>
                            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="bg-accent/10 hover:bg-accent/20 flex items-center justify-center gap-2 rounded-md p-1 text-xs transition-colors">
                                                <div className="font-semibold">MANHÃ:</div>
                                                <div className="flex items-center gap-1">
                                                    <User className="text-muted-foreground h-3 w-3" />
                                                    <span>{gestores_espaco.manha.nome}</span>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">{gestores_espaco.manha.nome}</p>
                                                <p className="text-xs">{gestores_espaco.manha.email}</p>
                                                <p className="text-muted-foreground text-xs">{gestores_espaco.manha.departamento}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center gap-2 rounded-md p-1 text-xs transition-colors">
                                                <div className="font-semibold">TARDE:</div>
                                                <div className="flex items-center gap-1">
                                                    <User className="text-muted-foreground h-3 w-3" />
                                                    <span>{gestores_espaco.tarde.nome}</span>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">{gestores_espaco.tarde.nome}</p>
                                                <p className="text-xs">{gestores_espaco.tarde.email}</p>
                                                <p className="text-muted-foreground text-xs">{gestores_espaco.tarde.departamento}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="bg-muted/20 hover:bg-muted/30 flex items-center justify-center gap-2 rounded-md p-1 text-xs transition-colors">
                                                <div className="font-semibold">NOITE:</div>
                                                <div className="flex items-center gap-1">
                                                    <User className="text-muted-foreground h-3 w-3" />
                                                    <span>{gestores_espaco.noite.nome}</span>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">{gestores_espaco.noite.nome}</p>
                                                <p className="text-xs">{gestores_espaco.noite.email}</p>
                                                <p className="text-muted-foreground text-xs">{gestores_espaco.noite.departamento}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Navegação de semanas */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={irParaSemanaAnterior}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Semana Anterior</span>
                        <span className="sm:hidden">Anterior</span>
                    </Button>

                    <h2 className="text-sm font-medium sm:text-base">
                        {format(semanaAtual, 'dd/MM', { locale: ptBR })} - {format(addDays(semanaAtual, 5), 'dd/MM', { locale: ptBR })}
                    </h2>

                    <Button variant="outline" size="sm" onClick={irParaProximaSemana}>
                        <span className="hidden sm:inline">Próxima Semana</span>
                        <span className="sm:hidden">Próxima</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>

                {/* Calendário estilo Google Calendar */}
                <Card>
                    <ScrollArea className="h-[calc(100vh-220px)]">
                        <div className="min-w-[800px]">
                            {/* Cabeçalho da tabela com dias da semana */}
                            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                <div className="text-muted-foreground p-2 text-center text-sm font-medium"></div>
                                {diasSemana.map((dia) => (
                                    <div
                                        key={dia.valor}
                                        className={`border-l p-2 text-center text-sm font-medium ${dia.ehHoje ? 'bg-primary/5' : ''}`}
                                    >
                                        <div>{dia.abreviado}</div>
                                        <div className={`text-xs ${dia.ehHoje ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                            {dia.diaMes}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Linhas da tabela com horários */}
                            {/* Cabeçalho e slots do turno da manhã */}
                            <div className="bg-accent/10 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                <div className="p-2 text-center text-xs font-semibold">MANHÃ</div>
                                {diasSemana.map((dia) => (
                                    <div key={`manha-${dia.valor}`} className="border-l p-2 text-center text-xs font-medium"></div>
                                ))}
                            </div>
                            {Object.entries(slotsPorTurno.manha).map(([hora, slots]) => (
                                <div key={hora} className="bg-accent/5 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.dia, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoSlot(slot)}
                                        >
                                            {slot.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {slot.setor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo setor {slot.setor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isSlotSelecionado(slot) && (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Badge variant="secondary" className="text-xs">
                                                            Selecionado
                                                        </Badge>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Cabeçalho e slots do turno da tarde */}
                            <div className="bg-secondary/10 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                <div className="p-2 text-center text-xs font-semibold">TARDE</div>
                                {diasSemana.map((dia) => (
                                    <div key={`tarde-${dia.valor}`} className="border-l p-2 text-center text-xs font-medium"></div>
                                ))}
                            </div>
                            {Object.entries(slotsPorTurno.tarde).map(([hora, slots]) => (
                                <div key={hora} className="bg-secondary/5 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.dia, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoSlot(slot)}
                                        >
                                            {slot.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {slot.setor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo setor {slot.setor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isSlotSelecionado(slot) && (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Badge variant="secondary" className="text-xs">
                                                            Selecionado
                                                        </Badge>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Cabeçalho e slots do turno da noite */}
                            <div className="bg-muted/20 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                <div className="p-2 text-center text-xs font-semibold">NOITE</div>
                                {diasSemana.map((dia) => (
                                    <div key={`noite-${dia.valor}`} className="border-l p-2 text-center text-xs font-medium"></div>
                                ))}
                            </div>
                            {Object.entries(slotsPorTurno.noite).map(([hora, slots]) => (
                                <div key={hora} className="bg-muted/10 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.dia, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoSlot(slot)}
                                        >
                                            {slot.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {slot.setor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo setor {slot.setor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isSlotSelecionado(slot) && (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Badge variant="secondary" className="text-xs">
                                                            Selecionado
                                                        </Badge>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Botão flutuante para reserva em período */}
                {slotsSelecao.length > 0 && (
                    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-2">
                        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg">
                                    Reservar {slotsSelecao.length} horário{slotsSelecao.length > 1 ? 's' : ''} em{' '}
                                    {new Set(slotsSelecao.map((s) => format(s.dia, 'yyyy-MM-dd'))).size} dia
                                    {new Set(slotsSelecao.map((s) => format(s.dia, 'yyyy-MM-dd'))).size > 1 ? 's' : ''}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Confirmar Reserva</DialogTitle>
                                    <DialogDescription>Preencha os detalhes da sua reserva.</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    {/* Campos de título e descrição */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="mb-1 flex items-center gap-2">
                                                <Type className="text-muted-foreground h-4 w-4" />
                                                <Label htmlFor="titulo" className="font-medium">
                                                    Título da Reserva
                                                </Label>
                                            </div>
                                            <Input
                                                id="titulo"
                                                placeholder="Ex: Aula de Programação, Reunião de Departamento"
                                                value={formData.titulo}
                                                onChange={(e) => handleFormChange('titulo', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="mb-1 flex items-center gap-2">
                                                <FileText className="text-muted-foreground h-4 w-4" />
                                                <Label htmlFor="descricao" className="font-medium">
                                                    Descrição
                                                </Label>
                                            </div>
                                            <Textarea
                                                id="descricao"
                                                placeholder="Descreva o propósito da reserva..."
                                                value={formData.descricao}
                                                onChange={(e) => handleFormChange('descricao', e.target.value)}
                                                className="min-h-[80px] resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Opções de recorrência */}
                                    <div className="space-y-2 border-t pt-2">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Repeat className="text-muted-foreground h-4 w-4" />
                                            <h3 className="font-medium">Período de Recorrência</h3>
                                        </div>

                                        <RadioGroup
                                            value={formData.recorrencia}
                                            onValueChange={(value) => handleFormChange('recorrencia', value)}
                                            className="space-y-2"
                                        >
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

                                    {/* Seletor de datas personalizado */}
                                    {formData.recorrencia === 'personalizado' && (
                                        <div className="bg-muted/10 space-y-4 rounded-md border p-3">
                                            <h4 className="text-sm font-medium">Selecione o período personalizado</h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="data-inicio" className="text-xs">
                                                        Data de início
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="data-inicio"
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !formData.dataInicio && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {formData.dataInicio ? (
                                                                    format(formData.dataInicio, 'dd/MM/yyyy')
                                                                ) : (
                                                                    <span>Selecione a data</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={formData.dataInicio}
                                                                onSelect={(date) => handleFormChange('dataInicio', date)}
                                                                initialFocus
                                                                disabled={(date) => date < hoje}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="data-fim" className="text-xs">
                                                        Data de término
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="data-fim"
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !formData.dataFim && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {formData.dataFim ? (
                                                                    format(formData.dataFim, 'dd/MM/yyyy')
                                                                ) : (
                                                                    <span>Selecione a data</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={formData.dataFim}
                                                                onSelect={(date) => handleFormChange('dataFim', date)}
                                                                initialFocus
                                                                disabled={(date) => (formData.dataInicio ? date < formData.dataInicio : date < hoje)}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Período selecionado */}
                                    {periodoRecorrencia && (
                                        <div className="bg-muted/30 rounded-md p-3">
                                            <div className="flex items-start gap-2">
                                                <Info className="text-muted-foreground mt-0.5 h-4 w-4" />
                                                <div>
                                                    <p className="text-sm font-medium">Período da reserva</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        De {periodoRecorrencia.inicio} até {periodoRecorrencia.fim}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Horários selecionados */}
                                    <div className="space-y-2 border-t pt-2">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Calendar className="text-muted-foreground h-4 w-4" />
                                            <h3 className="font-medium">Horários selecionados</h3>
                                        </div>

                                        <ScrollArea className="h-[200px] rounded-md border p-2">
                                            {/* Agrupar slots por dia */}
                                            {Object.entries(
                                                slotsSelecao.reduce(
                                                    (acc, slot) => {
                                                        const diaKey = format(slot.dia, 'yyyy-MM-dd');
                                                        if (!acc[diaKey]) {
                                                            acc[diaKey] = {
                                                                data: slot.dia,
                                                                slots: [],
                                                            };
                                                        }
                                                        acc[diaKey].slots.push(slot);
                                                        return acc;
                                                    },
                                                    {} as Record<string, { data: Date; slots: Slot[] }>,
                                                ),
                                            ).map(([diaKey, { data, slots }]) => (
                                                <div key={diaKey} className="mb-4 last:mb-0">
                                                    <div className="mb-1 text-sm font-medium">{format(data, 'EEEE, dd/MM', { locale: ptBR })}</div>

                                                    <div className="border-muted border-l-2 pl-2">
                                                        {slots.map((slot) => (
                                                            <div key={slot.id} className="text-muted-foreground py-1 text-sm">
                                                                {slot.inicio} - {slot.fim}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogAberto(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={solicitarReservaPeriodo} disabled={!formData.titulo.trim()}>
                                        Confirmar Reserva
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={limparSelecao}>
                            Limpar seleção
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
