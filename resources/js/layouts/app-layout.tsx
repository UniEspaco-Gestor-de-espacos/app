import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { FlashMessages, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<{ flash: FlashMessages }>().props;

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {/* Notificação */}
            {flash.success && <div className="mb-4 rounded bg-green-500 p-4 text-white shadow">{flash.success}</div>}

            {flash.error && <div className="mb-4 rounded bg-red-500 p-4 text-white shadow">{flash.error}</div>}
            {children}
        </AppLayoutTemplate>
    );
};
