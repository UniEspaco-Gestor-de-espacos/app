import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Bell, CheckCircle, Clock, History, Home, Plus, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '🏠 Painel Inicial',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // Props com valores padrão para robustez
    const { props } = usePage<{
        user?: User;
        pendingRequests?: number
        espacos?: Array<{ id: string | number; nome: string; status: string }>;
        indisponibilidades?: Array<{ id: string | number; espaco_nome: string; data_inicio: string; data_fim: string; motivo: string }>;
        decisoes?: Array<{
            id: string | number;
            horarios: Array<{ horario_inicio: string; horario_fim: string; agenda?: { espaco?: { nome: string } } }>;
            user?: { name: string };
            data_inicial: string;
            situacao: string;
        }>;
    }>();
    const pendingRequests: number = props.pendingRequests ?? 0;
    const espacos: Array<{ id: string | number; nome: string; status: string }> = props.espacos ?? [];
    const indisponibilidades: Array<{ id: string | number; espaco_nome: string; data_inicio: string; data_fim: string; motivo: string }> =
        props.indisponibilidades ?? [];
    const decisoes: Array<{
        id: string | number;
        horarios: Array<{ horario_inicio: string; horario_fim: string; agenda?: { espaco?: { nome: string } } }>;
        user?: { name: string };
        data_inicial: string;
        situacao: string;
    }> = props.decisoes ?? [];

    function getStatusBadge(status: string) {
        if (status === 'available') return 'bg-green-500 hover:bg-green-600';
        if (status === 'reserved') return 'bg-amber-500 hover:bg-amber-600';
        return 'bg-red-500 hover:bg-red-600';
    }
    function formatarData(data: string | Date | undefined) {
        if (!data) return '-';
        if (typeof data === 'string') {
            const d = new Date(data);
            if (!isNaN(d.getTime())) return d.toLocaleDateString();
            return data;
        }
        if (data instanceof Date) return data.toLocaleDateString();
        return '-';
    }
    function formatarHorario(horarios: Array<{ horario_inicio: string; horario_fim: string }>) {
        if (horarios && horarios[0]) {
            return `${horarios[0].horario_inicio} - ${horarios[0].horario_fim}`;
        }
        return '-';
    }
    // Navegação dos botões
    function handleVerSolicitacoes() {
        router.visit('/espacos/index');
    }
    function handleGerenciarEspacos() {
        router.visit('/gestor/espacos');
    }
    function handleVerIndisponibilidades() {
        router.visit('/gestor/indisponibilidades');
    }
    function handleNovaIndisponibilidade() {
        router.visit('/gestor/indisponibilidades/nova');
    }
    function handleVerHistorico() {
        router.visit('/gestor/decisoes/historico');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                            <Bell className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold md:text-2xl">{pendingRequests} solicitações</div>
                            <p className="text-muted-foreground text-xs">Aguardando sua análise</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleVerSolicitacoes}>
                                Ver Solicitações
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Espaços que Gerencio</CardTitle>
                            <Home className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                                {espacos.length === 0 && (
                                    <div className="text-muted-foreground col-span-2 text-center">Nenhum espaço encontrado.</div>
                                )}
                                {espacos.map((space) => (
                                    <div key={space.id} className="flex items-center justify-between rounded-lg border p-2">
                                        <div className="mr-2 truncate font-medium">{space.nome}</div>
                                        <Badge className={getStatusBadge(space.status)}>
                                            {space.status === 'available' ? 'Livre' : space.status === 'reserved' ? 'Reservado' : 'Indisponível'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full" onClick={handleGerenciarEspacos}>
                                Gerenciar Espaços
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Indisponibilidades Agendadas</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {indisponibilidades.length === 0 && (
                                    <div className="text-muted-foreground text-center">Nenhuma indisponibilidade agendada.</div>
                                )}
                                {indisponibilidades.map((ind) => (
                                    <div key={ind.id} className="rounded-lg border p-2">
                                        <div className="truncate font-medium">{ind.espaco_nome}</div>
                                        <div className="text-muted-foreground text-xs">
                                            {formatarData(ind.data_inicio)} até {formatarData(ind.data_fim)}
                                        </div>
                                        <div className="text-xs">{ind.motivo}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={handleVerIndisponibilidades}>
                                Ver Todas
                            </Button>
                            <Button size="sm" onClick={handleNovaIndisponibilidade}>
                                <Plus className="mr-1 h-4 w-4" /> Nova
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Histórico de Decisões</CardTitle>
                            <History className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent className="overflow-auto">
                            <div className="w-full overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Espaço</TableHead>
                                            <TableHead className="hidden sm:table-cell">Solicitante</TableHead>
                                            <TableHead className="hidden md:table-cell">Data</TableHead>
                                            <TableHead className="hidden lg:table-cell">Horário</TableHead>
                                            <TableHead>Decisão</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {decisoes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-muted-foreground text-center">
                                                    Nenhuma decisão encontrada.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {decisoes.map((decision) => (
                                            <TableRow key={decision.id}>
                                                <TableCell className="font-medium">
                                                    {(decision.horarios && decision.horarios[0]?.agenda?.espaco?.nome) ?? '-'}
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{decision.user?.name ?? '-'}</TableCell>
                                                <TableCell className="hidden md:table-cell">{formatarData(decision.data_inicial)}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{formatarHorario(decision.horarios)}</TableCell>
                                                <TableCell>
                                                    {decision.situacao === 'deferida' ? (
                                                        <div className="flex items-center">
                                                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                                            <span className="text-green-500">Aprovada</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <XCircle className="mr-1 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Recusada</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full" onClick={handleVerHistorico}>
                                Ver histórico completo
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
