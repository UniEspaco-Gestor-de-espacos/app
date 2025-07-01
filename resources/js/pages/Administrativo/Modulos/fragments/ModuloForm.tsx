'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, Select as SelectUI, SelectValue } from '@/components/ui/select';
import { isEditMode, transformModuloToFormData } from '@/lib/utils/ModuloDataFormTransformer';
import { Instituicao, Modulo, Unidade } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CadastrarModuloForm } from '../CadastrarModulo';
import AndaresGrid from './AndaresGrid';
import AndarStickFormActions from './AndarStickFormActions';
import AndarSummary from './AndarSummary';

export type ModuloFormProps = {
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

    const topRef = useRef<HTMLDivElement>(null);
    const andaresRef = useRef<HTMLDivElement>(null);

    // Inicializar dados do formulário quando em modo de edição
    useEffect(() => {
        if (modulo && isEditMode(modulo)) {
            const formData = transformModuloToFormData(modulo);
            setData(formData);

            if (modulo.unidade?.instituicao) {
                setInstituicaoSelecionada(modulo.unidade.instituicao);
            }
        }
    }, [modulo, setData]);

    const unidadesFiltradas = useMemo(() => {
        if (!instituicaoSelecionada) return [];
        return unidades.filter((unidade) => unidade.instituicao?.id === instituicaoSelecionada.id);
    }, [instituicaoSelecionada, unidades]);

    const handleAddAndar = () => {
        setData((prev) => ({
            ...prev,
            andares: [
                ...prev.andares,
                {
                    nome: '',
                    tipo_acesso: [],
                },
            ],
        }));

        // Scroll suave para a seção de andares após adicionar
        setTimeout(() => {
            andaresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handleUpdateAndar = (index: number, andar: { nome: string; tipo_acesso: string[] }) => {
        setData((prev) => {
            const andarDuplicado = prev.andares.some((a, i) => i !== index && a.nome === andar.nome && andar.nome !== '');

            if (andarDuplicado) {
                return prev;
            }

            return {
                ...prev,
                andares: prev.andares.map((a, i) => (i === index ? andar : a)),
            };
        });
    };

    const handleRemoveAndar = (index: number) => {
        setData((prev) => ({
            ...prev,
            andares: prev.andares.filter((_, i) => i !== index),
        }));
    };

    const handleCollapseAll = () => {
        // Esta funcionalidade seria implementada passando estado para os cards
        console.log('Recolher todos os andares');
    };

    const handleExpandAll = () => {
        // Esta funcionalidade seria implementada passando estado para os cards
        console.log('Expandir todos os andares');
    };

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const editMode = isEditMode(modulo);

    return (
        <div ref={topRef}>
            <form onSubmit={submit} className="space-y-6 pb-20">
                {/* Informações Básicas do Módulo */}
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                        {editMode && <div className="text-muted-foreground text-sm">ID do Módulo: {modulo?.id}</div>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Select de Instituição */}
                        <div className="space-y-2">
                            <Label>Instituição</Label>
                            <SelectUI
                                value={instituicaoSelecionada?.id.toString()}
                                onValueChange={(value) => {
                                    const instituicao = instituicoes.find((i) => i.id.toString() === value);
                                    setInstituicaoSelecionada(instituicao);
                                    if (!editMode) {
                                        setData((prev) => ({ ...prev, unidade_id: '' }));
                                    }
                                }}
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
                                onValueChange={(value) => setData((prev) => ({ ...prev, unidade_id: value }))}
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
                                onChange={(e) => setData((prev) => ({ ...prev, nome: e.target.value }))}
                                placeholder="Ex: Bloco Administrativo"
                            />
                            {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Seção de Andares */}
                <Card ref={andaresRef}>
                    <CardHeader>
                        <CardTitle>Andares do Módulo</CardTitle>
                        <CardDescription>Configure os andares e seus tipos de acesso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AndaresGrid
                            andares={data.andares}
                            onUpdate={handleUpdateAndar}
                            onRemove={handleRemoveAndar}
                            onAdd={handleAddAndar}
                            onCollapseAll={handleCollapseAll}
                            onExpandAll={handleExpandAll}
                            errors={errors}
                            processing={processing}
                        />
                        {errors.andares && <p className="mt-4 text-sm text-red-500">{errors.andares}</p>}
                    </CardContent>
                </Card>

                {/* Resumo dos Andares */}
                {data.andares.length > 0 && <AndarSummary andares={data.andares} />}

                {/* Botões de Ação Fixos */}
                <Card>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : editMode ? 'Atualizar Módulo' : 'Salvar Módulo'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            {/* Ações Sticky */}
            <AndarStickFormActions processing={processing} isEditMode={editMode} onScrollToTop={scrollToTop} andaresCount={data.andares.length} />
        </div>
    );
}
