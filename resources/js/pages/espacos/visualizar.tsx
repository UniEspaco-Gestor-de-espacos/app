import AgendaEspaço from '@/components/agenda-espaco';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Espaco } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espaços',
        href: '/espacos',
    },
    {
        title: 'Visualizar agenda',
        href: '/espaço/agenda',
    },
];

export default function VisualizarEspaço() {
    const { props } = usePage<{ espaco: Espaco }>();
    const { espaco } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head />
            <AgendaEspaço espaco={espaco} />
        </AppLayout>
    );
}
