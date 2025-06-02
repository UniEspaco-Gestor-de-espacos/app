import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select as SelectUI,
    SelectContent as SelectUIContent,
    SelectItem as SelectUIItem,
    SelectTrigger as SelectUITrigger,
    SelectValue as SelectUIValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Andar, Modulo, Unidade } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react'; // Importação correta para Inertia
import { Loader2, Plus, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Cadastrar espaço',
        href: '/espacos/create',
    },
];

type FormValues = {
    nome: string;
    capacidade_pessoas: number | undefined;
    descricao: string;
    imagens: File[];
    main_image_index: number | undefined;
    modulo_id: number | undefined;
    unidade_id: number | undefined; // necessario para validar se foi preenchido
    andar_id: number | undefined; // necessario para validar se foi preenchido
    tipo_acesso: string[]; // necessario para validar se foi preenchido
};

// Interface para imagens com preview
interface ImageWithPreview {
    file: File;
    preview: string;
}

export default function CadastroEspacoPage() {
    const tiposDeAcesso = ['terreo', 'escada', 'elevador', 'rampa'];
    const { props } = usePage<{ unidades: Unidade[]; modulos: Modulo[]; andares: Andar[] }>();
    const { unidades, modulos, andares } = props;
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<number | undefined>(undefined);
    const [moduloSelecionado, setModuloSelecionado] = useState<number | undefined>(undefined);
    const [andarSelecionado, setAndarSelecionado] = useState<number | undefined>(undefined);
    const [imagesWithPreviews, setImagesWithPreviews] = useState<ImageWithPreview[]>([]);
    const [isAddAndarDialogOpen, setIsAddAndarDialogOpen] = useState(false);
    const [nomeNovoAndar, setNomeNovoAndar] = useState('');
    const [tipoAcessoNovoAndar, setTipoAcessoNovoAndar] = useState<string[]>([]);

    // Inicializar o formulário com o hook useForm do Inertia
    const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
        nome: '',
        capacidade_pessoas: undefined,
        descricao: '',
        imagens: [],
        main_image_index: undefined,
        unidade_id: undefined,
        modulo_id: undefined,
        andar_id: undefined,
        tipo_acesso: [],
    });

    useEffect(() => {
        setModuloSelecionado(undefined);
        setData('unidade_id', unidadeSelecionada); // Resetar o módulo quando a unidade muda
        setData('modulo_id', undefined); // Resetar o módulo quando a unidade muda
        setData('andar_id', undefined); // Resetar o andar quando a unidade muda
    }, [setData, unidadeSelecionada]);

    // Função para lidar com a mudança de módulo
    const handleModuloChange = (value: number) => {
        setModuloSelecionado(value);
        setData('modulo_id', value);
        setData('andar_id', undefined); // Resetar o andar quando a unidade muda
    };
    // Função para lidar com a mudança de local
    const handleAndarChange = (value: string) => {
        setAndarSelecionado(parseInt(value));
        setData('andar_id', parseInt(value)); // Resetar o andar quando a unidade muda
    };

    // Função para adicionar um novo andar
    const handleAddNovoLocal = () => {
        if (!nomeNovoAndar.trim() || !moduloSelecionado) return;

        router.post(
            '/andar',
            {
                nome: nomeNovoAndar,
                tipo_acesso: tipoAcessoNovoAndar,
                modulo_id: moduloSelecionado,
            },
            {
                onSuccess: () => {
                    setIsAddAndarDialogOpen(false); // Fechar o diálogo
                },
            },
        );
        // Fechar o diálogo e limpar o campo
        setIsAddAndarDialogOpen(false);
    };

    // Função para remover um tipo de acesso
    const handleRemoveTipoAcesso = (tipoId: string) => {
        setData(
            'tipo_acesso',
            data.tipo_acesso.filter((id) => id !== tipoId),
        );
    };

    // Componente personalizado para Select com múltipla seleção
    function Select({ value, onValueChange, disabled }: { value: string[]; onValueChange: (selectedValues: string[]) => void; disabled: boolean }) {
        const [open, setOpen] = useState(false);

        return (
            <div className="relative">
                <div
                    onClick={() => !disabled && setOpen(!open)}
                    className={`border-input bg-background ring-offset-background flex items-center justify-between rounded-md border px-3 py-2 text-sm ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                    <div className="flex flex-wrap gap-1">
                        {value.length > 0 ? (
                            value
                                .filter((tipo: string) => value.includes(tipo))
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
                    <div className="bg-popover absolute z-10 mt-1 w-full rounded-md border shadow-md">
                        <div className="p-1">
                            {tiposDeAcesso.map((tipo) => (
                                <div
                                    key={tipo}
                                    className={`hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-sm px-2 py-1.5 ${value.includes(tipo) ? 'bg-accent/50' : ''}`}
                                    onClick={() => {
                                        if (disabled) return;
                                        const newValue = value.includes(tipo) ? value.filter((v: string) => v !== tipo) : [...value, tipo];
                                        onValueChange(newValue);
                                    }}
                                >
                                    <Checkbox checked={value.includes(tipo)} className="pointer-events-none" />
                                    <span className="text-sm">{tipo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    // Função para lidar com o upload de imagens
    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages: ImageWithPreview[] = [];
        const filesToAdd: File[] = [];

        // Processar cada arquivo
        Array.from(files).forEach((file) => {
            // Verificar o tipo do arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                return;
            }

            // Verificar o tamanho do arquivo (limite de 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`O arquivo ${file.name} excede o tamanho máximo permitido de 5MB.`);
                return;
            }

            // Criar URL para pré-visualização
            const previewUrl = URL.createObjectURL(file);
            newImages.push({ file, preview: previewUrl });
            filesToAdd.push(file);
        });

        // Adicionar as novas imagens à lista existente
        setImagesWithPreviews((prev) => [...prev, ...newImages]);

        // Atualizar o estado do formulário
        const updatedImages = [...data.imagens, ...filesToAdd];
        setData('imagens', updatedImages);

        // Se não houver imagem principal definida e temos imagens, definir a primeira como principal
        if (data.main_image_index === null && updatedImages.length > 0) {
            setData('main_image_index', 0);
        }
    };

    // Função para remover uma imagem
    const handleRemoveImage = (index: number) => {
        // Remover a imagem da lista de previews
        setImagesWithPreviews((prev) => {
            const newPreviews = [...prev];
            // Liberar a URL do objeto para evitar vazamento de memória
            URL.revokeObjectURL(newPreviews[index].preview);
            newPreviews.splice(index, 1);
            return newPreviews;
        });

        // Remover a imagem do estado do formulário
        const updatedImages = data.imagens.filter((_, i) => i !== index);
        setData('imagens', updatedImages);

        // Ajustar o índice da imagem principal se necessário
        if (data.main_image_index !== undefined) {
            if (index === data.main_image_index) {
                // Se a imagem removida era a principal
                setData('main_image_index', updatedImages.length > 0 ? 0 : undefined);
            } else if (index < data.main_image_index) {
                // Se a imagem removida estava antes da principal, ajustar o índice
                setData('main_image_index', data.main_image_index - 1);
            }
        }
    };

    // Função para definir uma imagem como principal
    const setMainImage = (index: number) => {
        setData('main_image_index', index);
    };

    // Função para enviar o formulário
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('espacos.store'), {
            onSuccess: () => {
                // Limpar as URLs de preview para evitar vazamento de memória
                imagesWithPreviews.forEach((img) => URL.revokeObjectURL(img.preview));
                reset();
                setUnidadeSelecionada(undefined);
                setModuloSelecionado(undefined);
                setImagesWithPreviews([]);
                setData('main_image_index', undefined);
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
                                    <SelectUI
                                        value={unidadeSelecionada?.toString()}
                                        onValueChange={(value) => setUnidadeSelecionada(parseInt(value))}
                                        disabled={processing}
                                    >
                                        <SelectUITrigger>
                                            <SelectUIValue placeholder="Selecione uma unidade" />
                                        </SelectUITrigger>
                                        <SelectUIContent>
                                            {unidades.map((unidade) => (
                                                <SelectUIItem key={unidade.id.toString()} value={unidade.id.toString()}>
                                                    {unidade.nome}
                                                </SelectUIItem>
                                            ))}
                                        </SelectUIContent>
                                    </SelectUI>
                                </div>

                                {/* Seleção de Módulo (dependente da unidade) */}
                                <div className="space-y-2">
                                    <label htmlFor="module_id" className="text-sm font-medium">
                                        Módulo
                                    </label>
                                    <SelectUI
                                        value={String(data.modulo_id)}
                                        onValueChange={(value: string) => handleModuloChange(parseInt(value))}
                                        disabled={!unidadeSelecionada || processing}
                                    >
                                        <SelectUITrigger>
                                            <SelectUIValue
                                                placeholder={unidadeSelecionada ? 'Selecione um módulo' : 'Selecione uma unidade primeiro'}
                                            />
                                        </SelectUITrigger>
                                        <SelectUIContent>
                                            {unidadeSelecionada &&
                                                modulos
                                                    .filter((modulo) => modulo.unidade_id == unidadeSelecionada)
                                                    ?.map((modulo) => (
                                                        <SelectUIItem key={String(modulo.id)} value={String(modulo.id)}>
                                                            {modulo.nome}
                                                        </SelectUIItem>
                                                    ))}
                                        </SelectUIContent>
                                    </SelectUI>
                                    {errors.modulo_id && <p className="mt-1 text-sm text-red-500">{errors.modulo_id}</p>}
                                </div>
                            </div>

                            {/* Andar e Tipos de Acesso lado a lado */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Seleção de Andar (dependente do módulo) */}
                                <div className="space-y-2">
                                    <label htmlFor="andar_id" className="text-sm font-medium">
                                        Andar
                                    </label>
                                    <div className="flex gap-2">
                                        <SelectUI
                                            value={String(andarSelecionado)}
                                            onValueChange={handleAndarChange}
                                            disabled={!moduloSelecionado || processing}
                                        >
                                            <SelectUITrigger>
                                                <SelectUIValue
                                                    placeholder={moduloSelecionado ? 'Selecione um andar' : 'Selecione um módulo primeiro'}
                                                />
                                            </SelectUITrigger>
                                            <SelectUIContent>
                                                {andares
                                                    .filter((andar) => andar.modulo_id == moduloSelecionado?.toString())
                                                    .map((andar) => (
                                                        <SelectUIItem key={andar.id.toString()} value={andar.id.toString()}>
                                                            {andar.nome}
                                                        </SelectUIItem>
                                                    ))}
                                            </SelectUIContent>
                                        </SelectUI>

                                        <Dialog open={isAddAndarDialogOpen} onOpenChange={setIsAddAndarDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="icon" disabled={!moduloSelecionado || processing}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Novo Andar</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="novo-andar" className="text-right">
                                                            Nome
                                                        </Label>
                                                        <Input
                                                            id="novo-andar"
                                                            value={nomeNovoAndar}
                                                            onChange={(e) => setNomeNovoAndar(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Ex: 3º Andar, Mezanino"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="text-sm font-medium">Tipos de Acesso</label>
                                                        <div className="mt-2">
                                                            <div className="mb-2 flex flex-wrap gap-2">
                                                                {tipoAcessoNovoAndar.length > 0 ? (
                                                                    tiposDeAcesso
                                                                        .filter((tipo) => data.tipo_acesso.includes(tipo))
                                                                        .map((tipo) => (
                                                                            <Badge
                                                                                key={tipo}
                                                                                variant="secondary"
                                                                                className="flex items-center gap-1 px-3 py-1"
                                                                            >
                                                                                {tipo}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleRemoveTipoAcesso(tipo)}
                                                                                    className="ml-1 rounded-full p-0.5 hover:bg-slate-200"
                                                                                    disabled={processing}
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </button>
                                                                            </Badge>
                                                                        ))
                                                                ) : (
                                                                    <p className="text-muted-foreground text-sm">Selecione o Andar para funcionar</p>
                                                                )}
                                                            </div>

                                                            <div className="relative">
                                                                <Select
                                                                    value={tipoAcessoNovoAndar}
                                                                    onValueChange={(selectedValues: string[]) =>
                                                                        setTipoAcessoNovoAndar(selectedValues)
                                                                    }
                                                                    disabled={processing}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errors.tipo_acesso && <p className="mt-1 text-sm text-red-500">{errors.tipo_acesso}</p>}
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" onClick={handleAddNovoLocal}>
                                                        Adicionar
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {errors.andar_id && <p className="mt-1 text-sm text-red-500">{errors.andar_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipos de Acesso</label>
                                    <div className="mt-2">
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            {andarSelecionado ? (
                                                andares
                                                    .find((andar) => andar.id == andarSelecionado)
                                                    ?.tipo_acesso.map((tipo) => (
                                                        <Badge key={tipo} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                                            {tipo}
                                                        </Badge>
                                                    ))
                                            ) : (
                                                <p className="text-muted-foreground text-sm">Nenhum tipo selecionado</p>
                                            )}
                                        </div>
                                    </div>
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
                                    value={data.nome}
                                    onChange={(e) => setData('nome', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                            </div>

                            {/* Capacidade */}
                            <div className="space-y-2">
                                <label htmlFor="capacityPessoas" className="text-sm font-medium">
                                    Capacidade (pessoas)
                                </label>
                                <Input
                                    id="capacityPessoas"
                                    type="number"
                                    min={1}
                                    value={data.capacidade_pessoas || ''}
                                    onChange={(e) => setData('capacidade_pessoas', e.target.valueAsNumber)}
                                    disabled={processing}
                                />
                                {errors.capacidade_pessoas && <p className="mt-1 text-sm text-red-500">{errors.capacidade_pessoas}</p>}
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
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
                            </div>

                            {/* Upload de Múltiplas Imagens */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="images" className="text-sm font-medium">
                                        Imagens do Espaço
                                    </label>
                                    <Input id="images" type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={processing} />
                                    {errors.imagens && <p className="mt-1 text-sm text-red-500">{errors.imagens}</p>}
                                </div>

                                {/* Galeria de miniaturas */}
                                {imagesWithPreviews.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="mb-2 text-sm font-medium">Imagens selecionadas:</h4>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                            {imagesWithPreviews.map((img, index) => (
                                                <div key={index} className="group relative">
                                                    <div
                                                        className={`aspect-square overflow-hidden rounded-md border ${
                                                            data.main_image_index === index ? 'ring-primary border-primary ring-2' : 'bg-slate-50'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img.preview || '/placeholder.svg'}
                                                            alt={`Imagem ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {data.main_image_index === index && (
                                                            <div className="bg-primary absolute top-0 left-0 rounded-br px-1.5 py-0.5 text-xs text-white">
                                                                Principal
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 flex gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full bg-white shadow-md"
                                                            onClick={() => setMainImage(index)}
                                                            disabled={processing || data.main_image_index === index}
                                                            title="Definir como imagem principal"
                                                        >
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
                                                                className="h-3 w-3 text-amber-500"
                                                            >
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full opacity-90 shadow-md"
                                                            onClick={() => handleRemoveImage(index)}
                                                            disabled={processing}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {imagesWithPreviews.length === 0 && (
                                    <Alert>
                                        <AlertDescription className="text-muted-foreground text-sm">
                                            Adicione imagens do espaço para facilitar a identificação. Formatos aceitos: JPG, PNG, GIF. Tamanho
                                            máximo: 5MB por imagem.
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
