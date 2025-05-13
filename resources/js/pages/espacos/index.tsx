'use client';

import espacoImage from '@/assets/espaco.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Espaco, Modulo, Setor, User } from '@/types';
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
    const [selectedSetor, setSelectedSetor] = useState('');
    const [selectedCapacidade, setSelectedCapacidade] = useState('');
    const [selectedDisponibilidade, setSelectedDisponibilidade] = useState('');
    const [viewType, setViewType] = useState('cards');
    const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { props } = usePage<{ espacos: Espaco[]; user: User; modulos: Modulo[]; setores: Setor[] }>();
    const { espacos, user, modulos, setores } = props;
    const userType = user.tipo_usuario;

    // Filtrar espaços com base nos critérios selecionados
    const filteredespacos = espacos.filter((espaco) => {
        const modulosFiltrados = modulos.filter((modulo) => modulo.nome.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
        const idModulosFiltrados = modulosFiltrados.map((modulo) => modulo.id);
        const matchesSearch = espaco.nome.toLowerCase().includes(searchTerm.toLowerCase()) || idModulosFiltrados.includes(espaco.id);
        const matchesSetor = selectedSetor == '' || selectedSetor == 'all' || espaco.setor_id == selectedSetor;
        const matchesCapacidade =
            selectedCapacidade === '' ||
            (selectedCapacidade === 'pequeno' && espaco.capacidadePessoas <= 30) ||
            (selectedCapacidade === 'medio' && espaco.capacidadePessoas > 30 && espaco.capacidadePessoas <= 100) ||
            (selectedCapacidade === 'grande' && espaco.capacidadePessoas > 100);
        /*const matchesDisponibilidade =
            selectedDisponibilidade === '' ||
            (selectedDisponibilidade === 'disponivel' && espaco.disponivel) ||
            (selectedDisponibilidade === 'indisponivel' && !espaco.disponivel);*/

        return matchesSearch && matchesSetor && matchesCapacidade; // && matchesDisponibilidade;
    });
    /**    const filteredespacos = () => {
        const modulosFiltrados = modulos.filter((modulo) => modulo.nome.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
        const idModulosFiltrados = modulosFiltrados.map((modulo) => modulo.id);
        const matchesSearch =
            espacos.filter((espaco) => espaco.nome.includes(searchTerm.toLowerCase())) ||
            espacos.filter((espaco) => idModulosFiltrados.includes(espaco.id));

        const matchesSetor = espacos.filter((espaco) => espaco.setor_id == selectedSetor);
        const matchesCapacidade = (selectedCapacidade === "pequeno" && espacos.filter((espaco) => espaco.capacidadePessoas <= 30)) ||
            (selectedCapacidade === "medio" && espacos.filter((espaco) => espaco.capacidadePessoas > 30 && espaco.capacidadePessoas <= 100)) ||
            (selectedCapacidade === "grande") && espacos.filter((espaco) => espaco.capacidadePessoas > 100) ||
            (selectedCapacidade ==="qualquer")



        const matchesDisponibilidade =
            selectedDisponibilidade === '' ||
            (selectedDisponibilidade === 'disponivel' && espaco.disponivel) ||
            (selectedDisponibilidade === 'indisponivel' && !espaco.disponivel);

            return matchesSearch && matchesSetor && matchesCapacidade[selectedCapacidade]; // && matchesDisponibilidade
        }; */
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
        router.visit(`/espacos/reservar/${espacoId}`);
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

                            <Select value={selectedSetor} onValueChange={setSelectedSetor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Setor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'all'}>Todos os Setores</SelectItem>
                                    {setores.map((setor) => (
                                        <SelectItem value={setor.id}>{setor.nome}</SelectItem>
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
                <Tabs value={viewType} onValueChange={setViewType} className="mb-6">
                    <TabsList>
                        <TabsTrigger value="cards">Cards</TabsTrigger>
                        <TabsTrigger value="table">Tabela</TabsTrigger>
                    </TabsList>

                    {/* Exibição dos espaços */}
                    <TabsContent value="cards" className="mt-0">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                            {filteredespacos.map((espaco) => (
                                <Card key={espaco.id} className="overflow-hidden">
                                    <CardHeader className="p-0">
                                        <img src={espacoImage} alt={espaco.nome} className="object-absolute h-40 w-full" />
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="mb-2 flex items-start justify-between">
                                            <CardTitle className="text-xl">{espaco.nome}</CardTitle>
                                            <Badge variant={espaco ? 'default' : 'destructive'}>{espaco ? 'Disponível' : 'Indisponível'}</Badge>
                                        </div>

                                        <div className="espaco-y-2 mt-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="text-muted-foreground h-4 w-4" />
                                                <span>Capacidade: {espaco.capacidadePessoas} pessoas</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Home className="text-muted-foreground h-4 w-4" />
                                                <span>
                                                    {modulos.find((modulo) => modulo.id == espaco.modulo_id)?.nome} / {espaco.nome}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Setor:</span>
                                                <span>{espaco.id}</span>
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

                                        {(userType === 'professor' || userType === 'setor') && espaco && (
                                            <Button size="sm" onClick={() => handleSolicitarReserva(espaco.id.toString())}>
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Solicitar Reserva
                                            </Button>
                                        )}

                                        {(userType === 'setor' || userType === 'professor') && user.is_gestor && (
                                            <Button variant="secondary" size="sm" onClick={() => handleEditarEspaco(espaco.id.toString())}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar Espaço
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="table" className="mt-0">
                        <div className="overflow-x-auto rounded-md border">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="hover:bg-muted/50 border-b transition-colors">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Capacidade</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Localização</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Setor</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredespacos.map((espaco) => (
                                            <tr key={espaco.id} className="hover:bg-muted/50 border-b transition-colors">
                                                <td className="p-4 align-middle">{espaco.nome}</td>
                                                <td className="p-4 align-middle">{espaco.capacidadePessoas}</td>
                                                <td className="p-4 align-middle">{modulos.find((modulo) => modulo.id == espaco.modulo_id)?.nome}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={espaco ? 'default' : 'destructive'}>
                                                        {espaco ? 'Disponível' : 'Indisponível'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleShowDetails(espaco)}>
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">Detalhes</span>
                                                        </Button>

                                                        {(userType === 'professor' || userType === 'setor') && espaco && (
                                                            <Button size="sm" onClick={() => handleSolicitarReserva(espaco.id.toString())}>
                                                                <Calendar className="h-4 w-4" />
                                                                <span className="sr-only">Reservar</span>
                                                            </Button>
                                                        )}

                                                        {(userType === 'setor' || userType === 'professor') && user.is_gestor && (
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleEditarEspaco(espaco.id.toString())}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Editar</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialog de Detalhes */}
                {selectedEspaco && (
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{selectedEspaco.nome}</DialogTitle>
                                <DialogDescription>Detalhes completos do espaço</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <img src={espacoImage} alt={selectedEspaco.nome} className="h-36 w-full rounded-md object-cover sm:h-48" />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <h4 className="mb-1 font-medium">Capacidade</h4>
                                        <p>{selectedEspaco.capacidadePessoas} pessoas</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 font-medium">Status</h4>
                                        <Badge variant={selectedEspaco ? 'default' : 'destructive'}>
                                            {selectedEspaco ? 'Disponível' : 'Indisponível'}
                                        </Badge>
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
                                        {/*selectedespaco.recursos.map((resource) => (
                                            <Badge key={resource} variant="outline" className="flex items-center gap-1">
                                                {renderResourceIcon(resource)}
                                                <span>{resource}</span>
                                            </Badge>
                                        ))*/}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    {(userType === 'professor' || userType === 'setor') && selectedEspaco && (
                                        <Button onClick={() => handleSolicitarReserva(selectedEspaco.id.toString())}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Solicitar Reserva
                                        </Button>
                                    )}

                                    {(userType === 'setor' || userType === 'professor') && user.is_gestor && (
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
