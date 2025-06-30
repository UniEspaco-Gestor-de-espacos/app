import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, Select as SelectUI, SelectValue } from '@/components/ui/select';
import { Instituicao, Modulo, Unidade } from '@/types';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    const unidadesFiltradas = useMemo(() => {
        if (!instituicaoSelecionada) return [];
        return unidades.filter((unidade) => unidade.instituicao?.id === instituicaoSelecionada.id);
    }, [instituicaoSelecionada, unidades]);
    const [open, setOpen] = useState(false);

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
    const tiposDeAcesso = ['terreo', 'escada', 'elevador', 'rampa'];

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Select de Instituição */}
                    <div className="space-y-2">
                        <Label>Instituição</Label>
                        <SelectUI
                            value={instituicaoSelecionada?.id.toString()}
                            onValueChange={(value) => setInstituicaoSelecionada(instituicoes.find((i) => i.id.toString() === value))}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma instituição" />
                            </SelectTrigger>
                            <SelectContent>
                                {instituicoes.map((instituicao) => (
                                    <SelectItem key={instituicao.id} value={instituicao.id.toString()}>
                                        {instituicao.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectUI>
                    </div>

                    {/* Select de Unidade */}
                    <div className="space-y-2">
                        <Label htmlFor="unidade_id">Unidade</Label>
                        <SelectUI
                            value={data.unidade_id}
                            onValueChange={(value) => setData((prevData) => ({ ...prevData, unidade_id: value }))}
                            disabled={processing || !instituicaoSelecionada}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {unidadesFiltradas.map((unidade) => (
                                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                        {unidade.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectUI>
                        {errors.unidade_id && <p className="mt-1 text-sm text-red-500">{errors.unidade_id}</p>}
                    </div>

                    {/* Input Nome do Módulo */}
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome do módulo</Label>
                        <Input
                            id="nome"
                            value={data.nome}
                            onChange={(e) => setData((prevData) => ({ ...prevData, nome: e.target.value }))}
                            placeholder="Ex: Bloco Administrativo"
                        />
                        {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Select de Andar */}
                        <div className="space-y-2">
                            <Label htmlFor="quantidade_andares">Andar</Label>
                            <Select
                                value={data.quantidade_andares}
                                onValueChange={(value) => setData((prevData) => ({ ...prevData, quantidade_andares: value }))}
                            >
                                <SelectTrigger id="andar-select">
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
                            {errors.quantidade_andares && <p className="mt-1 text-sm text-red-500">{errors.quantidade_andares}</p>}
                        </div>

                        {/* MultiSelect Tipos de Acesso */}
                        <div className="space-y-2">
                            <Label>Tipos de Acesso</Label>
                            <div
                                className={`border-input bg-background ring-offset-background flex items-center justify-between rounded-md border px-3 py-2 text-sm ${processing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                onClick={() => !processing && setOpen(!open)}
                            >
                                <div className="flex flex-wrap gap-1">
                                    {data.tipos_de_acesso.length > 0 ? (
                                        data.tipos_de_acesso
                                            .filter((tipo: string) => data.tipos_de_acesso.includes(tipo))
                                            .map((tipo: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="px-2 py-0">
                                                    {tipo}
                                                </Badge>
                                            ))
                                    ) : (
                                        <span className="text-muted-foreground">Selecione os tipos de acesso</span>
                                    )}
                                </div>
                                <div className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 opacity-50"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                            {open && (
                                <Select
                                    value={data.tipos_de_acesso[0]}
                                    onValueChange={(value) => {
                                        if (data.tipos_de_acesso.includes(value)) {
                                            setData((prevData) => ({
                                                ...prevData,
                                                tipos_de_acesso: prevData.tipos_de_acesso.filter((tipo) => tipo !== value),
                                            }));
                                        }
                                        if (data.tipos_de_acesso.length < 4) {
                                            setData((prevData) => ({
                                                ...prevData,
                                                tipos_de_acesso: [...prevData.tipos_de_acesso, value],
                                            }));
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    <SelectTrigger id="tipo-acesso-select">
                                        <SelectValue placeholder="Selecione um andar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposDeAcesso.map((tipo) => (
                                            <SelectItem key={tipo} value={tipo}>
                                                {tipo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

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
