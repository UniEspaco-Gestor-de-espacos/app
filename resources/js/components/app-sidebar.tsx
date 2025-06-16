/* AppSidebar.tsx -------------------------------------------------------- */
import { Link, usePage } from '@inertiajs/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import AppLogo from './app-logo';

import { PermissionId } from '@/constants/permissions';

/* Ícones ---------------------------------------------------------------- */
import {
  LayoutGrid,
  Calendar,
  Bell,
  BookOpen,
  Wrench,
  Star,
  Building,
  Users,
  List,
  Library,
  ShieldCheck,
  ClipboardList,
  Settings,
  Eye,
} from 'lucide-react';

/* ------------- Tipo local de item de menu (não exportado) ------------- */
import type { LucideIcon } from 'lucide-react';

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

/* ----------------- Itens de navegação (agrupados) ---------------------- */
const commonNav: MenuItem[] = [
  { title: 'Painel Inicial',        href: '/dashboard',        icon: LayoutGrid },
  { title: 'Consultar Espaços',     href: '/espacos',          icon: Calendar   },
  { title: 'Notificações',          href: '/notificacoes',     icon: Bell       },
  { title: 'Minhas Reservas',       href: '/minhas-reservas',  icon: BookOpen   },
  { title: 'Solicitar Manutenção',  href: '/manutencao',       icon: Wrench     },
  { title: 'Espaços Favoritos',     href: '/favoritos',        icon: Star       },
];

const gestorExtras: MenuItem[] = [
  { title: 'Consultar Serviços',           href: '/servico',             icon: ClipboardList },
  { title: 'Alterar Status de Manutenção', href: '/servico/status',      icon: Settings      },
  { title: 'Visualizar Ocorrências',       href: '/servico/ocorrencias', icon: Eye          },
];

const institucionalExtras: MenuItem[] = [
  { title: 'Cadastrar Espaços',                 href: '/admin/espacos/novo',      icon: Building    },
  { title: 'Cadastrar Professores / Setores',   href: '/admin/professores/novo',  icon: Users       },
  { title: 'Listar Professores / Setores / Gestores', href: '/admin/professores', icon: List        },
  { title: 'Listar Todos os Espaços',           href: '/admin/espacos',           icon: Library     },
  { title: 'Gerenciar Permissões',              href: '/admin/permissoes',        icon: ShieldCheck },
];

/* Rotulagem da seção extra --------------------------------------------- */
const roleLabels: Record<PermissionId, string> = {
  [PermissionId.COMUM]:         'Menu',
  [PermissionId.GESTOR]:        'Gestor de Serviço',
  [PermissionId.INSTITUCIONAL]: 'Master (Administrador)',
};

/* Mapeia ID → itens extras --------------------------------------------- */
const roleExtrasMap: Record<PermissionId, MenuItem[]> = {
  [PermissionId.COMUM]:         [],
  [PermissionId.GESTOR]:        gestorExtras,
  [PermissionId.INSTITUCIONAL]: institucionalExtras,
};

/* --------------------------- Componente -------------------------------- */
export function AppSidebar() {
  const { props } = usePage<{ auth: { user: { permission_type_id: number } } }>();
  const permissionId =
    (props.auth.user?.permission_type_id as PermissionId) ?? PermissionId.COMUM;

  const extraItems = roleExtrasMap[permissionId];
  const label      = roleLabels[permissionId];

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
        <NavMain items={commonNav} />

        {/* Seção do cargo */}
        {extraItems.length > 0 && (
          <div className="my-2 border-t pt-2">
            <span className="block px-4 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
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
