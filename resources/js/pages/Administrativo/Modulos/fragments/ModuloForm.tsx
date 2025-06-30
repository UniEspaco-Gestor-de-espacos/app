import MultiSelect from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, Select as SelectUI, SelectValue } from '@/components/ui/select';
import { Instituicao, Modulo, Unidade } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
    quantidadeAndares?: string;
    modulo?: Modulo;
};

type AndarPresetType = {
    numero: number;
    nome: string;
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
    quantidadeAndares,
}: ModuloFormProps) {
    const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<Instituicao | undefined>(modulo?.unidade?.instituicao);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | undefined>(modulo?.unidade);
    const [andarSelecionado, setAndarSelecionado] = useState<string | undefined>(undefined);
    const qntNumber = quantidadeAndares ? parseInt(quantidadeAndares, 10) : 0;
    const andaresPredefinidos = useMemo(
        () =>
            [
                { numero: -1, nome: 'Subsolo' },
                { numero: 0, nome: 'Térreo' },
                ...Array.from({ length: qntNumber }, (_, index) => ({ numero: index + 1, nome: `${index + 1}º Andar` })),
            ] as AndarPresetType[],
        [qntNumber],
    );
    useEffect(() => {
        if (!andarSelecionado) {
            setData((prevData) => ({ ...prevData, quantidade_andares: '0' }));
            return;
        }
        const selectedAndar = andaresPredefinidos.find((andar) => andar.numero.toString() === andarSelecionado);
        if (selectedAndar) {
            setData((prevData) => ({ ...prevData, quantidade_andares: selectedAndar.numero.toString() }));
        }
    }, [andarSelecionado, andaresPredefinidos, setData]);

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
                                <SelectValue placeholder="Selecione uma instituicao" />
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
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantidadeAndares">Quantidade de Andar</Label>
                            <Select
                                value={andarSelecionado}
                                onValueChange={(value) => {
                                    setAndarSelecionado(value);
                                    setData((prevData) => ({ ...prevData, quantidade_andares: value }));
                                }}
                            >
                                <SelectTrigger id="novo-andar-nome">
                                    <SelectValue placeholder="Selecione um andar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {andaresPredefinidos.map((andar) => (
                                        <SelectItem key={andar.numero} value={andar.numero.toString()}>
                                            {andar.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tipos de Acesso</Label>
                            <MultiSelect
                                processing={processing}
                                value={data.tipos_de_acesso}
                                onValueChange={(newValues) => setData((prevData) => ({ ...prevData, tipos_de_acesso: newValues }))}
                            />
                            {errors.tipos_de_acesso && <p className="mt-1 text-sm text-red-500">{errors.tipos_de_acesso}</p>}
                        </div>
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
