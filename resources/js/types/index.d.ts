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
    instituicao?: Instituicao; // Relação aninhada
}

export interface Setor {
    id: number;
    nome: string;
    sigla: string;
    unidade?: Unidade; // Relação aninhada
}

export interface Modulo {
    id: number;
    nome: string;
    unidade?: Unidade; // Relação aninhada
}

export interface Andar {
    id: number;
    nome: string;
    tipo_acesso: [];
    modulo?: Modulo; // Relação aninhada
}

export interface Espaco {
    id: number;
    nome: string;
    capacidade_pessoas: number;
    descricao: string;
    imagens: string[];
    main_image_index: string | null;
    andar?: Andar; // Relação aninhada
    agendas?: Agenda[];
}

// =============================================================================
// 3. TIPOS DO SISTEMA DE RESERVAS (MODELOS E LÓGICA)
// O coração do sistema: Reservas, Horários, Agendas e seus status.
// =============================================================================

/**
 * Representa os possíveis status de uma reserva ou de um horário.
 * Adicionado 'parcialmente_deferido' para o status geral da reserva.
 */
export type SituacaoReserva = 'em_analise' | 'indeferida' | 'parcialmente_deferida' | 'deferida' | 'inativa';

/**
 * Dados da tabela pivô `reserva_horario`, crucial para o status individual.|
 */
export interface Pivot {
    reserva_id: number;
    horario_id: number;
    situacao: 'em_analise' | 'indeferida' | 'deferida' | 'inativa';
}

/**
 * Modelo de Agenda, que define turnos e gestores para um Espaço.
 */
export interface Agenda {
    id: number;
    turno: 'manha' | 'tarde' | 'noite';
    espaco?: Espaco; // Relação aninhada
    user?: User; // Relação com o gestor da agenda
    horarios?: Horario[];
}

/**
 * Modelo de Horário. Contém a referência para a Agenda e os dados da tabela pivô.
 */
export interface Horario {
    id: number;
    data: string; // Datas do Laravel chegam como strings no JSON
    horario_inicio: string;
    horario_fim: string;
    agenda?: Agenda; // Relação aninhada
    reservas?: Reserva[];
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
    data_inicial: Date;
    data_final: Date;
    recorrencia: ValorOcorrenciaType; // Tipo de recorrência da reserva
    observacao: string | null;
    created_at: string;
    updated_at: string;
    user?: User; // O usuário que fez a reserva (carregar com with('usuario'))
    horarios: Horario[]; // O array de horários pertencentes a esta reserva
}

// =============================================================================
// 4. TIPOS PARA FORMULÁRIOS E DADOS DE PÁGINAS ESPECÍFICAS
// Tipos auxiliares usados em formulários, dashboards, etc.
// =============================================================================

/**
 * Tipo para o formulário de criação/edição de uma reserva.
 */
export interface ReservaFormData {
    titulo: string;
    descricao: string;
    data_inicial: Date | null;
    data_final: Date | null;
    recorrencia: ValorOcorrenciaType; // Tipo de recorrência selecionada
    horarios_solicitados: Partial<Horario>[]; // Horários que o usuário seleciona
    [key: string]: any;
}

/**
 * Tipo para o painel de controle que mostra o resumo dos status.
 */
export type DashboardStatusReservasType = {
    em_analise: number;
    deferida: number;
    indeferida: number;
};

// =============================================================================
// 5. Tipoas para "View Model"
// Tipos auxiliares usados em construção da interface de usuario, dashboards, etc.
// =============================================================================

export interface SlotCalendario {
    id: string; // ID único gerado para o frontend (ex: "2025-06-13|09:00:00")
    status: 'livre' | 'reservado' | 'selecionado';
    data: Date;
    horario_inicio: string;
    horario_fim: string;

    // Se o status for 'reservado', conterá os dados originais do backend.
    dadosReserva?: {
        horarioDB: Horario; // O objeto Horario original do banco
        autor: string;
        reserva_titulo: string;
    };

    // Se o status for 'livre', conterá o ID da agenda para criar uma nova reserva.
    agenda_id?: number;
}

export interface OpcoesRecorrencia {
    valor: ValorOcorrenciaType;
    label: string;
    descricao: string;
    calcularDataFinal: (dataInicial: Date) => Date;
}

export type ValorOcorrenciaType = 'unica' | '15dias' | '1mes' | 'personalizado';




// Define a estrutura de um único link da paginação do Laravel
interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Define a estrutura completa do objeto paginador do Laravel
// O <T> o torna genérico, para que possamos usá-lo para Reservas, Espaços, etc.
interface Paginator<T> {
    data: T[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    path: string;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface ImageWithPreview {
    preview: string; // URL para visualização (blob: ou /storage/...)
    file?: File;      // Objeto File para novas imagens
    path?: string;    // Path relativo para imagens existentes
}

export type AgendaGestoresPorTurnoType = Record<string, { nome: string; email: string; departamento: string; agenda_id: number }>;

export type AgendaDiasSemanaType = {
    data: Date;
    nome: string;
    abreviado: string;
    diaMes: string;
    valor: string;
    ehHoje: boolean;
}

export type AgendaSlotsPorTurnoType = {
    manha: Record<string, SlotCalendario[]>;
    tarde: Record<string, SlotCalendario[]>;
    noite: Record<string, SlotCalendario[]>;
}
