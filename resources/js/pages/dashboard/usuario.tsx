import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { DashboardStatusReservasType, Espaco, Reserva, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CalendarClock, Clock, History, Plus } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '🏠 Painel Inicial',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { props } = usePage<{
        user: User;
        statusDasReservas: DashboardStatusReservasType;
        proximaReserva: Reserva | null;
        reservas: Reserva[];
        espacoDaProximaReserva: Espaco | null;
    }>();
    const { statusDasReservas, proximaReserva, reservas, espacoDaProximaReserva } = props;

    // Função utilitária para pegar nome do espaço de uma reserva
    function getEspacoNome(reserva: Reserva) {
        // Se já vier populado do backend, use direto
        if (reserva.horarios && reserva.horarios.length > 0 && reserva.horarios[0].agenda && reserva.horarios[0].agenda.espaco) {
            return reserva.horarios[0].agenda.espaco.nome;
        }
        return '-';
    }
    // Função para pegar horário formatado
    function getHorario(reserva: Reserva) {
        if (reserva.horarios && reserva.horarios.length > 0) {
            const h = reserva.horarios[0];
            return `${h.horario_inicio} - ${h.horario_fim}`;
        }
        return '-';
    }
    // Função para pegar status
    function getStatus(reserva: Reserva) {
        if (reserva.situacao === 'deferida') return 'approved';
        if (reserva.situacao === 'em_analise') return 'pending';
        if (reserva.situacao === 'indeferida') return 'rejected';
        return reserva.situacao;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {proximaReserva != null ? (
                        <Card className="col-span-1 sm:col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Próxima Reserva</CardTitle>
                                <CalendarClock className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="truncate text-xl font-bold md:text-2xl">
                                    {espacoDaProximaReserva?.nome ?? getEspacoNome(proximaReserva)}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    {typeof proximaReserva.data_inicial === 'string'
                                        ? proximaReserva.data_inicial
                                        : proximaReserva.data_inicial?.toLocaleDateString()}{' '}
                                    • {getHorario(proximaReserva)}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" className="w-full">
                                    Ver detalhes
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="col-span-1 sm:col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sem reservas proximas</CardTitle>
                                <CalendarClock className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent></CardContent>
                            <CardFooter></CardFooter>
                        </Card>
                    )}

                    <Card className="col-span-1 sm:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status das Minhas Reservas</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <div className="text-center">
                                    <div className="text-xl font-bold md:text-2xl">{statusDasReservas.em_analise}</div>
                                    <p className="text-muted-foreground text-xs">Aguardando</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold md:text-2xl">{statusDasReservas.deferida}</div>
                                    <p className="text-muted-foreground text-xs">Aprovadas</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold md:text-2xl">{statusDasReservas.indeferida}</div>
                                    <p className="text-muted-foreground text-xs">Recusadas</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                Ver todas
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solicitar Nova Reserva</CardTitle>
                            <Plus className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Crie uma nova solicitação de reserva para salas, laboratórios ou auditórios.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Nova Reserva</Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Histórico de Reservas</CardTitle>
                            <History className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent className="overflow-auto">
                            <div className="w-full overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Espaço</TableHead>
                                            <TableHead className="hidden sm:table-cell">Data</TableHead>
                                            <TableHead className="hidden md:table-cell">Horário</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservas.map((reserva) => (
                                            <TableRow key={reserva.id}>
                                                <TableCell className="font-medium">{getEspacoNome(reserva)}</TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    {typeof reserva.data_inicial === 'string'
                                                        ? reserva.data_inicial
                                                        : reserva.data_inicial?.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{getHorario(reserva)}</TableCell>
                                                <TableCell>
                                                    {getStatus(reserva) === 'approved' && (
                                                        <Badge className="bg-green-500 hover:bg-green-600">Aprovada</Badge>
                                                    )}
                                                    {getStatus(reserva) === 'pending' && (
                                                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                                                            Pendente
                                                        </Badge>
                                                    )}
                                                    {getStatus(reserva) === 'rejected' && <Badge variant="destructive">Recusada</Badge>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                Ver histórico completo
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
