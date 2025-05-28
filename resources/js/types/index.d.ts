import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    telefone: string;
    profile_pic?: string;
    permission_type_id: number;
    setor_id: number;
    created_at: string;
    updated_at: string;
}
export type TipoUsuario = 'setor' | 'professor' | 'aluno' | 'externo';
export interface Espaco {
    id: number;
    nome: string;
    capacidade_pessoas: number;
    descricao: string;
    imagens: [];
    main_image_index: string;
    modulo_id: number;
}

export interface Agenda {
    id: number;
    turno: 'manha' | 'tarde' | 'noite';
    espaco_id: string;
    user_id: string;
}
export interface Instituicao {
    id: number;
    nome: string;
    sigla: string;
    endereco: string;
}

export interface Unidade {
    id: number;
    nome: string;
    sigla: string;
    instituicao_id: number;
}

export interface Setor {
    id: number;
    nome: string;
    sigla: string;
    unidade_id: number;
}

export interface Modulo {
    id: number;
    nome: string;
    unidade_id: number;
}

export interface Andar {
    id: number;
    nome: string;
    tipo_acesso: [];
    modulo_id: string;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}
