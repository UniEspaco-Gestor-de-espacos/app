//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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
    const [espacoParaExcluir, setEspacoparaExcluir] = useState<Espaco | null>();
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

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Espaços</h1>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {espacos.map((espaco) => (
                            <div className="rounded-2xl border bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-lg">
                                <div onClick={() => router.visit(`/espacos/${espaco.id}`)} key={espaco.id}>
                                    <div className="mb-2 text-sm text-gray-500">ID: {espaco.id}</div>
                                    <h2 className="mb-2 text-xl font-semibold text-gray-800">{espaco.nome}</h2>
                                    <p className="text-sm text-gray-600">{espaco.descricao}</p>
                                </div>
                                <button type="button" onClick={() => router.visit(`espacos/${espaco.id}/edit`)}>
                                    Editar
                                </button>
                                <button onClick={() => confirmDestroy(espaco)} className="text-red-500 hover:underline">
                                    Deletar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* modal de confirmação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                    <div className="rounded-2xl border bg-white p-6 text-center shadow-lg transition-shadow duration-300">
                        <p>
                            Tem certeza que deseja excluir o espaço <strong>{espacoParaExcluir?.nome}</strong>?
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button onClick={submitDestroy} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                                Sim, excluir
                            </button>
                            <button onClick={() => setShowModal(false)} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
