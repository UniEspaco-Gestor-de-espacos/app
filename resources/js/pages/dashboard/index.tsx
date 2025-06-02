import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AdminDashboard } from './admin';
import { ManagerDashboard } from './gestor';
import { UserDashboard } from './usuario';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '🏠 Painel Inicial',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { props } = usePage<{ user: User }>();
    const { user } = props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {user.permission_type_id === 3 && <UserDashboard />}
                {user.permission_type_id === 2 && <ManagerDashboard />}
                {user.permission_type_id === 1 && <AdminDashboard />}

            </div>
        </AppLayout>
    );
}
