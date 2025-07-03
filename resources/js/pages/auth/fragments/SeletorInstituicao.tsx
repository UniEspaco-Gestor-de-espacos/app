import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Instituicao, Setor, Unidade } from '@/types';
import { useState } from 'react';

interface SeletorInstituicaoProps {
    instituicaos: Instituicao[];
    processing: boolean;
    onSetorChange: (setorId: string) => void;
    errors: Record<string, string>;
}

export function SeletorInstituicao({ instituicaos, processing, onSetorChange, errors }: SeletorInstituicaoProps) {
    const [instituicaoId, setInstituicaoId] = useState<string>('');
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [unidadeId, setUnidadeId] = useState<string>('');
    const [setores, setSetores] = useState<Setor[]>([]);
    const [setorId, setSetorId] = useState<string>('');

    const handleInstituicaoChange = (value: string) => {
        setInstituicaoId(value);
        const instituicao = instituicaos.find((i) => i.id.toString() === value);
        setUnidades(instituicao?.unidades || []);
        setUnidadeId('');
        setSetores([]);
        setSetorId('');
        onSetorChange('');
    };

    const handleUnidadeChange = (value: string) => {
        setUnidadeId(value);
        const unidade = unidades.find((u) => u.id.toString() === value);
        setSetores(unidade?.setors || []);
        setSetorId('');
        onSetorChange('');
    };

    const handleSetorChange = (value: string) => {
        setSetorId(value);
        onSetorChange(value);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Instituição *</Label>
                <Select value={instituicaoId} onValueChange={handleInstituicaoChange} disabled={processing}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione uma instituição" />
                    </SelectTrigger>
                    <SelectContent>
                        {instituicaos.map((instituicao) => (
                            <SelectItem key={instituicao.id} value={instituicao.id.toString()}>
                                {instituicao.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.instituicao_id} />
            </div>

            {instituicaoId && unidades.length > 0 && (
                <div className="space-y-2">
                    <Label>Unidade *</Label>
                    <Select value={unidadeId} onValueChange={handleUnidadeChange} disabled={processing}>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione uma unidade" />
                        </SelectTrigger>
                        <SelectContent>
                            {unidades.map((unidade) => (
                                <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                    {unidade.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.unidade_id} />
                </div>
            )}

            {unidadeId && setores.length > 0 && (
                <div className="space-y-2">
                    <Label>Setor *</Label>
                    <Select value={setorId} onValueChange={handleSetorChange} disabled={processing}>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                        <SelectContent>
                            {setores.map((setor) => (
                                <SelectItem key={setor.id} value={setor.id.toString()}>
                                    {setor.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.setor_id} />
                </div>
            )}
        </div>
    );
}
