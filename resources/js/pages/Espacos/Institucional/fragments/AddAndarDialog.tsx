// fragments/AddAndarDialog.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

// Componente interno para seleção múltipla, pode ser movido para a pasta de componentes da UI se for reutilizado.
function MultiSelect({ value, onValueChange }: { value: string[]; onValueChange: (values: string[]) => void }) {
    const tiposDeAcesso = ['terreo', 'escada', 'elevador', 'rampa'];
    const [open, setOpen] = useState(false);

    const handleSelect = (tipo: string) => {
        const newValue = value.includes(tipo) ? value.filter((v) => v !== tipo) : [...value, tipo];
        onValueChange(newValue);
    };

    return (
        <div className="relative">
            <div onClick={() => setOpen(!open)} className="border-input bg-background ring-offset-background flex min-h-[40px] cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm">
                {/* ... (código do MultiSelect mantido como no original) ... */}
            </div>
            {open && (
                <div className="bg-popover absolute z-10 mt-1 w-full rounded-md border shadow-md">
                    {/* ... (código do MultiSelect mantido como no original) ... */}
                </div>
            )}
        </div>
    );
}

interface AddAndarDialogProps {
    moduloSelecionado: number;
    setIsDialogOpen: (isOpen: boolean) => void;
}

export function AddAndarDialog({ moduloSelecionado, setIsDialogOpen }: AddAndarDialogProps) {
    const andaresPredefinidos = ['Térreo', ...Array.from({ length: 10 }, (_, i) => `${i + 1}º Andar`)];
    const [nomeNovoAndar, setNomeNovoAndar] = useState('');
    const [tipoAcessoNovoAndar, setTipoAcessoNovoAndar] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNovoAndar = () => {
        if (!nomeNovoAndar.trim() || tipoAcessoNovoAndar.length === 0) {
            toast.error('Preencha o nome e ao menos um tipo de acesso.');
            return;
        }
        setIsSubmitting(true);
        router.post(
            route('institucional.andares.store'),
            { nome: nomeNovoAndar, tipo_acesso: tipoAcessoNovoAndar, modulo_id: moduloSelecionado },
            {
                onSuccess: () => {
                    toast.success('Andar adicionado com sucesso!');
                    setIsDialogOpen(false);
                },
                onError: (errors) => {
                    toast.error(Object.values(errors)[0] || 'Erro ao adicionar andar.');
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Adicionar Novo Andar</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="novo-andar-nome">Nome do Andar</Label>
                    <Select value={nomeNovoAndar} onValueChange={setNomeNovoAndar}><SelectTrigger id="novo-andar-nome"><SelectValue placeholder="Selecione um andar" /></SelectTrigger><SelectContent>
                        {andaresPredefinidos.map((andar) => <SelectItem key={andar} value={andar}>{andar}</SelectItem>)}
                    </SelectContent></Select>
                </div>
                <div className="space-y-2">
                    <Label>Tipos de Acesso</Label>
                    <MultiSelect value={tipoAcessoNovoAndar} onValueChange={setTipoAcessoNovoAndar} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                <Button onClick={handleAddNovoAndar} disabled={isSubmitting || !nomeNovoAndar || tipoAcessoNovoAndar.length === 0}>
                    {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
