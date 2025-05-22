'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Modulo, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react'; // Importação correta para Inertia
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
const breadcrumbs = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
];

type FormValues = {
    unidade_id: string;
    modulo_id: string;
    name: string;
    capacityPessoas: number | undefined;
    accessibility: boolean;
    description: string;
    image: File | null;
};

export default function CadastroEspacoPage() {
    const { props } = usePage<{ unidades: Unidade[]; modulos: Modulo[] }>();
    const { unidades, modulos } = props;
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Inicializar o formulário com o hook useForm do Inertia
    const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
        unidade_id: '',
        modulo_id: '',
        name: '',
        capacityPessoas: undefined,
        accessibility: false,
        description: '',
        image: null,
    });

    // Função para lidar com a mudança de unidade
    const handleUnidadeChange = (value: string) => {
        setUnidadeSelecionada(value);
        setData('unidade_id', value);
        setData('modulo_id', ''); // Resetar o módulo quando a unidade muda
    };

    // Função para lidar com o upload de imagem
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verificar o tipo do arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Verificar o tamanho do arquivo (limite de 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('O tamanho máximo permitido é 5MB.');
            return;
        }

        // Criar URL para pré-visualização
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        // Definir o arquivo no formulário
        setData('image', file);
    };

    // Função para enviar o formulário
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('espacos.store'), {
            onSuccess: () => {
                reset();
                setUnidadeSelecionada(null);
                setImagePreview(null);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espacos" />
            <div className="container mx-auto py-10">
                <Card className="mx-auto max-w-3xl">
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-2xl">Cadastro de Espaço</CardTitle>
                        <CardDescription>Preencha os dados para cadastrar um novo espaço no sistema UniEspaço</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Seleção de Unidade */}
                                <div className="space-y-2">
                                    <label htmlFor="unidade_id" className="text-sm font-medium">
                                        Unidade
                                    </label>
                                    <Select
                                        value={data.unidade_id ? String(data.unidade_id) : undefined} // Garanta que seja string ou undefined
                                        onValueChange={(value) => handleUnidadeChange(value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            {/* O SelectValue tentará encontrar um SelectItem cujo 'value' corresponda ao 'value' do Select */}
                                            <SelectValue placeholder={'Selecione uma unidade'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unidades.map((unidade) => (
                                                <SelectItem key={unidade.id} value={String(unidade.id)}>
                                                    {unidade.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.unidade_id && <p className="mt-1 text-sm text-red-500">{errors.unidade_id}</p>}
                                </div>

                                {/* Seleção de Módulo (dependente da unidade) */}
                                <div className="space-y-2">
                                    <label htmlFor="modulo_id" className="text-sm font-medium">
                                        Módulo
                                    </label>
                                    <Select
                                        value={data.modulo_id ? String(data.modulo_id) : undefined}
                                        onValueChange={(value) => setData('modulo_id', value)}
                                        disabled={!unidadeSelecionada || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={unidadeSelecionada ? 'Selecione um módulo' : 'Selecione uma unidade primeiro'}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unidadeSelecionada &&
                                                modulos
                                                    .filter((modulo) => modulo.unidade_id == unidadeSelecionada)
                                                    .map((modulo) => (
                                                        <SelectItem key={modulo.id} value={String(modulo.id)}>
                                                            {modulo.nome}
                                                        </SelectItem>
                                                    ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.modulo_id && <p className="mt-1 text-sm text-red-500">{errors.modulo_id}</p>}
                                </div>
                            </div>

                            {/* Nome do Espaço */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nome do Espaço
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Sala 101, Laboratório de Informática"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Capacidade */}
                                <div className="space-y-2">
                                    <label htmlFor="capacityPessoas" className="text-sm font-medium">
                                        Capacidade (pessoas)
                                    </label>
                                    <Input
                                        id="capacityPessoas"
                                        type="number"
                                        min={1}
                                        value={data.capacityPessoas || ''}
                                        onChange={(e) => setData('capacityPessoas', e.target.valueAsNumber)}
                                        disabled={processing}
                                    />
                                    {errors.capacityPessoas && <p className="mt-1 text-sm text-red-500">{errors.capacityPessoas}</p>}
                                </div>

                                {/* Acessibilidade */}
                                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <label htmlFor="accessibility" className="text-sm font-medium">
                                            Acessibilidade
                                        </label>
                                        <p className="text-muted-foreground text-sm">O espaço possui acessibilidade para PCD?</p>
                                    </div>
                                    <Switch
                                        id="accessibility"
                                        checked={data.accessibility}
                                        onCheckedChange={(checked) => setData('accessibility', checked)}
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Descrição */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Descrição
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Descreva detalhes sobre o espaço, como equipamentos disponíveis, características especiais, etc."
                                    className="min-h-[120px]"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Upload de Imagem */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="image" className="text-sm font-medium">
                                        Imagem do Espaço
                                    </label>
                                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={processing} />
                                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                                </div>

                                {imagePreview && (
                                    <div className="relative mt-2">
                                        <div className="relative aspect-video overflow-hidden rounded-md border">
                                            <img
                                                src={imagePreview || '/placeholder.svg'}
                                                alt="Pré-visualização"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setData('image', null);
                                            }}
                                            disabled={processing}
                                        >
                                            Remover
                                        </Button>
                                    </div>
                                )}

                                {!imagePreview && (
                                    <Alert>
                                        <AlertDescription className="text-muted-foreground text-sm">
                                            Adicione uma imagem do espaço para facilitar a identificação. Formatos aceitos: JPG, PNG, GIF. Tamanho
                                            máximo: 5MB.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <CardFooter className="flex justify-end px-0 pb-0">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Cadastrando...' : 'Cadastrar Espaço'}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
