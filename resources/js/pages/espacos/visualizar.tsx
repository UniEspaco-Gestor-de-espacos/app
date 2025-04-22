//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Espaco, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espacos',
        href: '/espacos',
    },
];

export default function VisualizarEspaco() {
    const { props } = usePage<{ espaco: Espaco }>();
    const espaco = props.espaco;
    breadcrumbs[0].title = `Nome: ${espaco.nome}, Campus: ${espaco.campus}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Espaco id: ${espaco.id}`} />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Espaço</h1>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div key={espaco.id} className="rounded-2xl border bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-lg">
                            <div className="mb-2 text-sm text-gray-500">ID: {espaco.id}</div>
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">{espaco.nome}</h2>
                            <p className="text-sm text-gray-600">{espaco.descricao}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
