import AgendaEspaço from '@/components/agenda-espaco';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Espaco, Reserva } from '@/types';
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
    const { props } = usePage<{ espaco: Espaco; reserva?: Reserva }>();
    const { espaco, reserva } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head />
            <AgendaEspaço isEditMode={reserva != undefined} reserva={reserva} espaco={espaco} />
        </AppLayout>
    );
}
