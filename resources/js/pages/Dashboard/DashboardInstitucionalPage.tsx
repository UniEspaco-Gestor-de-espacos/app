import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, PieChart, Search, Settings, Users } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '🏠 Painel Inicial',
        href: '/dashboard',
    },
];

// Dados de exemplo
const userStats = {
    total: 245,
    professors: 180,
    staff: 45,
    admins: 20,
};

const spaceStats = {
    total: 85,
    available: 62,
    reserved: 18,
    unavailable: 5,
};

const reservationStats = {
    total: 1250,
    thisMonth: 320,
    pending: 45,
    approved: 1150,
    rejected: 55,
};
export default function Dashboard() {
    // const { props } = usePage<{ user: User}>();
    // const { user } = props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuários e Permissões</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Total de Usuários</p>
                                    <p className="text-xl font-bold md:text-2xl">{userStats.total}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Professores</p>
                                    <p className="text-xl font-bold md:text-2xl">{userStats.professors}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Funcionários</p>
                                    <p className="text-xl font-bold md:text-2xl">{userStats.staff}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Administradores</p>
                                    <p className="text-xl font-bold md:text-2xl">{userStats.admins}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-between gap-2">
                            <Button variant="outline" size="sm">
                                Gerenciar Professores
                            </Button>
                            <Button variant="outline" size="sm">
                                Gerenciar Setores
                            </Button>
                            <Button size="sm">Adicionar Usuário</Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Espaços e Gestores</CardTitle>
                            <Settings className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Total de Espaços</p>
                                    <p className="text-xl font-bold md:text-2xl">{spaceStats.total}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Disponíveis</p>
                                    <p className="text-xl font-bold text-green-500 md:text-2xl">{spaceStats.available}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Reservados</p>
                                    <p className="text-xl font-bold text-amber-500 md:text-2xl">{spaceStats.reserved}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Indisponíveis</p>
                                    <p className="text-xl font-bold text-red-500 md:text-2xl">{spaceStats.unavailable}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-between gap-2">
                            <Button variant="outline" size="sm">
                                Gerenciar Espaços
                            </Button>
                            <Button variant="outline" size="sm">
                                Gerenciar Gestores
                            </Button>
                            <Button size="sm">Adicionar Espaço</Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Relatórios / Visões Gerais</CardTitle>
                            <PieChart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview">
                                <TabsList className="mb-4 flex flex-wrap">
                                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                                    <TabsTrigger value="spaces">Por Espaço</TabsTrigger>
                                    <TabsTrigger value="departments">Por Setor</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Total de Reservas</p>
                                            <p className="text-xl font-bold md:text-2xl">{reservationStats.total}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Este Mês</p>
                                            <p className="text-xl font-bold md:text-2xl">{reservationStats.thisMonth}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Pendentes</p>
                                            <p className="text-xl font-bold md:text-2xl">{reservationStats.pending}</p>
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 h-[200px] rounded-md border p-4">
                                        <div className="bg-muted/50 flex h-full w-full items-center justify-center rounded-md">
                                            Gráfico de Reservas por Período
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="spaces">
                                    <div className="bg-muted/50 h-[250px] rounded-md border p-4">
                                        <div className="bg-muted/50 flex h-full w-full items-center justify-center rounded-md">
                                            Gráfico de Reservas por Espaço
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="departments">
                                    <div className="bg-muted/50 h-[250px] rounded-md border p-4">
                                        <div className="bg-muted/50 flex h-full w-full items-center justify-center rounded-md">
                                            Gráfico de Reservas por Setor
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                <FileText className="mr-2 h-4 w-4" /> Exportar Relatórios
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Filtros Avançados e Consultas</CardTitle>
                            <Search className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Período</label>
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                        <Input type="date" className="w-full" placeholder="Data inicial" />
                                        <Input type="date" className="w-full" placeholder="Data final" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Filtros</label>
                                    <div className="flex space-x-2">
                                        <Input className="w-full" placeholder="Espaço ou Setor" />
                                        <Button variant="secondary" size="icon">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted/50 rounded-md border p-4">
                                <div className="bg-muted/50 flex h-[150px] w-full items-center justify-center rounded-md">Resultados da Consulta</div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-between gap-2">
                            <Button variant="outline" size="sm">
                                Limpar Filtros
                            </Button>
                            <Button size="sm">
                                <FileText className="mr-2 h-4 w-4" /> Exportar Dados
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
