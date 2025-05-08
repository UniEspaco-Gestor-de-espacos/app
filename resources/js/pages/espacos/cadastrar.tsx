import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
    {
        title: 'Cadastrar Espaço',
        href: '/espacos/create',
    },
];

export default function CadastrarEspaco() {
    const { data, setData, post, processing, errors } = useForm({
        campus: '',
        modulo: '',
        andar: '',
        nome: '',
        capacidadePessoas: '',
        acessibilidade: false as boolean,
        descricao: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/espacos');
    };

    const handleCancel = () => {
        router.get('/espacos');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cadastrar Espaço" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Cadastrar Novo Espaço</h2>
                            <p className="text-gray-600">Preencha os detalhes do espaço abaixo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Campus */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Campus <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.campus}
                                        onChange={(e) => setData('campus', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.campus ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: Campus Central"
                                    />
                                    {errors.campus && <p className="mt-1 text-sm text-red-600">{errors.campus}</p>}
                                </div>

                                {/* Módulo */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Módulo</label>
                                    <input
                                        type="text"
                                        value={data.modulo}
                                        onChange={(e) => setData('modulo', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.modulo ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: Bloco A"
                                    />
                                    {errors.modulo && <p className="mt-1 text-sm text-red-600">{errors.modulo}</p>}
                                </div>

                                {/* Andar */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Andar</label>
                                    <input
                                        type="text"
                                        value={data.andar}
                                        onChange={(e) => setData('andar', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.andar ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: Térreo, 1º Andar"
                                    />
                                    {errors.andar && <p className="mt-1 text-sm text-red-600">{errors.andar}</p>}
                                </div>

                                {/* Nome */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nome do Espaço <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: Sala de Reuniões 101"
                                    />
                                    {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                                </div>

                                {/* Capacidade de Pessoas */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Capacidade <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.capacidadePessoas}
                                        onChange={(e) => setData('capacidadePessoas', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.capacidadePessoas ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: 20"
                                    />
                                    {errors.capacidadePessoas && <p className="mt-1 text-sm text-red-600">{errors.capacidadePessoas}</p>}
                                </div>

                                {/* Acessibilidade */}
                                <div className="flex items-center">
                                    <div className="flex h-10 items-center">
                                        <input
                                            id="acessibilidade"
                                            type="checkbox"
                                            checked={data.acessibilidade}
                                            onChange={(e) => setData('acessibilidade', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                    <label htmlFor="acessibilidade" className="ml-2 block text-sm text-gray-700">
                                        Espaço acessível para pessoas com deficiência
                                    </label>
                                </div>
                                {errors.acessibilidade && <p className="mt-1 text-sm text-red-600">{errors.acessibilidade}</p>}
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                    className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
                                    rows={4}
                                    placeholder="Descreva as características do espaço..."
                                ></textarea>
                                {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
                            </div>

                            <div className="flex justify-end space-x-3 border-t pt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {processing ? 'Cadastrando...' : 'Cadastrar Espaço'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
