import DeleteItem from '@/components/delete-item';
import GenericHeader from '@/components/generic-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { nivelParaLabel, nomeParaNivel } from '@/lib/utils/andars/AndarHelpers';
import { Modulo } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Building, ChevronDown, ChevronRight, Edit, Layers, MapPin, PlusCircle, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Gerenciar Modulos',
        href: '/institucional/modulos',
    },
];

const tiposAcessoColors: Record<string, string> = {
    terreo: 'bg-green-100 text-green-800 border-green-200',
    escada: 'bg-blue-100 text-blue-800 border-blue-200',
    elevador: 'bg-purple-100 text-purple-800 border-purple-200',
    rampa: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function ModulosPage() {
    const { modulos } = usePage<{
        modulos: {
            data: Modulo[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object;
        };
    }>().props;
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroUnidade, setFiltroUnidade] = useState('all'); // Updated default value
    const [expandedModulos, setExpandedModulos] = useState<Set<number>>(new Set());
    const [removerModulo, setRemoverModulo] = useState<Modulo | null>(null);
    const toggleModulo = (moduloId: number) => {
        const newExpanded = new Set(expandedModulos);
        if (newExpanded.has(moduloId)) {
            newExpanded.delete(moduloId);
        } else {
            newExpanded.add(moduloId);
        }
        setExpandedModulos(newExpanded);
    };

    const modulosFiltrados = modulos.data.filter((modulo) => {
        const nomeMatch = modulo.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const unidadeMatch = filtroUnidade === 'all' || modulo.unidade?.nome === filtroUnidade;
        return nomeMatch && unidadeMatch;
    });

    const unidadesUnicas = Array.from(new Set(modulos.data.map((m) => m.unidade?.nome).filter(Boolean)));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modulos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <div className="container mx-auto space-y-6 p-6">
                        {/* Header */}
                        <div className="flex flex-col space-y-4">
                            <GenericHeader
                                titulo="Módulos Cadastrados"
                                descricao="Visualize todos os módulos, unidades e andares do sistema"
                                canSeeButton
                                buttonLink={route('institucional.modulos.create')}
                                buttonText="Cadastrar modulo"
                                ButtonIcon={PlusCircle}
                            />

                            {/* Filtros */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Filtrar por nome do módulo..."
                                        value={filtroNome}
                                        onChange={(e) => setFiltroNome(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Filtrar por unidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas as unidades</SelectItem>
                                        {unidadesUnicas.map((unidade) => (
                                            <SelectItem key={unidade} value={unidade!}>
                                                {unidade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Lista de Módulos */}
                        <div className="space-y-4">
                            {modulosFiltrados.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Layers className="text-muted-foreground mb-4 h-12 w-12" />
                                        <h3 className="mb-2 text-lg font-semibold">Nenhum módulo encontrado</h3>
                                        <p className="text-muted-foreground text-center">Não há módulos que correspondam aos filtros aplicados.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                modulosFiltrados.map((modulo) => (
                                    <Card key={modulo.id} className="overflow-hidden">
                                        <Collapsible open={expandedModulos.has(modulo.id)} onOpenChange={() => toggleModulo(modulo.id)}>
                                            <CollapsibleTrigger asChild>
                                                <CardHeader className="hover:bg-muted/50 cursor-pointer transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-2">
                                                            <CardTitle className="flex items-center gap-2">
                                                                <Layers className="h-5 w-5" />
                                                                {modulo.nome}
                                                            </CardTitle>
                                                            <CardDescription className="flex items-center gap-4">
                                                                <span className="flex items-center gap-1">
                                                                    <Building className="h-4 w-4" />
                                                                    {modulo.unidade?.instituicao?.sigla}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    {modulo.unidade?.nome} ({modulo.unidade?.sigla})
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4" />
                                                                    {modulo.andars?.length || 0} andares
                                                                </span>
                                                            </CardDescription>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.visit(route('institucional.modulos.edit', { modulo: modulo.id }));
                                                                }}
                                                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setRemoverModulo(modulo);
                                                                }}
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                {expandedModulos.has(modulo.id) ? (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronRight className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-4">
                                                        {/* Informações da Instituição */}
                                                        <div className="bg-muted/30 rounded-lg p-4">
                                                            <h4 className="mb-2 font-semibold">Informações da Instituição</h4>
                                                            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                                                <div>
                                                                    <span className="font-medium">Nome:</span> {modulo.unidade?.instituicao?.nome}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Sigla:</span> {modulo.unidade?.instituicao?.sigla}
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <span className="font-medium">Endereço:</span>{' '}
                                                                    {modulo.unidade?.instituicao?.endereco}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Lista de Andares */}
                                                        <div>
                                                            <h4 className="mb-3 font-semibold">Andares do Módulo</h4>
                                                            {modulo.andars && modulo.andars.length > 0 ? (
                                                                <div className="space-y-3">
                                                                    {modulo.andars
                                                                        .sort((a, b) => nomeParaNivel(a.nome) - nomeParaNivel(b.nome))
                                                                        .map((andar) => (
                                                                            <div key={andar.id} className="bg-card rounded-lg border p-4">
                                                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                                    <div>
                                                                                        <h5 className="font-medium">
                                                                                            {nivelParaLabel(nomeParaNivel(andar.nome))}
                                                                                        </h5>
                                                                                        <p className="text-muted-foreground text-sm">
                                                                                            Nível: {nomeParaNivel(andar.nome)}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        {andar.tipo_acesso.map((tipo) => (
                                                                                            <Badge
                                                                                                key={tipo}
                                                                                                variant="outline"
                                                                                                className={
                                                                                                    tiposAcessoColors[tipo] ||
                                                                                                    'bg-gray-100 text-gray-800'
                                                                                                }
                                                                                            >
                                                                                                {tipo}
                                                                                            </Badge>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-muted-foreground text-sm">
                                                                    Nenhum andar cadastrado para este módulo.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                ))
                            )}
                        </div>
                        {removerModulo && (
                            <DeleteItem itemName={removerModulo.nome} route={route('institucional.modulos.destroy', { modulo: removerModulo.id })} />
                        )}
                        {/* Resumo */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
