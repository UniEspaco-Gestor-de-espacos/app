import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { PermissionId } from '@/constants/permissions';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

/* Ícones ---------------------------------------------------------------- */
import { Bell, BookOpen, Building, Calendar, Eye, LayoutGrid, Star, Users } from 'lucide-react';

// Adicione 'Users' para um ícone mais adequado

/* ------------- Tipo local de item de menu (não exportado) ------------- */
import type { LucideIcon } from 'lucide-react';

type MenuItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

/* ----------------- Itens de navegação (agrupados) ---------------------- */
const commonNav: MenuItem[] = [
    { title: 'Painel Inicial', href: '/dashboard', icon: LayoutGrid },
    { title: 'Consultar Espaços', href: '/espacos', icon: Calendar },
    { title: 'Notificações', href: '/notificacoes', icon: Bell },
    { title: 'Minhas Reservas', href: '/minhas-reservas', icon: BookOpen },
    { title: 'Espaços Favoritos', href: '/favoritos', icon: Star },
];

const gestorExtras: MenuItem[] = [
    { title: 'Gerir Reservas', href: '/gestor/reservas', icon: Eye },
    { title: 'Gerir Espacos', href: '/gestor/espacos', icon: Star },
];

const institucionalExtras: MenuItem[] = [
    { title: 'Cadastrar Espaços', href: '/institucional/espacos/create', icon: Building },
    { title: 'Gerenciar Usuários', href: '/institucional/usuarios', icon: Users }, // Ícone 'Users' é mais adequado para gerenciamento de usuários
];

/* Rotulagem da seção extra --------------------------------------------- */
const roleLabels: Record<PermissionId, string> = {
    [PermissionId.COMUM]: 'Menu',
    [PermissionId.GESTOR]: 'Gestor de Serviço',
    [PermissionId.INSTITUCIONAL]: 'Master (Administrador)',
};

/* Mapeia ID → itens extras --------------------------------------------- */
const roleExtrasMap: Record<PermissionId, MenuItem[]> = {
    [PermissionId.COMUM]: [],
    [PermissionId.GESTOR]: gestorExtras,
    [PermissionId.INSTITUCIONAL]: institucionalExtras,
};

/* --------------------------- Componente -------------------------------- */
export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { permission_type_id: number } } }>();
    const permissionId = (props.auth.user?.permission_type_id as PermissionId) ?? PermissionId.COMUM;

    const extraItems = roleExtrasMap[permissionId];
    const label = roleLabels[permissionId];

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Cabeçalho ------------------------------------------------------- */}
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

            {/* Conteúdo -------------------------------------------------------- */}
            <SidebarContent>
                {/* Itens comuns */}
                {<NavMain items={commonNav} />}

                {/* Seção do cargo */}
                {extraItems.length > 0 && (
                    <div className="my-2 border-t pt-2">
                        <span className="text-muted-foreground block px-4 pb-1 text-xs font-semibold tracking-wide uppercase">{label}</span>
                        <NavMain items={extraItems} />
                    </div>
                )}
            </SidebarContent>

            {/* Rodapé ---------------------------------------------------------- */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
