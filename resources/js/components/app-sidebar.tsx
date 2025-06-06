import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Bell, BookOpen, Calendar, LayoutGrid, Star } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Painel Inicial',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Consultar Espaços',
        href: '/espacos',
        icon: Calendar,
    },
    {
        title: 'Notificações',
        href: '/notificacoes',
        icon: Bell,
    },
    {
        title: 'Minhas Reservas',
        href: '/minhas-reservas',
        icon: BookOpen,
    },
    /* {
        title: 'Solicitar Manutenção',
        href: '/manutencao',
        icon: Wrench,
    }, */
    {
        title: 'Espaços Favoritos',
        href: '/favoritos',
        icon: Star,
    },
    {
        title: 'Gerenciar reservas',
        href: '/gestor/reservas',
        icon: Star,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
