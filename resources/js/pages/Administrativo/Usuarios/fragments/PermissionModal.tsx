import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agenda, Instituicao, PermissionType, SelectedAgenda, User } from '@/types';
import { useEffect, useState } from 'react';
import FiltroBuscaPermission from './FiltroBuscaPermission';

interface PermissionModalProps {
    user: User | undefined;
    isOpen: boolean;
    processing?: boolean;
    onClose: () => void;
    onUpdate: (userId: number, permissionTypeId: number, agendas?: number[]) => void;
    permissionTypes: PermissionType[];
    instituicoes: Instituicao[];
    initialAgendas?: Agenda[];
}

export function PermissionModal({ user, isOpen, onClose, onUpdate, permissionTypes, instituicoes, processing = false }: PermissionModalProps) {
    const [selectedPermissionType, setSelectedPermissionType] = useState<number>(0);
    const [selectedAgendas, setSelectedAgendas] = useState<SelectedAgenda[]>(
        user?.agendas!.map(
            (agenda) =>
                ({
                    agenda: agenda,
                    espaco: agenda.espaco,
                    andar: agenda.espaco?.andar,
                    modulo: agenda.espaco?.andar?.modulo,
                    unidade: agenda.espaco?.andar?.modulo?.unidade,
                    instituicao: agenda.espaco?.andar?.modulo?.unidade?.instituicao,
                }) as SelectedAgenda,
        ) || [],
    );

    console.log('Selected Agendas:', selectedAgendas);
    useEffect(() => {
        if (user) {
            setSelectedPermissionType(user.permission_type_id);
        }
    }, [user]);

    const handleSubmit = () => {
        if (!user) return;

        const agendaIds = selectedAgendas.map((sa) => sa.agenda.id);
        onUpdate(user.id, selectedPermissionType, agendaIds);
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
                        <FiltroBuscaPermission
                            instituicoes={instituicoes}
                            selectedAgendas={selectedAgendas}
                            setSelectedAgendas={setSelectedAgendas}
                        />
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            Salvar Permissões
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
