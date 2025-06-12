'use client';

import espacoImage from '@/assets/espaco.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { useDebounce } from '@/lib/utils';
import { Andar, Espaco, Modulo, Unidade, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Home, Info, Projector, Search, Users, ShipWheelIcon as Wheelchair, Wifi, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
const breadcrumbs = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
];

export default function EspacosPage() {
    const { props } = usePage<{
        // A prop `espacos` agora é um objeto paginador do Laravel
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

    console.log(andares);
    // Gerencia de estado
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUnidade, setSelectedUnidade] = useState(filters.unidade || 'all');
    const [selectedModulo, setSelectedModulo] = useState(filters.modulo || 'all');
    const [selectedAndar, setSelectedAndar] = useState(filters.andar || 'all');
    const [selectedCapacidade, setSelectedCapacidade] = useState(filters.capacidade || '');
    const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
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

    // Função para renderizar ícones de recursos
    const resourceIcon = {
        projetor: <Projector className="h-4 w-4" />,
        climatizacao: <Wind className="h-4 w-4" />,
        wifi: <Wifi className="h-4 w-4" />,
        acessibilidade: <Wheelchair className="h-4 w-4" />,
    };

    // Função para mostrar detalhes do espaço
    const handleShowDetails = (espaco: Espaco) => {
        setSelectedEspaco(espaco);
        setShowDetailsDialog(true);
    };

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

                {/* Alternador de visualização */}
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
                                    <Badge variant={espaco ? 'default' : 'destructive'}>{espaco ? 'Disponível' : 'Indisponível'}</Badge>
                                </div>

                                <div className="espaco-y-2 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="text-muted-foreground h-4 w-4" />
                                        <span>Capacidade: {espaco.capacidade_pessoas} pessoas</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Home className="text-muted-foreground h-4 w-4" />
                                        <span>
                                            {modulos.find((modulo) => modulo.id == espaco.andar_id)?.nome} / {espaco.nome}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Setor:</span>
                                        <span>{}</span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            {resourceIcon['climatizacao']}
                                            <span className="sr-only">Ar</span>
                                        </Badge>
                                        {/*espaco.recursos.map((resource) => (
                                                    <Badge key={resource} variant="outline" className="flex items-center gap-1">
                                                        {renderResourceIcon(resource)}
                                                        <span className="sr-only">{resource}</span>
                                                    </Badge>
                                                ))*/}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-wrap gap-2 pt-0">
                                <Button variant="outline" size="sm" onClick={() => handleShowDetails(espaco)}>
                                    <Info className="mr-2 h-4 w-4" />
                                    Ver Detalhes
                                </Button>

                                {userType === 3 && espaco && (
                                    <Button size="sm" onClick={() => handleSolicitarReserva(espaco.id.toString())}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Solicitar Reserva
                                    </Button>
                                )}

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

                {/* Modal de Detalhes */}
                {selectedEspaco && (
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedEspaco.nome} - {modulos.find((modulo) => modulo.id == selectedEspaco.andar_id)?.nome}
                                </DialogTitle>
                                <DialogDescription>Detalhes completos do espaço</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <img src={espacoImage} alt={selectedEspaco.nome} className="h-36 w-full rounded-md object-cover sm:h-48" />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <h4 className="mb-1 font-medium">Capacidade</h4>
                                        <p>{selectedEspaco.capacidade_pessoas} pessoas</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 font-medium">Localização</h4>
                                        <p>{modulos.find((modulo) => modulo.id == selectedEspaco.andar_id)?.nome}</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 font-medium">Nome / Numero</h4>
                                        <p>{selectedEspaco.nome}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-1 font-medium">Equipamentos</h4>
                                    <ul className="list-disc pl-5">
                                        {/*{selectedespaco.equipamentos.map((equip, index) => (
                                            <li key={index}>{equip}</li>
                                        ))}*/}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="mb-1 font-medium">Recursos</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge key={resourceIcon['acessibilidade'].key} variant="outline" className="flex items-center gap-1">
                                            {resourceIcon['acessibilidade']}
                                            <span>Acessibilidade</span>
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    {userType === 3 && selectedEspaco && (
                                        <Button onClick={() => handleSolicitarReserva(selectedEspaco.id.toString())}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Solicitar Reserva
                                        </Button>
                                    )}

                                    {userType === 1 && (
                                        <Button variant="secondary" onClick={() => handleEditarEspaco(selectedEspaco.id.toString())}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar Espaço
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
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
