import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

// =============================================================================
// 1. TIPOS GERAIS DA APLICAÇÃO E AUTENTICAÇÃO
// Definições básicas para usuário, autenticação, mensagens e navegação.
// =============================================================================

/**
 * Dados compartilhados pelo Inertia em todas as páginas.
 */
export interface SharedData {
    auth: Auth;
    ziggy: Config & { location: string };
    flash: FlashMessages;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

/**
 * Estrutura do objeto de autenticação.
 */
export interface Auth {
    user: User;
}

/**
 * Modelo de Usuário, conforme o banco de dados.
 */
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    telefone: string;
    profile_pic?: string;
    permission_type_id: number;
    setor_id: number;
    setor?: Setor; // Opcional, carregar com with('setor')
    created_at: string;
    updated_at: string;
}

/**
 * Mensagens de feedback (success, error) enviadas pelo backend.
 */
export interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

/**
 * Itens de navegação para a sidebar ou menus.
 */
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

/**
 * Grupo de itens de navegação.
 */
export interface NavGroup {
    title: string;
    items: NavItem[];
}

/**
 * Item para breadcrumbs de navegação.
 */
export interface BreadcrumbItem {
    title: string;
    href: string;
}

// =============================================================================
// 2. TIPOS DA HIERARQUIA DE LOCALIZAÇÃO (MODELOS DO LARAVEL)
// Estrutura física da instituição, em ordem hierárquica.
// =============================================================================

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
    instituicao?: Instituicao; // Relação aninhada
}

export interface Setor {
    id: number;
    nome: string;
    sigla: string;
    unidade_id: number;
    unidade?: Unidade; // Relação aninhada
}

export interface Modulo {
    id: number;
    nome: string;
    unidade_id: number;
    unidade?: Unidade; // Relação aninhada
}

export interface Andar {
    id: number;
    nome: string;
    tipo_acesso: [];
    modulo_id: string;
    modulo?: Modulo; // Relação aninhada
}

export interface Espaco {
    id: number;
    nome: string;
    capacidade_pessoas: number;
    descricao: string;
    imagens: string[];
    main_image_index: number;
    andar_id: number;
    andar?: Andar; // Relação aninhada
}

// =============================================================================
// 3. TIPOS DO SISTEMA DE RESERVAS (MODELOS E LÓGICA)
// O coração do sistema: Reservas, Horários, Agendas e seus status.
// =============================================================================

/**
 * Representa os possíveis status de uma reserva ou de um horário.
 * Adicionado 'parcialmente_deferido' para o status geral da reserva.
 */
export type SituacaoReserva = 'em_analise' | 'deferida' | 'indeferida' | 'parcialmente_deferido';

/**
 * Dados da tabela pivô `reserva_horario`, crucial para o status individual.
 */
export interface Pivot {
    reserva_id: number;
    horario_id: number;
    situacao: 'em_analise' | 'deferido' | 'indeferido';
}

/**
 * Modelo de Agenda, que define turnos e gestores para um Espaço.
 */
export interface Agenda {
    id: number;
    turno: 'manha' | 'tarde' | 'noite';
    espaco_id: number;
    user_id: number;
    espaco?: Espaco; // Relação aninhada
    user?: User; // Relação com o gestor da agenda
}

/**
 * Modelo de Horário. Contém a referência para a Agenda e os dados da tabela pivô.
 */
export interface Horario {
    id: number;
    data: string; // Datas do Laravel chegam como strings no JSON
    horario_inicio: string;
    horario_fim: string;
    dia: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
    agenda_id: number;
    agenda?: Agenda; // Relação aninhada
    pivot?: Pivot; // Dados da tabela pivô `reserva_horario`
}

/**
 * Modelo de Reserva. Esta é a estrutura principal que será usada nas páginas
 * 'minhasReservas' e 'gerenciarReservas', contendo todas as relações aninhadas.
 */
export interface Reserva {
    id: number;
    titulo: string;
    descricao: string;
    situacao: SituacaoReserva; // O status geral da reserva
    data_inicial: string;
    data_final: string;
    observacao: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    usuario?: User; // O usuário que fez a reserva (carregar com with('usuario'))
    horarios: Horario[]; // O array de horários pertencentes a esta reserva
}

// =============================================================================
// 4. TIPOS PARA FORMULÁRIOS E DADOS DE PÁGINAS ESPECÍFICAS
// Tipos auxiliares usados em formulários, dashboards, etc.
// =============================================================================

/**
 * Tipo para o formulário de criação/edição de uma reserva.
 */
export type ReservaFormData = {
    titulo: string;
    descricao: string;
    data_inicial: Date | null;
    data_final: Date | null;
    // user_id é pego no backend
    horarios_solicitados: Partial<Horario>[]; // Horários que o usuário seleciona
};

/**
 * Tipo para o painel de controle que mostra o resumo dos status.
 */
export type DashboardStatusReservasType = {
    em_analise: number;
    deferida: number;
    indeferida: number;
};

// ... outros tipos específicos de componentes podem ser adicionados aqui.
