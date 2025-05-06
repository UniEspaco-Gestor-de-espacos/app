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
                {(user.tipo_usuario === 'aluno' || user.tipo_usuario === 'externo') && <UserDashboard />}
                {(user.tipo_usuario === 'setor' || user.tipo_usuario === 'professor') && user.is_gestor && <ManagerDashboard />}
                {user.tipo_usuario === 'master' && <AdminDashboard />}
            </div>
        </AppLayout>
    );
}
