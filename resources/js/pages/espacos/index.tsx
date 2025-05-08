import AppLayout from '@/layouts/app-layout';
import { Espaco, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todos espaços',
        href: '/espacos',
    },
];

export default function Espacos() {
    const [showModal, setShowModal] = useState(false);
    const [espacoParaExcluir, setEspacoparaExcluir] = useState<Espaco | null>(null);
    const { props } = usePage<{ espacos: Espaco[] }>();
    const espacos = props.espacos;

    const confirmDestroy = (espaco: Espaco) => {
        setEspacoparaExcluir(espaco);
        setShowModal(true);
    };

    const submitDestroy = () => {
        if (!espacoParaExcluir) return;

        router.delete(`/espacos/${espacoParaExcluir.id}`, {
            onSuccess: () => {
                setShowModal(false);
                setEspacoparaExcluir(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espacos" />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Espaços</h1>
                        <button 
                            onClick={() => router.visit('/espacos/create')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Adicionar Espaço
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {espacos.map((espaco) => (
                            <div 
                                key={espaco.id}
                                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div 
                                    onClick={() => router.visit(`/espacos/${espaco.id}`)} 
                                    className="cursor-pointer"
                                >
                                    <div className="mb-1 text-xs font-medium text-gray-500">ID: {espaco.id}</div>
                                    <h2 className="mb-3 text-xl font-semibold text-gray-800">{espaco.nome}</h2>
                                    <p className="text-sm text-gray-600 line-clamp-3">{espaco.descricao}</p>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-end space-x-3">
                                    <button 
                                        onClick={() => router.visit(`/espacos/${espaco.id}/edit`)}
                                        className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => confirmDestroy(espaco)} 
                                        className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de confirmação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Confirmar exclusão</h3>
                        <p className="mb-6 text-gray-600">
                            Tem certeza que deseja excluir permanentemente o espaço <strong className="font-semibold">{espacoParaExcluir?.nome}</strong>?
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