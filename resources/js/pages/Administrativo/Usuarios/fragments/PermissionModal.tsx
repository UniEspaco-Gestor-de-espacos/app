'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agenda, Andar, Espaco, Instituicao, Modulo, PermissionType, Unidade, User } from '@/types';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SelectedAgenda {
    agenda: Agenda;
    espaco: Espaco;
    andar: Andar;
    modulo: Modulo;
    unidade: Unidade;
    instituicao: Instituicao;
}

interface PermissionModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userId: number, permissionTypeId: number, agendas?: number[]) => void;
    permissionTypes: PermissionType[];
    instituicoes: Instituicao[];
}

export function PermissionModal({ user, isOpen, onClose, onUpdate, permissionTypes, instituicoes }: PermissionModalProps) {
    const [selectedPermissionType, setSelectedPermissionType] = useState<number>(0);
    const [selectedInstituicao, setSelectedInstituicao] = useState<number>(0);
    const [selectedUnidade, setSelectedUnidade] = useState<number>(0);
    const [selectedModulo, setSelectedModulo] = useState<number>(0);
    const [selectedAndar, setSelectedAndar] = useState<number>(0);
    const [selectedEspaco, setSelectedEspaco] = useState<number>(0);
    const [selectedAgendaId, setSelectedAgendaId] = useState<string>('');
    const [selectedAgendas, setSelectedAgendas] = useState<SelectedAgenda[]>([]);

    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [andares, setAndares] = useState<Andar[]>([]);
    const [espacos, setEspacos] = useState<Espaco[]>([]);
    const [agendas, setAgendas] = useState<Agenda[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setSelectedPermissionType(user.permission_type_id);
        }
    }, [user]);

    useEffect(() => {
        if (selectedInstituicao) {
            fetchUnidades(selectedInstituicao);
            resetSelections(['unidade', 'modulo', 'andar', 'espaco']);
        }
    }, [selectedInstituicao]);

    useEffect(() => {
        if (selectedUnidade) {
            fetchModulos(selectedUnidade);
            resetSelections(['modulo', 'andar', 'espaco']);
        }
    }, [selectedUnidade]);

    useEffect(() => {
        if (selectedModulo) {
            fetchAndares(selectedModulo);
            resetSelections(['andar', 'espaco']);
        }
    }, [selectedModulo]);

    useEffect(() => {
        if (selectedAndar) {
            fetchEspacos(selectedAndar);
            resetSelections(['espaco']);
        }
    }, [selectedAndar]);

    useEffect(() => {
        if (selectedEspaco) {
            fetchAgendas(selectedEspaco);
        }
    }, [selectedEspaco]);

    const resetSelections = (types: string[]) => {
        if (types.includes('unidade')) {
            setSelectedUnidade(0);
            setUnidades([]);
        }
        if (types.includes('modulo')) {
            setSelectedModulo(0);
            setModulos([]);
        }
        if (types.includes('andar')) {
            setSelectedAndar(0);
            setAndares([]);
        }
        if (types.includes('espaco')) {
            setSelectedEspaco(0);
            setEspacos([]);
        }
    };

    const fetchUnidades = async (instituicaoId: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/unidades', {
                params: { instituicao_id: instituicaoId },
            });
            setUnidades(response.data);
        } catch (error) {
            console.error('Erro ao buscar unidades:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModulos = async (unidadeId: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/modulos', {
                params: { unidade_id: unidadeId },
            });
            setModulos(response.data);
        } catch (error) {
            console.error('Erro ao buscar módulos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAndares = async (moduloId: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/andares', {
                params: { modulo_id: moduloId },
            });
            setAndares(response.data);
        } catch (error) {
            console.error('Erro ao buscar andares:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEspacos = async (andarId: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/espacos', {
                params: { andar_id: andarId },
            });
            setEspacos(response.data);
        } catch (error) {
            console.error('Erro ao buscar espaços:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgendas = async (espacoId: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/agendas', {
                params: { espaco_id: espacoId },
            });
            setAgendas(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgenda = () => {
        const agendaId = Number(selectedAgendaId);
        if (!agendaId) return;

        const agenda = agendas.find((a) => a.id === agendaId);
        if (!agenda) return;

        const espaco = espacos.find((e) => e.id === selectedEspaco);
        const andar = andares.find((a) => a.id === selectedAndar);
        const modulo = modulos.find((m) => m.id === selectedModulo);
        const unidade = unidades.find((u) => u.id === selectedUnidade);
        const instituicao = instituicoes.find((i) => i.id === selectedInstituicao);

        if (!espaco || !andar || !modulo || !unidade || !instituicao) return;

        const selectedAgenda: SelectedAgenda = {
            agenda,
            espaco,
            andar,
            modulo,
            unidade,
            instituicao,
        };

        const isAlreadySelected = selectedAgendas.some((sa) => sa.agenda.id === agendaId);
        if (!isAlreadySelected) {
            setSelectedAgendas([...selectedAgendas, selectedAgenda]);
            setSelectedAgendaId('');
        }
    };

    const handleRemoveAgenda = (agendaId: number) => {
        setSelectedAgendas(selectedAgendas.filter((sa) => sa.agenda.id !== agendaId));
    };

    const handleSubmit = () => {
        if (!user) return;

        const agendaIds = selectedAgendas.map((sa) => sa.agenda.id);
        onUpdate(user.id, selectedPermissionType, agendaIds);
    };

    const resetForm = () => {
        setSelectedInstituicao(0);
        setSelectedUnidade(0);
        setSelectedModulo(0);
        setSelectedAndar(0);
        setSelectedEspaco(0);
        setSelectedAgendaId('');
        setUnidades([]);
        setModulos([]);
        setAndares([]);
        setEspacos([]);
        setAgendas([]);
    };

    const getTurnoLabel = (turno: string) => {
        switch (turno) {
            case 'manha':
                return 'Manhã';
            case 'tarde':
                return 'Tarde';
            case 'noite':
                return 'Noite';
            default:
                return turno;
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gerenciar Permissões - {user.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="permission-type">Tipo de Permissão</Label>
                        <Select
                            value={selectedPermissionType.toString()}
                            onValueChange={(value) => setSelectedPermissionType(Number.parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de permissão" />
                            </SelectTrigger>
                            <SelectContent>
                                {permissionTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedPermissionType === 2 && (
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
                                                value={selectedInstituicao.toString()}
                                                onValueChange={(value) => setSelectedInstituicao(Number.parseInt(value))}
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
                                                    <Select
                                                        value={selectedAgendaId}
                                                        onValueChange={setSelectedAgendaId}
                                                        disabled={!selectedEspaco || loading}
                                                    >
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
                                                <div
                                                    key={selectedAgenda.agenda.id}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {selectedAgenda.espaco.nome} - {getTurnoLabel(selectedAgenda.agenda.turno)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {selectedAgenda.instituicao.nome} → {selectedAgenda.unidade.nome} →{' '}
                                                            {selectedAgenda.modulo.nome} → {selectedAgenda.andar.nome}
                                                        </div>
                                                        <Badge variant="outline">
                                                            Capacidade: {selectedAgenda.espaco.capacidade_pessoas} pessoas
                                                        </Badge>
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
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            Salvar Permissões
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
