import espacoImage from '@/assets/espaco.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { getPrimeirosDoisNomes, getTurnoText, useDebounce } from '@/lib/utils';
import { Andar, Espaco, Modulo, Unidade, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Home, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Consultar Espaços',
        href: '/espacos',
    },
];

export default function EspacosPage() {
    const { props } = usePage<{
        espacos: {
            data: Espaco[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object;
        };
        unidades: Unidade[];
        modulos: Modulo[];
        andares: Andar[];
        filters: {
            search?: string;
            unidade?: string;
            modulo?: string;
            andar?: string;
            capacidade?: string;
        };
        user: User;
    }>();
    const { andares, modulos, unidades, user } = props;
    const userType = user.permission_type_id;
    const { data: espacos, links } = props.espacos;
    const { filters } = props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUnidade, setSelectedUnidade] = useState(filters.unidade || 'all');
    const [selectedModulo, setSelectedModulo] = useState(filters.modulo || 'all');
    const [selectedAndar, setSelectedAndar] = useState(filters.andar || 'all');
    const [selectedCapacidade, setSelectedCapacidade] = useState(filters.capacidade || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    useEffect(() => {
        setSelectedModulo('all');
        setSelectedAndar('all');
    }, [selectedUnidade]);

    useEffect(() => {
        setSelectedAndar('all');
    }, [selectedModulo]);

    useEffect(() => {
        const params = {
            search: debouncedSearchTerm || undefined,
            unidade: selectedUnidade === 'all' ? undefined : selectedUnidade,
            modulo: selectedModulo === 'all' ? undefined : selectedModulo,
            andar: selectedAndar === 'all' ? undefined : selectedAndar,
            capacidade: selectedCapacidade === 'qualquer' ? undefined : selectedCapacidade,
        };

        router.get(route('espacos.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedSearchTerm, selectedUnidade, selectedModulo, selectedAndar, selectedCapacidade]);

    const handleSolicitarReserva = (espacoId: string) => {
        router.visit(`/espacos/${espacoId}`);
    };

    const handleEditarEspaco = (espacoId: string) => {
        router.visit(`/espacos/editar/${espacoId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espaços" />
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Filtros e Busca */}
                <Card className="border-primary/10 mb-8 border-2 shadow-lg">
                    <CardContent className="pt-8 pb-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Busca */}
                            <div className="relative sm:col-span-2 lg:col-span-5">
                                <Search className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                                <Input
                                    placeholder="Buscar por nome do espaço, andar ou módulo..."
                                    className="border-primary/30 focus:border-primary focus:ring-primary/20 rounded-lg py-3 pl-10 transition focus:ring-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filtro de Unidade */}
                            <Select value={selectedUnidade} onValueChange={setSelectedUnidade}>
                                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20 rounded-lg transition focus:ring-2">
                                    <SelectValue placeholder="Unidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Unidades</SelectItem>
                                    {unidades.map((unidade) => (
                                        <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                            {unidade.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filtro de Módulo */}
                            <Select value={selectedModulo} onValueChange={setSelectedModulo} disabled={selectedUnidade === 'all'}>
                                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20 rounded-lg transition focus:ring-2">
                                    <SelectValue placeholder="Módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Módulos</SelectItem>
                                    {modulos.map((modulo) => (
                                        <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                            {modulo.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filtro de Andar */}
                            <Select value={selectedAndar} onValueChange={setSelectedAndar} disabled={selectedModulo === 'all'}>
                                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20 rounded-lg transition focus:ring-2">
                                    <SelectValue placeholder="Andar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Andares</SelectItem>
                                    {andares.map((andar) => (
                                        <SelectItem key={andar.id} value={andar.id.toString()}>
                                            {andar.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filtro de Capacidade */}
                            <Select value={selectedCapacidade} onValueChange={setSelectedCapacidade}>
                                <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20 rounded-lg transition focus:ring-2">
                                    <SelectValue placeholder="Capacidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="qualquer">Qualquer</SelectItem>
                                    <SelectItem value="pequeno">Pequeno (até 30)</SelectItem>
                                    <SelectItem value="medio">Médio (31-100)</SelectItem>
                                    <SelectItem value="grande">Grande (+100)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {espacos.map((espaco) => (
                        <Card
                            key={espaco.id}
                            className="border-primary/10 group overflow-hidden border-2 shadow-lg transition-shadow duration-200 hover:shadow-2xl"
                        >
                            <CardHeader className="relative p-0">
                                <img
                                    src={espaco.main_image_index ? `/storage/${espaco.main_image_index}` : espacoImage}
                                    alt={espaco.nome}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="bg-primary text-primary-foreground absolute top-2 right-2 rounded-full px-3 py-1 text-xs shadow">
                                    {espaco.andar?.modulo?.unidade?.nome}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4">
                                <CardTitle className="text-primary mb-2 text-xl font-bold">Espaço: {espaco.nome}</CardTitle>
                                <div className="space-y-2">
                                    <div className="text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            Capacidade: <span className="text-foreground font-semibold">{espaco.capacidade_pessoas}</span> pessoas
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2">
                                        <Home className="h-4 w-4" />
                                        <span>
                                            {espaco.andar?.nome} - {espaco.andar?.modulo?.nome}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-sm">Gestores por turno:</span>
                                        <div className="border-primary/10 bg-muted/40 mt-2 grid grid-cols-3 gap-4 rounded-lg border p-4">
                                            {espaco.agendas?.length ? (
                                                espaco.agendas.map((agenda) => (
                                                    <div key={agenda.id} className="flex flex-col items-center text-center">
                                                        <span className="text-primary text-xs font-semibold">{getTurnoText(agenda.turno)}</span>
                                                        <span className="text-foreground mt-1 text-sm">
                                                            {getPrimeirosDoisNomes(agenda.user?.name)}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground col-span-3 text-center italic">Nenhum gestor</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-primary/10 bg-muted/30 flex flex-wrap gap-2 border-t pt-0">
                                <Button size="sm" className="flex-1 rounded-full" onClick={() => handleSolicitarReserva(espaco.id.toString())}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Ver agenda
                                </Button>
                                {userType === 1 && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 rounded-full"
                                        onClick={() => handleEditarEspaco(espaco.id.toString())}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Espaço
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <div className="flex gap-1">
                        {links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-accent border-primary/10'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="text-muted-foreground rounded-full border px-4 py-2 text-sm"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
