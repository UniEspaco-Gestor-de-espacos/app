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
import { Espaco, Modulo, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Home, Info, Projector, Search, Users, ShipWheelIcon as Wheelchair, Wifi, Wind } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
];

export default function EspacosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModulo, setSelectedModulo] = useState('');
    const [selectedCapacidade, setSelectedCapacidade] = useState('');
    const [selectedDisponibilidade, setSelectedDisponibilidade] = useState('');
    //const [viewType, setViewType] = useState('cards');
    const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { props } = usePage<{ espacos: Espaco[]; user: User; modulos: Modulo[] }>();
    const { espacos, user, modulos } = props;
    const userType = user.permission_type_id; // 1 - INSTITUCIONAL, 2 - GESTOR, 3 - COMUM

    // Filtrar espaços com base nos critérios selecionados
    const filteredespacos = espacos.filter((espaco) => {
        const modulosFiltrados = modulos.filter((modulo) => modulo.nome.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
        const idModulosFiltrados = modulosFiltrados.map((modulo) => modulo.id);
        const matchesSearch = espaco.nome.toLowerCase().includes(searchTerm.toLowerCase()) || idModulosFiltrados.includes(espaco.modulo_id);
        const matchModulo = selectedModulo == '' || selectedModulo == 'all' || espaco.modulo_id.toString() == selectedModulo;
        const matchesCapacidade =
            selectedCapacidade === '' ||
            (selectedCapacidade === 'pequeno' && espaco.capacidade_pessoas <= 30) ||
            (selectedCapacidade === 'medio' && espaco.capacidade_pessoas > 30 && espaco.capacidade_pessoas <= 100) ||
            (selectedCapacidade === 'grande' && espaco.capacidade_pessoas > 100);
        /*const matchesDisponibilidade =
            selectedDisponibilidade === '' ||
            (selectedDisponibilidade === 'disponivel' && espaco.disponivel) ||
            (selectedDisponibilidade === 'indisponivel' && !espaco.disponivel);*/

        return matchesSearch && matchModulo && matchesCapacidade; // && matchesDisponibilidade;
    });
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
            <div>
                <button
                    type="button"
                    onClick={() => {
                        router.visit('/espacos/create');
                    }}
                >
                    {' '}
                    Cadastrar espaço{' '}
                </button>
            </div>
            {/* Todo o conteúdo a partir dos filtros até o final em uma única div */}
            <div className="m-8">
                {/* Filtros e Busca */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="sm:col-span-2">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                    <Input
                                        placeholder="Buscar por nome ou localização..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Select value={selectedModulo} onValueChange={setSelectedModulo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Modulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'all'}>Todos os Modulos</SelectItem>
                                    {modulos.map((modulo) => (
                                        <SelectItem value={modulo.id.toString()}>{modulo.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCapacidade} onValueChange={setSelectedCapacidade}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Capacidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="qualquer">Qualquer Capacidade</SelectItem>
                                    <SelectItem value="pequeno">Pequeno (até 30)</SelectItem>
                                    <SelectItem value="medio">Médio (31-100)</SelectItem>
                                    <SelectItem value="grande">Grande (101+)</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedDisponibilidade} onValueChange={setSelectedDisponibilidade}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Disponibilidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="disponivel">Disponível</SelectItem>
                                    <SelectItem value="indisponivel">Indisponível</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Alternador de visualização */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {filteredespacos.map((espaco) => (
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
                                            {modulos.find((modulo) => modulo.id == espaco.modulo_id)?.nome} / {espaco.nome}
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
                                    {selectedEspaco.nome} - {modulos.find((modulo) => modulo.id == selectedEspaco.modulo_id)?.nome}
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
                                        <p>{modulos.find((modulo) => modulo.id == selectedEspaco.modulo_id)?.nome}</p>
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
        </AppLayout>
    );
}
