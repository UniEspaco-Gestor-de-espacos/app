import AgendaEspaço from '@/components/agenda-espaco';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Espaco, Reserva } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function VisualizarEspaço() {
    const { props } = usePage<{ espaco: Espaco; reserva?: Reserva; isEditMode?: boolean }>();
    const { espaco, reserva, isEditMode } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isEditMode ? 'Reservas' : 'Espaços',
            href: isEditMode ? '/reservas' : '/espacos',
        },
        {
            title: isEditMode ? 'Editar' : 'Visualizar agenda',
            href: isEditMode ? `reservas/${reserva?.id}/edit` : '/espaço/agenda',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head />
            <AgendaEspaço isEditMode={reserva != undefined} reserva={reserva} espaco={espaco} />
        </AppLayout>
    );
}
