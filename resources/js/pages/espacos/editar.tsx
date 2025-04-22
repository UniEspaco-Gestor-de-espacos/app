//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Espaco, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cadastrar Espaco',
        href: '/cadastrar-espaco',
    },
];

export default function EditarEspaco() {
    const [showModal, setShowModal] = useState(false);
    const [espacoParaExcluir, setEspacoparaExcluir] = useState<Espaco | null>();
    const { props } = usePage<{ espaco: Espaco }>();
    const espaco = props.espaco;
    const { data, setData, put, processing, errors } = useForm({
        campus: espaco.campus,
        modulo: espaco.modulo,
        andar: espaco.andar,
        nome: espaco.nome,
        capacidadePessoas: espaco.capacidadePessoas,
        acessibilidade: espaco.acessibilidade,
        descricao: espaco.descricao,
    });

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('espacos.update', espaco.id)); // ou sua rota exata para store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espacos" />
            <h2 className="text-2xl font-bold text-gray-800">Cadastrar Espaço</h2>
            <button onClick={() => confirmDestroy(espaco)} className="text-red-500 hover:underline">
                                    Deletar
                                </button>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campus */}
                <div>
                    <label className="block text-sm font-medium">Campus</label>
                    <input
                        type="text"
                        value={data.campus}
                        onChange={(e) => setData('campus', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.campus && <div className="text-sm text-red-500">{errors.campus}</div>}
                </div>

                {/* Módulo */}
                <div>
                    <label className="block text-sm font-medium">Módulo</label>
                    <input
                        type="text"
                        value={data.modulo}
                        onChange={(e) => setData('modulo', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.modulo && <div className="text-sm text-red-500">{errors.modulo}</div>}
                </div>

                {/* Andar */}
                <div>
                    <label className="block text-sm font-medium">Andar</label>
                    <input type="text" value={data.andar} onChange={(e) => setData('andar', e.target.value)} className="w-full rounded border p-2" />
                    {errors.andar && <div className="text-sm text-red-500">{errors.andar}</div>}
                </div>

                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium">Nome</label>
                    <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)} className="w-full rounded border p-2" />
                    {errors.nome && <div className="text-sm text-red-500">{errors.nome}</div>}
                </div>

                {/* Capacidade de Pessoas */}
                <div>
                    <label className="block text-sm font-medium">Capacidade de Pessoas</label>
                    <input
                        type="number"
                        value={data.capacidadePessoas}
                        onChange={(e) => setData('capacidadePessoas', Number.parseInt(e.target.value))}
                        className="w-full rounded border p-2"
                    />
                    {errors.capacidadePessoas && <div className="text-sm text-red-500">{errors.capacidadePessoas}</div>}
                </div>

                {/* Acessibilidade */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={data.acessibilidade} onChange={(e) => setData('acessibilidade', e.target.checked)} />
                    <label>Acessível?</label>
                </div>
                {errors.acessibilidade && <div className="text-sm text-red-500">{errors.acessibilidade}</div>}

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-medium">Descrição</label>
                    <textarea
                        value={data.descricao}
                        onChange={(e) => setData('descricao', e.target.value)}
                        className="w-full rounded border p-2"
                        rows={3}
                    ></textarea>
                    {errors.descricao && <div className="text-sm text-red-500">{errors.descricao}</div>}
                </div>

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Atualizar
                </button>
            </form>
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
            )}{' '}
        </AppLayout>
    );
}
