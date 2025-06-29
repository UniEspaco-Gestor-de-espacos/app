import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, Select as SelectUI, SelectValue } from '@/components/ui/select';
import { Instituicao, Modulo, Unidade } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { CadastrarModuloForm } from '../CadastrarModulo';

// Componente reutilizável para os formulários de Criar e Editar

type ModuloFormProps = {
    data: CadastrarModuloForm;
    setData: ReturnType<typeof useForm<CadastrarModuloForm>>['setData'];
    submit: (e: React.FormEvent<HTMLFormElement>) => void;
    errors: Record<string, string>;
    processing: boolean;
    title: string;
    description: string;
    instituicoes: Instituicao[];
    unidades: Unidade[];
    modulo?: Modulo;
};
export default function ModuloForm({
    data,
    setData,
    submit,
    errors,
    processing,
    title,
    description,
    instituicoes,
    unidades,
    modulo,
}: ModuloFormProps) {
    const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<Instituicao | undefined>(modulo?.unidade?.instituicao);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | undefined>(modulo?.unidade);

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instituicao</label>
                        <SelectUI
                            value={instituicaoSelecionada?.id.toString()}
                            onValueChange={(value) => setInstituicaoSelecionada(instituicoes.find((i) => i.id.toString() === value))}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {instituicoes.map((instituicao) => (
                                    <SelectItem key={instituicao.id.toString()} value={instituicao.id.toString()}>
                                        {instituicao.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectUI>
                        {errors.unidade_id && <p className="mt-1 text-sm text-red-500">{errors.unidade_id}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="unidade_id" className="text-sm font-medium">
                            Unidade
                        </label>
                        <SelectUI
                            value={unidadeSelecionada?.id.toString()}
                            onValueChange={(value) => {
                                setUnidadeSelecionada(unidades.find((u) => u.id.toString() === value));
                                setData((prevData) => ({ ...prevData, unidade_id: value }));
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {unidades
                                    .filter((unidade) => unidade.instituicao?.id === instituicaoSelecionada?.id)
                                    .map((unidade) => (
                                        <SelectItem key={unidade.id.toString()} value={unidade.id.toString()}>
                                            {unidade.nome}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </SelectUI>
                        {errors.unidade_id && <p className="mt-1 text-sm text-red-500">{errors.unidade_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome do modulo</Label>
                        <Input
                            id="nome"
                            value={data.nome}
                            onChange={(e) => setData((prevData) => ({ ...prevData, nome: e.target.value }))}
                            placeholder="Ex: Administrativo"
                        />
                        {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Salvar'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
