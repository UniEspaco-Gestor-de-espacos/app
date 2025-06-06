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
import { Andar, Auth, BreadcrumbItem, Espaco, GestoresEspaco, Horario, Modulo, ReservasTurno } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { addDays, addMonths, addWeeks, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, FileText, Info, MapPin, Repeat, Type, User, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
type ReservaFormData = {
    titulo: string;
    descricao: string;
    recorrencia: string;
    data_inicial: Date;
    data_final: Date;
    user_id: number;
    horarios_solicitados: Horario[];
};

// Tipos para recorrência
type OpcaoRecorrencia = {
    valor: string;
    label: string;
    descricao: string;
    calcularDataFinal: (dataInicial: Date) => Date;
};

export default function AgendaEspaço() {
    const { props } = usePage<{
        espaco: Espaco;
        modulo: Modulo;
        andar: Andar;
        gestores_espaco: GestoresEspaco;
        horarios_reservados: ReservasTurno;
        auth: Auth;
    }>();
    const { espaco, modulo, andar, gestores_espaco, horarios_reservados, auth } = props;
    const hoje = new Date();
    const user = auth.user;
    const [semanaAtual, setSemanaAtual] = useState(startOfWeek(hoje, { weekStartsOn: 1 }));
    const [horariosSelecao, setHorariosSelecao] = useState<Horario[]>([]);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [todosHorarios, setTodosHorarios] = useState<Horario[]>([]);

    // Inicializar o formulário com o hook useForm do Inertia
    const { data, setData, post, processing, errors, reset } = useForm<ReservaFormData>({
        titulo: '',
        descricao: '',
        recorrencia: 'unica',
        data_inicial: hoje,
        data_final: addMonths(hoje, 1),
        user_id: user.id,
        horarios_solicitados: [],
    });
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
    // Função para identificar o turno com base na hora
    const identificarTurno = (hora: number): 'manha' | 'tarde' | 'noite' => {
        if (hora >= 7 && hora <= 12) return 'manha';
        if (hora >= 13 && hora <= 18) return 'tarde';
        return 'noite'; // 19-22
    };

    // Função para gerar slots de horário para a semana
    const gerarSlotsParaSemana = (semanaInicio: Date) => {
        const horarios: Horario[] = [];
        const horaInicio = 7;
        const horaFim = 22;
        // Gerar para cada dia da semana (segunda a sábado)
        for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
            // Gerar para cada hora do dia
            for (let hora = horaInicio; hora < horaFim; hora++) {
                const inicio = `${hora.toString().padStart(2, '0')}:00:00`;
                const fim = `${hora.toString().padStart(2, '0')}:50:00`;

                const agenda = gestores_espaco[identificarTurno(hora)].agenda_id;

                const temp_horario_reservado = horarios_reservados[identificarTurno(hora)].find(({ horario }) => {
                    const dia = new Date(horario.data);
                    return horario.horario_inicio == inicio && dia.getDay() == diaSemana;
                });

                if (temp_horario_reservado) {
                    horarios.push({
                        ...temp_horario_reservado.horario,
                        id: `${format(addDays(semanaInicio, diaSemana), 'yyyy-MM-dd')}-${inicio}`,
                        status: 'reservado',
                        autor: temp_horario_reservado.autor,
                    });
                } else {
                    horarios.push({
                        id: `${format(addDays(semanaInicio, diaSemana), 'yyyy-MM-dd')}-${inicio}`,
                        agenda_id: agenda,
                        horario_inicio: inicio,
                        horario_fim: fim,
                        data: addDays(semanaInicio, diaSemana),
                        status: 'livre',
                        autor: '',
                    });
                }
            }
        }
        return horarios;
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
        setTodosHorarios(gerarSlotsParaSemana(semanaAtual));
    }, [semanaAtual]);

    // Adicionar horario solicitado ao form
    useEffect(() => {
        setData('horarios_solicitados', horariosSelecao);
    }, [horariosSelecao]);
    // Agrupar slots por hora para facilitar a renderização da tabela
    const horariosPorHora = useMemo(() => {
        const resultado: Record<string, Horario[]> = {};

        for (let hora = 7; hora < 22; hora++) {
            const horaFormatada = `${hora.toString().padStart(2, '0')}:00`;
            resultado[horaFormatada] = todosHorarios.filter((horario) => horario.horario_inicio == `${horaFormatada}:00`);
        }

        return resultado;
    }, [todosHorarios]);

    // Agrupar slots por turno para facilitar a renderização
    const horariosPorTurno = useMemo(() => {
        const resultado = {
            manha: {} as Record<string, Horario[]>,
            tarde: {} as Record<string, Horario[]>,
            noite: {} as Record<string, Horario[]>,
        };

        Object.entries(horariosPorHora).forEach(([hora, horario]) => {
            const horaNum = Number.parseInt(hora.split(':')[0], 10);
            const turno = identificarTurno(horaNum);
            resultado[turno][hora] = horario;
        });

        return resultado;
    }, [horariosPorHora]);

    // Funções para navegar entre semanas
    const irParaSemanaAnterior = () => {
        setSemanaAtual(subWeeks(semanaAtual, 1));
        // Limpar seleção ao mudar de semana
        setHorariosSelecao([]);
    };

    const irParaProximaSemana = () => {
        setSemanaAtual(addWeeks(semanaAtual, 1));
        // Limpar seleção ao mudar de semana
        setHorariosSelecao([]);
    };

    // Função para alternar seleção de slot
    const alternarSelecaoHorario = (horario: Horario) => {
        if (horario.status !== 'livre') return;

        const jaExiste = horariosSelecao.some((h) => h.id === horario.id);

        if (jaExiste) {
            setHorariosSelecao(horariosSelecao.filter((h) => h.id !== horario.id));
        } else {
            // Adicionar o slot à seleção sem restrição de dia
            // Ordenar slots por dia e hora
            const novaSelecao = [...horariosSelecao, horario].sort(
                (a, b) =>
                    a.data.getTime() - b.data.getTime() || // Compara dias primeiro
                    a.horario_inicio.localeCompare(b.horario_inicio), // Se dias iguais, compara horaInicio como string "HH:MM:SS"
            );

            setHorariosSelecao(novaSelecao);
        }
    };

    // Função para enviar o formulário
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Obter a opção de recorrência selecionada
        const opcaoRecorrencia = opcoesRecorrencia.find((opcao) => opcao.valor === data.recorrencia);
        if (!opcaoRecorrencia) return;

        // Calcular a data final com base na recorrência
        const dataInicial = new Date(Math.min(...horariosSelecao.map((h) => h.data.getTime())));

        if (data.recorrencia !== 'personalizado') {
            setData('data_final', opcaoRecorrencia.calcularDataFinal(dataInicial));
        }

        post(route('reservas.store'), {
            onSuccess: () => {
                setHorariosSelecao([]);
                setDialogAberto(false);
                reset();
            },
        });
    }

    // Função para limpar seleção
    const limparSelecao = () => {
        setHorariosSelecao([]);
    };

    // Verificar se um slot está selecionado
    const isHorarioSelecionado = (horario: Horario) => {
        return horariosSelecao.some((h) => h.id === horario.id);
    };

    // Calcular período de recorrência
    const calcularPeriodoRecorrencia = () => {
        if (horariosSelecao.length === 0) return null;

        const dataInicial = new Date(Math.min(...horariosSelecao.map((h) => h.data.getTime())));
        let dataFinal: Date;

        if (data.recorrencia === 'personalizado' && data.data_final) {
            dataFinal = data.data_final;
        } else {
            const opcaoRecorrencia = opcoesRecorrencia.find((opcao) => opcao.valor === data.recorrencia);
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
                            {Object.entries(horariosPorTurno.manha).map(([hora, horarios]) => (
                                <div key={hora} className="bg-accent/5 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {horarios.map((horario) => (
                                        <div
                                            key={horario.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${horario.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isHorarioSelecionado(horario) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(horario.data, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoHorario(horario)}
                                        >
                                            {horario.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {horario.autor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo setor {horario.autor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isHorarioSelecionado(horario) && (
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
                            {Object.entries(horariosPorTurno.tarde).map(([hora, horarios]) => (
                                <div key={hora} className="bg-secondary/5 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {horarios.map((horario) => (
                                        <div
                                            key={horario.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${horario.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isHorarioSelecionado(horario) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(horario.data, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoHorario(horario)}
                                        >
                                            {horario.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {horario.autor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo usuario: {horario.autor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isHorarioSelecionado(horario) && (
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
                            {Object.entries(horariosPorTurno.noite).map(([hora, horarios]) => (
                                <div key={hora} className="bg-muted/10 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                                    {/* Coluna de horário */}
                                    <div className="text-muted-foreground border-r p-2 pr-3 text-right text-xs">
                                        {hora} - {hora.split(':')[0]}:50
                                    </div>

                                    {/* Células para cada dia */}
                                    {horarios.map((horario) => (
                                        <div
                                            key={horario.id}
                                            className={`relative cursor-pointer border-l p-1 transition-all ${horario.status === 'reservado' ? 'bg-muted/30' : 'hover:bg-muted/10'} ${isHorarioSelecionado(horario) ? 'bg-primary/20 hover:bg-primary/30 ring-primary ring-2 ring-inset' : ''} ${isSameDay(horario.data, hoje) ? 'bg-primary/5' : ''} `}
                                            onClick={() => alternarSelecaoHorario(horario)}
                                        >
                                            {horario.status === 'reservado' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {horario.autor}
                                                                </Badge>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Reservado pelo usuario: {horario.autor}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                isHorarioSelecionado(horario) && (
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
                {horariosSelecao.length > 0 && (
                    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-2">
                        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg">
                                    Reservar {horariosSelecao.length} horário{horariosSelecao.length > 1 ? 's' : ''} em{' '}
                                    {new Set(horariosSelecao.map((h) => format(h.data, 'yyyy-MM-dd'))).size} dia
                                    {new Set(horariosSelecao.map((h) => format(h.data, 'yyyy-MM-dd'))).size > 1 ? 's' : ''}
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
                                                    onChange={(e) => setData('titulo', e.target.value)}
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
                                                    onChange={(e) => setData('descricao', e.target.value)}
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
                                                value={data.recorrencia}
                                                onValueChange={(value) => setData('recorrencia', value)}
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
                                        {data.recorrencia === 'personalizado' && (
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
                                                                    selected={data.data_inicial}
                                                                    onSelect={(date) => setData('data_inicial', date!)}
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
                                                                    selected={data.data_final}
                                                                    onSelect={(date) => setData('data_final', date!)}
                                                                    initialFocus
                                                                    disabled={(date) => (data.data_inicial ? date < data.data_inicial : date < hoje)}
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
                                                    horariosSelecao.reduce(
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
                                                        {} as Record<string, { data: Date; slots: Horario[] }>,
                                                    ),
                                                ).map(([diaKey, { data, slots }]) => (
                                                    <div key={diaKey} className="mb-4 last:mb-0">
                                                        <div className="mb-1 text-sm font-medium">
                                                            {format(data, 'EEEE, dd/MM', { locale: ptBR })}
                                                        </div>

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
        </AppLayout>
    );
}
