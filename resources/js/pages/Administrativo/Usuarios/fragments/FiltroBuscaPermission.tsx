import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Andar, Instituicao, Modulo, Unidade } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type FiltroBuscaPermissionProps = {
    route: string;
    instituicoes: Instituicao[];
    unidades: Unidade[];
    modulos: Modulo[];
    andares: Andar[];
    filters: {
        instituicao?: string;
        unidade?: string;
        modulo?: string;
        andar?: string;
        espaco?: string;
    };
};

export default function FiltroBuscaPermission({ route, filters, instituicoes, unidades, modulos, andares }: FiltroBuscaPermissionProps) {
    const [localFilters, setLocalFilters] = useState({
        selectedInstituicao: filters.instituicao || '',
        selectedUnidade: filters.unidade || 'all',
        selectedModulo: filters.modulo || 'all',
        selectedAndar: filters.andar || 'all',
        selectedEspaco: filters.espaco || 'all',
    });
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const queryParams = Object.fromEntries(
            Object.entries(localFilters).filter(([key, value]) => {
                if (value === null || value === '') return false;
                if (['unidade', 'modulo', 'andar'].includes(key) && value === 'all') return false;
                if (key === 'capacidade' && value === 'qualquer') return false;
                return true;
            }),
        );

        router.get(route, queryParams, {
            preserveState: true, // Mantém o estado dos filtros na página
            preserveScroll: true, // Não rola a página para o topo
            replace: true,
            onSuccess: (data) => {
                console.log('Filtros aplicados com sucesso:', data);
            },
            onError: (error) => {
                console.error('Erro ao aplicar filtros:', error);
            },
        });
    }, [route, localFilters]);
    const handleFilterChange = (name: keyof typeof localFilters, value: string) => {
        setLocalFilters((prevFilters) => {
            const newFilters = { ...prevFilters, [name]: value };

            if (name === 'selectedUnidade') {
                newFilters.selectedModulo = 'all';
                newFilters.selectedAndar = 'all';
            }
            if (name === 'selectedModulo') {
                newFilters.selectedModulo = 'all';
            }

            return newFilters;
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Agendas para Gestão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Instituição</Label>
                            <Select
                                value={localFilters.selectedInstituicao.toString()}
                                onValueChange={(value) => handleFilterChange('selectedInstituicao',Number.parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a instituição" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instituicoes.map((inst) => (
                                        <SelectItem key={inst.id} value={inst.id.toString()}>
                                            {inst.nome} ({inst.sigla})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Unidade</Label>
                            <Select
                                value={selectedUnidade.toString()}
                                onValueChange={(value) => setSelectedUnidade(Number.parseInt(value))}
                                disabled={!selectedInstituicao || loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unidades.map((unidade) => (
                                        <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                            {unidade.nome} ({unidade.sigla})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Módulo</Label>
                            <Select
                                value={selectedModulo.toString()}
                                onValueChange={(value) => setSelectedModulo(Number.parseInt(value))}
                                disabled={!selectedUnidade || loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modulos.map((modulo) => (
                                        <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                            {modulo.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Andar</Label>
                            <Select
                                value={selectedAndar.toString()}
                                onValueChange={(value) => setSelectedAndar(Number.parseInt(value))}
                                disabled={!selectedModulo || loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o andar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {andares.map((andar) => (
                                        <SelectItem key={andar.id} value={andar.id.toString()}>
                                            {andar.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Espaço</Label>
                            <Select
                                value={selectedEspaco.toString()}
                                onValueChange={(value) => setSelectedEspaco(Number.parseInt(value))}
                                disabled={!selectedAndar || loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o espaço" />
                                </SelectTrigger>
                                <SelectContent>
                                    {espacos.map((espaco) => (
                                        <SelectItem key={espaco.id} value={espaco.id.toString()}>
                                            {espaco.nome} (Cap: {espaco.capacidade_pessoas})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Agenda</Label>
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <Select value={selectedAgendaId} onValueChange={setSelectedAgendaId} disabled={!selectedEspaco || loading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a agenda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agendas.map((agenda) => (
                                                <SelectItem key={agenda.id} value={agenda.id.toString()}>
                                                    Turno: {getTurnoLabel(agenda.turno)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddAgenda} disabled={!selectedAgendaId || loading} size="sm">
                                    Adicionar
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={resetForm}>
                            Limpar Seleção
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {selectedAgendas.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Agendas Selecionadas ({selectedAgendas.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {selectedAgendas.map((selectedAgenda) => (
                                <div key={selectedAgenda.agenda.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            {selectedAgenda.espaco.nome} - {getTurnoLabel(selectedAgenda.agenda.turno)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedAgenda.instituicao.nome} → {selectedAgenda.unidade.nome} → {selectedAgenda.modulo.nome} →{' '}
                                            {selectedAgenda.andar.nome}
                                        </div>
                                        <Badge variant="outline">Capacidade: {selectedAgenda.espaco.capacidade_pessoas} pessoas</Badge>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleRemoveAgenda(selectedAgenda.agenda.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
