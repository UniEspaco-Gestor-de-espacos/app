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
            meta: object; // Contém 'from', 'to', 'total', etc.
        };
        unidades: Unidade[];
        modulos: Modulo[];
        andares: Andar[];
        filters: {
            // Recebe os filtros atuais do controller
            search?: string;
            unidade?: string;
            modulo?: string;
            andar?: string;
            capacidade?: string;
        };
        user: User;
    }>();
    const { andares, modulos, unidades, user } = props;
    const userType = user.permission_type_id; // 1 - INSTITUCIONAL, 2 - GESTOR, 3 - COMUM
    // Extrai os dados do paginador
    const { data: espacos, links } = props.espacos;
    const { filters } = props;
    // Gerencia de estado
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUnidade, setSelectedUnidade] = useState(filters.unidade || 'all');
    const [selectedModulo, setSelectedModulo] = useState(filters.modulo || 'all');
    const [selectedAndar, setSelectedAndar] = useState(filters.andar || 'all');
    const [selectedCapacidade, setSelectedCapacidade] = useState(filters.capacidade || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    // Hook que reserta caso modulo ou andar mude
    useEffect(() => {
        setSelectedModulo('all');
        setSelectedAndar('all');
    }, [selectedUnidade]);

    // Reseta o andar quando o módulo muda
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
            preserveState: true, // Mantém o estado dos filtros na página
            preserveScroll: true, // Não rola a página para o topo
            replace: true, // Não adiciona ao histórico do navegador
        });
    }, [debouncedSearchTerm, selectedUnidade, selectedModulo, selectedAndar, selectedCapacidade]);

    // Função para solicitar reserva
    const handleSolicitarReserva = (espacoId: string) => {
        router.visit(`/espacos/${espacoId}`);
    };

    // Função para editar espaço
    const handleEditarEspaco = (espacoId: string) => {
        router.visit(`/espacos/editar/${espacoId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espacos" />
            {/* Todo o conteúdo a partir dos filtros até o final em uma única div */}
            <div className="m-8">
                {/* Filtros e Busca */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Busca */}
                            <div className="relative sm:col-span-2 lg:col-span-5">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por nome do espaço, andar ou módulo..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filtro de Unidade */}
                            <Select value={selectedUnidade} onValueChange={setSelectedUnidade}>
                                <SelectTrigger>
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
                                <SelectTrigger>
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
                                <SelectTrigger>
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
                                <SelectTrigger>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {espacos.map((espaco) => (
                        <Card key={espaco.id} className="overflow-hidden">
                            <CardHeader className="p-0">
                                <img
                                    src={espaco.main_image_index ? `/storage/${espaco.main_image_index}` : espacoImage}
                                    alt={espaco.nome}
                                    className="object-absolute h-40 w-full"
                                />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-2 flex items-start justify-between">
                                    <CardTitle className="text-xl">Espaço: {espaco.nome}</CardTitle>
                                </div>

                                <div className="espaco-y-2 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="text-muted-foreground h-4 w-4" />
                                        <span>Capacidade: {espaco.capacidade_pessoas} pessoas</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Home className="text-muted-foreground h-4 w-4" />
                                        <span>
                                            {espaco.andar?.nome} - {espaco.andar?.modulo?.nome} - {espaco.andar?.modulo?.unidade?.nome}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-muted-foreground">Gestores por turno:</span>
                                        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
                                            {espaco.agendas?.map((agenda) => (
                                                <div key={agenda.id} className="flex flex-col items-center text-center">
                                                    <span className="text-muted-foreground text-sm font-semibold">{getTurnoText(agenda.turno)}</span>
                                                    <span className="mt-1 text-sm">{getPrimeirosDoisNomes(agenda.user?.name)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-wrap gap-2 pt-0">
                                <Button size="sm" onClick={() => handleSolicitarReserva(espaco.id.toString())}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Ver agenda
                                </Button>

                                {userType === 1 && (
                                    <Button variant="secondary" size="sm" onClick={() => handleEditarEspaco(espaco.id.toString())}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Espaço
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            {/* Componente de Paginação */}
            <div className="mt-6 flex justify-center">
                <div className="flex gap-1">
                    {links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`rounded-md border px-4 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={index}
                                className="text-muted-foreground rounded-md border px-4 py-2 text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
