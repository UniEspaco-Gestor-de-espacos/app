//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Espaco, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cadastrar Espaco',
        href: '/cadastrar-espaco',
    },
];

export default function EditarEspaco() {
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('espacos.update', espaco.id)); // ou sua rota exata para store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espacos" />
            {/*<div className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white p-4 shadow">*/}
            <h2 className="text-2xl font-bold text-gray-800">Cadastrar Espaço</h2>

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
                    Cadastrar
                </button>
            </form>
            {/* </div> */}
        </AppLayout>
    );
}
