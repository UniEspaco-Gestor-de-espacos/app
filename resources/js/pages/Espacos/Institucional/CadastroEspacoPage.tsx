// CadastroEspacoPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Andar, Espaco, Modulo, Unidade } from '@/types';
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

export interface FormCadastroValues {
    nome: string;
    capacidade_pessoas: number | undefined;
    descricao: string;
    imagens: File[];
    main_image_index: number | undefined;
    unidade_id: number | undefined;
    modulo_id: number | undefined;
    andar_id: number | undefined;
    _method?: string;
    images_to_delete?: string[];
    [key: string]: string | number | File[] | string[] | undefined;
}

type CadastroEspacoPageProps = {
    unidades: Unidade[];
    modulos: Modulo[];
    andares: Andar[];
    espaco?: Espaco & {
        andar: Andar & { modulo: Modulo & { unidade: Unidade } };
    };
};

export default function CadastroEspacoPage() {
    const { unidades, modulos, andares, espaco } = usePage<CadastroEspacoPageProps>().props;
    const isEditMode = !!espaco;
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<number | undefined>(espaco?.andar?.modulo?.unidade_id);
    const [moduloSelecionado, setModuloSelecionado] = useState<number | undefined>(espaco?.andar?.modulo?.id);
    const [andarSelecionado, setAndarSelecionado] = useState<number | undefined>(espaco?.andar?.id);
    const [imagesWithPreviews, setImagesWithPreviews] = useState<ImageWithPreview[]>(() => {
        if (!isEditMode || !espaco.imagens) return [];
        // No modo de edição, inicializa com as imagens existentes
        return espaco.imagens.map((imgPath) => ({
            file: new File([], imgPath, { type: 'image/jpeg' }), // Create a dummy File object for existing images
            preview: `/storage/${imgPath}`,
            path: imgPath, // Armazena o path relativo para enviar na exclusão
        }));
    });
    const [isAddAndarDialogOpen, setIsAddAndarDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormCadastroValues>({
        _method: isEditMode ? 'PUT' : 'POST', // Essencial para o Laravel entender a requisição de update
        nome: espaco?.nome ?? '',
        capacidade_pessoas: espaco?.capacidade_pessoas ?? undefined,
        descricao: espaco?.descricao ?? '',
        imagens: [],
        main_image_index: espaco ? espaco.imagens.findIndex((img) => img === espaco.main_image_index) : 0,
        unidade_id: espaco?.andar?.modulo?.unidade.id ?? undefined,
        modulo_id: espaco?.andar?.modulo?.id ?? undefined,
        andar_id: espaco?.andar?.id ?? undefined,
    });

    useEffect(() => {
        setData((prevData) => ({ ...prevData, unidade_id: unidadeSelecionada }));
        setModuloSelecionado(undefined);
        setData((prevData) => ({ ...prevData, modulo_id: undefined }));
        setAndarSelecionado(undefined);
        setData((prevData) => ({ ...prevData, andar_id: undefined }));
    }, [unidadeSelecionada]);

    const handleSetMainImage = (index: number) => {
        setData((prevData) => ({ ...prevData, main_image_index: index }));
    };
    const handleModuloChange = (value: number) => {
        setModuloSelecionado(value);
        setData((prevData) => ({ ...prevData, modulo_id: value }));
        setAndarSelecionado(undefined);
        setData((prevData) => ({ ...prevData, andar_id: undefined }));
    };

    const handleAndarChange = (value: string) => {
        const andarId = parseInt(value, 10);
        setAndarSelecionado(andarId);
        setData((prevData) => ({ ...prevData, andar_id: andarId }));
    };
    const handleImagesToDelete = (path: string) =>
        setData((prevData) => ({ ...prevData, images_to_delete: [...(data.images_to_delete ?? []), path] }));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = isEditMode ? route('institucional.espacos.update', { espaco: espaco!.id }) : route('institucional.espacos.store');
        console.log(url, data);
        post(url, {
            forceFormData: true, // Garante que a requisição seja multipart/form-data
            onSuccess: () => {
                toast.success(`Espaço ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
                if (!isEditMode) {
                    reset();
                    setImagesWithPreviews([]);
                }
            },
            onError: (errs) => {
                setErros(errs);
                toast.error(Object.values(errs)[0] || 'Ocorreu um erro de validação.');
            },
        });
    };
    const pageTitle = isEditMode ? 'Editar Espaço' : 'Cadastro de Espaço';
    const buttonLabel = isEditMode ? 'Salvar Alterações' : 'Cadastrar Espaço';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />
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
                                    setMainImageIndex={handleSetMainImage}
                                    setData={setData}
                                    setImagesToDelete={handleImagesToDelete}
                                    processing={processing}
                                    errors={errors}
                                />
                                <CardFooter className="flex justify-end p-0">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {buttonLabel}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                    {moduloSelecionado && (
                        <AddAndarDialog erros={errors} moduloSelecionado={moduloSelecionado} setIsDialogOpen={setIsAddAndarDialogOpen} />
                    )}
                </Dialog>
            </div>
        </AppLayout>
    );
}
