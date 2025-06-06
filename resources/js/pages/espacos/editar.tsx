import AppLayout from '@/layouts/app-layout';
import { Espaco, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
    {
        title: 'Editar Espaço',
        href: '#',
    },
];

export default function EditarEspaco() {
    const [showModal, setShowModal] = useState(false);
    const { props } = usePage<{ espaco: Espaco }>();
    const espaco = props.espaco;

    const { data, setData, put, processing, errors } = useForm({
        modulo: espaco.modulo_id|| '',
        nome: espaco.nome || '',
        capacidadePessoas: espaco.capacidadePessoas || '',
        acessibilidade: espaco.acessibilidade || false,
        descricao: espaco.descricao || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('espacos.update', espaco.id));
    };

    const confirmDestroy = () => {
        setShowModal(true);
    };

    const submitDestroy = () => {
        router.delete(`/espacos/${espaco.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${espaco.nome}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between border-b pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Editar Espaço</h2>
                                <p className="text-gray-600">Atualize as informações do espaço</p>
                            </div>
                            <button
                                onClick={confirmDestroy}
                                className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                            >
                                Excluir Espaço
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                                    />
                                    {errors.andar && <p className="mt-1 text-sm text-red-600">{errors.andar}</p>}
                                </div>

                                {/* Nome */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nome <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                                </div>

                                {/* Capacidade */}
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
                                        Acessível para PCD
                                    </label>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                    className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
                                    rows={4}
                                ></textarea>
                                {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
                            </div>

                            <div className="flex justify-end space-x-3 border-t pt-6">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/espacos')}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {processing ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Confirmar Exclusão</h3>
                        <p className="mb-6 text-gray-600">
                            Tem certeza que deseja excluir permanentemente o espaço <strong className="font-semibold">{espaco.nome}</strong>?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitDestroy}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Confirmar Exclusão
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
