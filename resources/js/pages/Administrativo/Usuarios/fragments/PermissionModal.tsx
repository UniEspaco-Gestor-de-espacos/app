'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agenda, Andar, Espaco, Instituicao, Modulo, PermissionType, Unidade, User } from '@/types';
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

    useEffect(() => {
        if (user) {
            setSelectedPermissionType(user.permission_type_id);
        }
    }, [user]);

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
