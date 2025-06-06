import AppLayout from '@/layouts/app-layout';
import { ReservaHorarios, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Suspense } from 'react';
import { ReservasEmpty } from './fragments/reservasEmpty';
import { ReservasFilters } from './fragments/reservasFilters';
import { ReservasHeader } from './fragments/reservasHeader';
import { ReservasList } from './fragments/reservasList';
import { ReservasLoading } from './fragments/reservasLoading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Minhas Reservas',
        href: '/reservas',
    },
];

export default function MinhasReservas() {
    const { props } = usePage<{ user: User; reservas: ReservaHorarios[] }>();
    const { reservas } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <ReservasHeader />
                    <ReservasFilters />
                    <Suspense fallback={<ReservasLoading />}>
                        <ReservasList fallback={<ReservasEmpty />} reservas={reservas} />
                    </Suspense>
                </div>
            </div>
        </AppLayout>
    );
}
