// CadastroEspacoPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Andar, Modulo, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Importando os fragmentos
import { AddAndarDialog } from './fragments/AddAndarDialog';
import { EspacoFormFields } from './fragments/EspacoFormFields';
import { ImageUpload, ImageWithPreview } from './fragments/ImageUpload';
import { LocationSelector } from './fragments/LocationSelector';

const breadcrumbs = [
    { title: 'Espaço', href: '/institucional/espacos' },
    { title: 'Cadastrar', href: '/espacos/criar' },
];

type FormValues = {
    nome: string;
    capacidade_pessoas: number | undefined;
    descricao: string;
    imagens: File[];
    main_image_index: number | undefined;
    unidade_id: number | undefined;
    modulo_id: number | undefined;
    andar_id: number | undefined;
};

export default function CadastroEspacoPage() {
    const { unidades, modulos, andares } = usePage<{ unidades: Unidade[]; modulos: Modulo[]; andares: Andar[] }>().props;

    const [unidadeSelecionada, setUnidadeSelecionada] = useState<number | undefined>();
    const [moduloSelecionado, setModuloSelecionado] = useState<number | undefined>();
    const [andarSelecionado, setAndarSelecionado] = useState<number | undefined>();
    const [imagesWithPreviews, setImagesWithPreviews] = useState<ImageWithPreview[]>([]);
    const [isAddAndarDialogOpen, setIsAddAndarDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
        nome: '',
        capacidade_pessoas: undefined,
        descricao: '',
        imagens: [],
        main_image_index: undefined,
        unidade_id: undefined,
        modulo_id: undefined,
        andar_id: undefined,
    });

    useEffect(() => {
        setData('unidade_id', unidadeSelecionada);
        setModuloSelecionado(undefined);
        setData('modulo_id', undefined);
        setAndarSelecionado(undefined);
        setData('andar_id', undefined);
    }, [unidadeSelecionada]);

    const handleModuloChange = (value: number) => {
        setModuloSelecionado(value);
        setData('modulo_id', value);
        setAndarSelecionado(undefined);
        setData('andar_id', undefined);
    };

    const handleAndarChange = (value: string) => {
        const andarId = parseInt(value, 10);
        setAndarSelecionado(andarId);
        setData('andar_id', andarId);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('institucional.espacos.store'), {
            onSuccess: () => {
                imagesWithPreviews.forEach((img) => URL.revokeObjectURL(img.preview));
                reset();
                setUnidadeSelecionada(undefined);
                setImagesWithPreviews([]);
                toast.success('Espaço cadastrado com sucesso!');
            },
            onError: (errs) => {
                toast.error(Object.values(errs)[0] || 'Ocorreu um erro de validação.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cadastrar Espaço" />
            <div className="container mx-auto py-10">
                <Dialog open={isAddAndarDialogOpen} onOpenChange={setIsAddAndarDialogOpen}>
                    <Card className="mx-auto max-w-3xl">
                        <CardHeader className="border-b bg-slate-50">
                            <CardTitle className="text-2xl">Cadastro de Espaço</CardTitle>
                            <CardDescription>Preencha os dados para cadastrar um novo espaço.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <LocationSelector
                                    unidades={unidades}
                                    modulos={modulos}
                                    andares={andares}
                                    unidadeSelecionada={unidadeSelecionada}
                                    setUnidadeSelecionada={setUnidadeSelecionada}
                                    moduloSelecionado={moduloSelecionado}
                                    handleModuloChange={handleModuloChange}
                                    andarSelecionado={andarSelecionado}
                                    handleAndarChange={handleAndarChange}
                                    processing={processing}
                                    errors={errors}
                                />
                                <EspacoFormFields data={data} setData={setData} errors={errors} processing={processing} />
                                <ImageUpload
                                    imagesWithPreviews={imagesWithPreviews}
                                    setImagesWithPreviews={setImagesWithPreviews}
                                    mainImageIndex={data.main_image_index}
                                    setData={setData}
                                    processing={processing}
                                    errors={errors}
                                />
                                <CardFooter className="flex justify-end p-0">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {processing ? 'Cadastrando...' : 'Cadastrar Espaço'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                    {moduloSelecionado && <AddAndarDialog moduloSelecionado={moduloSelecionado} setIsDialogOpen={setIsAddAndarDialogOpen} />}
                </Dialog>
            </div>
        </AppLayout>
    );
}
