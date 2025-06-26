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
import { addDays, addMonths, addWeeks, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, FileText, Info, MapPin, Repeat, Type, User, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type AgendaEspacoProps = {
    isEditMode?: boolean;
    espaco: Espaco;
    reserva?: Reserva;
};

export default function AgendaEspaço({ isEditMode = false, espaco, reserva }: AgendaEspacoProps) {
    const { andar, agendas } = espaco;
    const modulo = andar?.modulo;
    const slotsIniciais =
        !isEditMode || !reserva?.horarios
            ? []
            : reserva!.horarios.map(
                  (horario) =>
                      ({
                          id: `${format(new Date(horario.data), 'yyyy-MM-dd')}|${horario.horario_inicio}`,
                          status: 'selecionado', // Marcamos como 'selecionado'
                          data: new Date(horario.data),
                          horario_inicio: horario.horario_inicio,
                          horario_fim: horario.horario_fim,
                          agenda_id: horario.agenda?.id,
                          dadosReserva: { horarioDB: horario, autor: reserva.user!.name, reserva_titulo: reserva.titulo }, // Adiciona dados relevantes
                      }) as SlotCalendario,
              );

    const hoje = useMemo(() => new Date(), []);
    const [semanaAtual, setSemanaAtual] = useState(startOfWeek(hoje, { weekStartsOn: 1 }));
    const [slotsSelecao, setSlotsSelecao] = useState<SlotCalendario[]>(slotsIniciais);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [todosSlots, setTodosSlots] = useState<SlotCalendario[]>([]);
    const [recorrencia, setRecorrencia] = useState<ValorOcorrenciaType>('unica');
    const { data, setData, post, patch, reset } = useForm<ReservaFormData>({
        titulo: isEditMode ? reserva!.titulo : '',
        descricao: isEditMode ? reserva!.descricao : '',
        data_inicial: isEditMode ? reserva!.data_inicial : hoje,
        data_final: isEditMode ? reserva!.data_final : addMonths(hoje, 1),
        horarios_solicitados: isEditMode ? reserva!.horarios : [],
    });

    // Opções de recorrência
    const opcoesRecorrencia: OpcoesRecorrencia[] = [
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
    // Função para identificar o turno com base na hora
    const identificarTurno = (hora: number): 'manha' | 'tarde' | 'noite' => {
        if (hora >= 7 && hora <= 12) return 'manha';
        if (hora >= 13 && hora <= 18) return 'tarde';
        return 'noite'; // 19-22
    };
    const { gestoresPorTurno, horariosReservadosMap } = useMemo(() => {
        // Objeto para mapear os gestores por turno (substitui 'gestores_espaco')
        const gestores: { [key: string]: { nome: string; email: string; departamento: string; agenda_id: number } } = {};
        // Um Map para acesso rápido aos horários reservados (substitui 'horarios_reservados')
        const reservadosMap = new Map<string, { horario: Horario; autor: string; reserva_titulo: string }>();

        // Iteramos sobre as agendas que vieram dentro do espaço
        agendas?.forEach((agenda) => {
            // Preenchemos os dados dos gestores
            if (agenda.user) {
                gestores[agenda.turno] = {
                    nome: agenda.user.name,
                    email: agenda.user.email,
                    departamento: agenda.user.setor?.nome ?? 'Setor não informado',
                    agenda_id: agenda.id,
                };
            }
            // Preenchemos o Map com os horários já reservados
            agenda.horarios?.forEach((horario) => {
                if (horario.reservas && horario.reservas.length > 0) {
                    const reservaDoHorario = horario.reservas.filter(
                        (reserva) => reserva.situacao === 'deferida' || reserva.situacao === 'parcialmente_deferida',
                    ); // Pegamos a primeira reserva para este horário
                    if (isEditMode && reservaDoHorario.find((r) => r.id == reserva?.id)) {
                        console.log('pulou');
                        return; // Pula este horário, para que ele apareça como 'livre' ou 'selecionado'
                    }
                    // A chave do Map combina data e hora para uma busca O(1)
                    const chave = `${horario.data}|${horario.horario_inicio}`;
                    reservadosMap.set(chave, {
                        horario: horario,
                        autor: reservaDoHorario[0].user?.name ?? 'Indefinido',
                        reserva_titulo: reservaDoHorario[0].titulo,
                    });
                }
            });
        });
        return { gestoresPorTurno: gestores, horariosReservadosMap: reservadosMap };
    }, [agendas]); // Recalcular apenas se a prop 'agenda' mudar

    // Função para gerar slots de horário para a semana
    const gerarSlotsParaSemana = (semanaInicio: Date) => {
        const slotsGerados: SlotCalendario[] = [];
        const horaInicio = 7;
        const horaFim = 22;

        for (let diaOffset = 0; diaOffset < 7; diaOffset++) {
            // Segunda a Domingo
            const diaAtual = addDays(semanaInicio, diaOffset);
            const diaFormatado = format(diaAtual, 'yyyy-MM-dd');

            for (let hora = horaInicio; hora < horaFim; hora++) {
                const turno = identificarTurno(hora);
                const inicio = `${hora.toString().padStart(2, '0')}:00:00`;
                const fim = `${hora.toString().padStart(2, '0')}:50:00`;

                // Busca no nosso Map de horários reservados
                const chave = `${diaFormatado}|${inicio}`;
                const horarioReservado = horariosReservadosMap.get(chave);
                if (horarioReservado) {
                    // Se está RESERVADO, cria um SlotCalendario com os dados da reserva.
                    slotsGerados.push({
                        id: chave,
                        status: 'reservado',
                        data: diaAtual,
                        horario_inicio: inicio,
                        horario_fim: fim,
                        dadosReserva: {
                            horarioDB: horarioReservado.horario,
                            autor: horarioReservado.autor,
                            reserva_titulo: horarioReservado.reserva_titulo,
                        },
                    });
                } else if (gestoresPorTurno[turno]) {
                    // Se está LIVRE, cria um SlotCalendario com o agenda_id.
                    slotsGerados.push({
                        id: chave,
                        status: 'livre',
                        data: diaAtual,
                        horario_inicio: inicio,
                        horario_fim: fim,
                        agenda_id: gestoresPorTurno[turno].agenda_id,
                    });
                }
            }
        }
        return slotsGerados;
    };

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
    // Gerar slots apenas quando a semana mudar
    useEffect(() => {
        setTodosSlots(gerarSlotsParaSemana(semanaAtual));
    }, [semanaAtual]);

    // Agrupar slots por hora para facilitar a renderização da tabela
    const slotsPorHora = useMemo(() => {
        const resultado: Record<string, SlotCalendario[]> = {};

        for (let hora = 7; hora < 22; hora++) {
            const slotFormatado = `${hora.toString().padStart(2, '0')}:00`;
            resultado[slotFormatado] = todosSlots.filter((slot) => slot.horario_inicio == `${slotFormatado}:00`);
        }

        return resultado;
    }, [todosSlots]);

    // Agrupar slots por turno para facilitar a renderização
    const slotsPorTurno = useMemo(() => {
        const resultado = {
            manha: {} as Record<string, SlotCalendario[]>,
            tarde: {} as Record<string, SlotCalendario[]>,
            noite: {} as Record<string, SlotCalendario[]>,
        };

        Object.entries(slotsPorHora).forEach(([hora, horario]) => {
            const horaNum = Number.parseInt(hora.split(':')[0], 10);
            const turno = identificarTurno(horaNum);
            resultado[turno][hora] = horario;
        });

        return resultado;
    }, [slotsPorHora]);

    useEffect(() => {
        const horariosParaEnvio: Partial<Horario>[] = slotsSelecao.map((slot) => {
            return {
                data: slot.data,
                horario_inicio: slot.horario_inicio,
                horario_fim: slot.horario_fim,
                agenda_id: slot.agenda_id,
            };
        });
        setData((prevData) => ({ ...prevData, horarios_solicitados: horariosParaEnvio }));
    }, [setData, slotsSelecao]);

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
    const alternarSelecaoSlot = (slot: SlotCalendario) => {
        if (slot.status !== 'livre') return;

        const jaExiste = slotsSelecao.some((slotSelect) => slotSelect.id === slot.id);

        if (jaExiste) {
            setSlotsSelecao(slotsSelecao.filter((slotSelect) => slotSelect.id !== slot.id));
        } else {
            // Adicionar o slot à seleção sem restrição de dia
            // Ordenar slots por dia e hora
            const novaSelecao = [...slotsSelecao, slot].sort(
                (a, b) =>
                    a.data.getTime() - b.data.getTime() || // Compara dias primeiro
                    a.horario_inicio.localeCompare(b.horario_inicio), // Se dias iguais, compara horaInicio como string "HH:MM:SS"
            );

            setSlotsSelecao(novaSelecao);
        }
    };

    // Função para enviar o formulário
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Obter a opção de recorrência selecionada
        const opcaoRecorrencia = opcoesRecorrencia.find((opcao) => opcao.valor === recorrencia);
        if (!opcaoRecorrencia) return;

        // Calcular a data final com base na recorrência
        const dataInicial = new Date(Math.min(...slotsSelecao.map((slotSelect) => slotSelect.data.getTime())));

        if (recorrencia !== 'personalizado') {
            setData((prevData) => ({ ...prevData, data_final: opcaoRecorrencia.calcularDataFinal(dataInicial) }));
        }

        if (isEditMode) {
            patch(route('reservas.update', { reserva: reserva?.id }), {
                onSuccess: () => {
                    setSlotsSelecao([]);
                    setDialogAberto(false);
                    reset();
                },
                onError: (error) => {
                    const firstError = Object.values(error)[0];
                    toast.error(firstError || 'Ocorreu um erro de validação. Verifique os campos');
                },
            });
        } else {
            post(route('reservas.store'), {
                onSuccess: () => {
                    setSlotsSelecao([]);
                    setDialogAberto(false);
                    reset();
                },
                onError: (error) => {
                    const firstError = Object.values(error)[0];
                    toast.error(firstError || 'Ocorreu um erro de validação. Verifique os campos');
                },
            });
        }
    }

    // Função para limpar seleção
    const limparSelecao = () => {
        setSlotsSelecao([]);
    };

    // Verificar se um slot está selecionado
    const isSlotSelecionado = (slot: SlotCalendario) => {
        return slotsSelecao.some((slotSelect) => slotSelect.id === slot.id);
    };

    // Calcular período de recorrência
    const periodoRecorrencia = () => {
        return {
            inicio: format(data.data_inicial ?? hoje, 'dd/MM/yyyy'),
            fim: format(data.data_final ?? addMonths(hoje, 1), 'dd/MM/yyyy'),
        };
    };

    return (
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
                            {modulo?.nome}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {andar?.nome}
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
                                                <span>{gestoresPorTurno.manha.nome}</span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            <p className="font-medium">{gestoresPorTurno.manha.nome}</p>
                                            <p className="text-xs">{gestoresPorTurno.manha.email}</p>
                                            <p className="text-muted-foreground text-xs">{gestoresPorTurno.manha.departamento}</p>
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
                                                <span>{gestoresPorTurno.tarde.nome}</span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            <p className="font-medium">{gestoresPorTurno.tarde.nome}</p>
                                            <p className="text-xs">{gestoresPorTurno.tarde.email}</p>
                                            <p className="text-muted-foreground text-xs">{gestoresPorTurno.tarde.departamento}</p>
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
                                                <span>{gestoresPorTurno.noite.nome}</span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            <p className="font-medium">{gestoresPorTurno.noite.nome}</p>
                                            <p className="text-xs">{gestoresPorTurno.noite.email}</p>
                                            <p className="text-muted-foreground text-xs">{gestoresPorTurno.noite.departamento}</p>
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
                                <div key={dia.valor} className={`border-l p-2 text-center text-sm font-medium ${dia.ehHoje ? 'bg-primary/5' : ''}`}>
                                    <div>{dia.abreviado}</div>
                                    <div className={`text-xs ${dia.ehHoje ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{dia.diaMes}</div>
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
                                        className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.data, hoje) ? 'bg-primary/5' : ''} `}
                                        onClick={() => alternarSelecaoSlot(slot)}
                                    >
                                        {slot.status === 'reservado' ? (
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
                                                        <p>Reservado pelo setor {slot.dadosReserva?.autor}</p>
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
                                        className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.data, hoje) ? 'bg-primary/5' : ''} `}
                                        onClick={() => alternarSelecaoSlot(slot)}
                                    >
                                        {slot.status === 'reservado' ? (
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
                                                        <p>Reservado pelo usuario: {slot.dadosReserva?.autor}</p>
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
                                        className={`relative cursor-pointer border-l p-1 transition-all ${slot.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isSlotSelecionado(slot) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(slot.data, hoje) ? 'bg-primary/5' : ''} `}
                                        onClick={() => alternarSelecaoSlot(slot)}
                                    >
                                        {slot.status === 'reservado' ? (
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
                                                        <p>Reservado pelo usuario: {slot.dadosReserva?.autor}</p>
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
                                {new Set(slotsSelecao.map((slotSelect) => format(slotSelect.data, 'yyyy-MM-dd'))).size} dia
                                {new Set(slotsSelecao.map((slotSelect) => format(slotSelect.data, 'yyyy-MM-dd'))).size > 1 ? 's' : ''}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <form onSubmit={onSubmit}>
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
                                                value={data.titulo}
                                                onChange={(e) => setData((prevData) => ({ ...prevData, titulo: e.target.value }))}
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
                                                value={data.descricao}
                                                onChange={(e) => setData((prevData) => ({ ...prevData, descricao: e.target.value }))}
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
                                            value={recorrencia}
                                            onValueChange={(value: ValorOcorrenciaType) => setRecorrencia(value)}
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
                                    {recorrencia === 'personalizado' && (
                                        <div className="bg-muted/10 space-y-4 rounded-md border p-3">
                                            <h4 className="text-sm font-medium">Selecione o período personalizado</h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="data-inicial" className="text-xs">
                                                        Data de início
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="data-inicial"
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !data.data_final && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {data.data_inicial ? (
                                                                    format(data.data_inicial, 'dd/MM/yyyy')
                                                                ) : (
                                                                    <span>Selecione a data</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={data.data_inicial || undefined}
                                                                onSelect={(date) =>
                                                                    setData((prevData) => ({ ...prevData, data_inicial: date ?? null }))
                                                                }
                                                                initialFocus
                                                                disabled={(date) => date < hoje}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="data-final" className="text-xs">
                                                        Data de término
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="data-final"
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !data.data_final && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {data.data_final ? (
                                                                    format(data.data_final, 'dd/MM/yyyy')
                                                                ) : (
                                                                    <span>Selecione a data</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={data.data_final || undefined}
                                                                onSelect={(date) =>
                                                                    setData((prevData) => ({ ...prevData, data_inicial: date ?? null }))
                                                                }
                                                                initialFocus
                                                                disabled={(date) => (data.data_inicial ? date < data.data.inicial : date < hoje)}
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
                                                        De {periodoRecorrencia().inicio} até {periodoRecorrencia().fim}
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
                                                    (acc, horario) => {
                                                        const diaKey = format(horario.data, 'yyyy-MM-dd');
                                                        if (!acc[diaKey]) {
                                                            acc[diaKey] = {
                                                                data: horario.data,
                                                                slots: [],
                                                            };
                                                        }
                                                        acc[diaKey].slots.push(horario);
                                                        return acc;
                                                    },
                                                    {} as Record<string, { data: Date; slots: SlotCalendario[] }>,
                                                ),
                                            ).map(([diaKey, { data, slots }]) => (
                                                <div key={diaKey} className="mb-4 last:mb-0">
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
                                    <Button variant="outline" onClick={() => setDialogAberto(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={!data.titulo.trim()}>
                                        Confirmar Reserva
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" onClick={limparSelecao}>
                        Limpar seleção
                    </Button>
                </div>
            )}
        </div>
    );
}
