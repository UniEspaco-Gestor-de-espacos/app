import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';

interface Unidade {
    id: number;
    nome: string;
    instituicao_id?: { id: number; nome: string };
}

interface Modulo {
    id: number;
    nome: string;
    unidade?: Unidade;
}

interface Andar {
    id: number;
    nome: string;
    modulo?: Modulo;
    modulo_id?: number;
}

interface Espaco {
    id: number;
    nome: string;
    descricao?: string;
    endereco?: string;
    capacidade_pessoas?: number;
    andar?: Andar;
    andar_id?: number;
}

interface User {
    id?: number;
    name: string;
    email: string;
    role: string;
    permission_type_id: number;
    space_id?: number | null;
    turnos?: string[];
    agendas?: string[];
}

interface PageProps {
    users?: User[];
    roles?: string[];
    spaces?: Espaco[];
    modulos?: Modulo[];
    andares?: Andar[];
    errors?: Record<string, string>;
    turnos?: string[];
    agendas?: string[];
    [key: string]: unknown;
}

function getPermissionName(id: number): string {
    switch (id) {
        case 1:
            return 'Institucional';
        case 2:
            return 'Gestor';
        case 3:
            return 'Comum';
        default:
            return 'Desconhecido';
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuários',
        href: '/usuarios',
    },
];

export default function GerenciarUsuarios() {
    const page = usePage<PageProps>().props;

    const users = page.users ?? [];
    const spaces = page.spaces ?? [];
    const modulos = page.modulos ?? [];
    const andares = page.andares ?? [];
    const turnos = page.turnos ?? [];
    const agendas = page.agendas ?? [];
    const serverErrors = useMemo(() => page.errors ?? {}, [page.errors]);

    const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);
    const [filtroEspaco, setFiltroEspaco] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [espacoDetalhes, setEspacoDetalhes] = useState<Espaco | null>(null);

    // Filtros para módulo e andar
    const [moduloSelecionado, setModuloSelecionado] = useState<string>('');
    const [andarSelecionado, setAndarSelecionado] = useState<string>('');

    // Filtra andares pelo módulo selecionado
    const andaresFiltrados = moduloSelecionado
        ? andares.filter((a) => String(a.modulo_id ?? a.modulo?.id) === moduloSelecionado)
        : andares;

    // Filtra espaços pelo andar selecionado
    const espacosFiltrados = andarSelecionado
        ? spaces.filter((e) => String(e.andar_id ?? e.andar?.id) === andarSelecionado)
        : spaces;

    const usuariosFiltrados = filtroEspaco ? users.filter((u) => String(u.space_id) === filtroEspaco) : users;

    const { data, setData, post, patch, processing, reset } = useForm({
        name: '',
        email: '',
        role: '',
        permission_type_id: '',
        space_id: '',
        turnos: [] as string[],
        agendas: [] as string[],
    });

    useEffect(() => {
        if (userBeingEdited) {
            setData({
                name: userBeingEdited.name ?? '',
                email: userBeingEdited.email ?? '',
                role: userBeingEdited.role ?? '',
                permission_type_id: String(userBeingEdited.permission_type_id ?? ''),
                space_id: userBeingEdited.space_id ? String(userBeingEdited.space_id) : '',
                turnos: userBeingEdited.turnos ?? [],
                agendas: userBeingEdited.agendas ?? [],
            });
        } else {
            reset();
        }
        setErrors({});
    }, [userBeingEdited, setData, reset]);

    useEffect(() => {
        setErrors(serverErrors);
    }, [serverErrors]);

    // Buscar detalhes do espaço ao selecionar
    useEffect(() => {
        if (data.permission_type_id === '2' && data.space_id) {
            fetch(`/api/espacos/${data.space_id}`)
                .then((res) => res.json())
                .then((dados) => setEspacoDetalhes(dados))
                .catch(() => setEspacoDetalhes(null));
        } else {
            setEspacoDetalhes(null);
        }
    }, [data.permission_type_id, data.space_id]);

    const validate = () => {
        const validationErrors: Record<string, string> = {};
        if (!data.name) validationErrors.name = 'O nome é obrigatório.';
        if (!data.email) validationErrors.email = 'O email é obrigatório.';
        if (!data.role) validationErrors.role = 'A função é obrigatória.';
        if (!data.permission_type_id) validationErrors.permission_type_id = 'A permissão é obrigatória.';
        if (data.permission_type_id === '2' && !data.space_id) {
            validationErrors.space_id = 'O espaço é obrigatório para gestores.';
        }
        return validationErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        if (userBeingEdited?.id) {
            patch(route('usuario.update', userBeingEdited.id));
        } else {
            post(route('usuario.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-5xl space-y-8 p-2 lg:p-4">
                <h1 className="text-2xl font-bold">Usuários</h1>

                {!userBeingEdited && (
                    <Button
                        onClick={() =>
                            setUserBeingEdited({
                                id: undefined,
                                name: '',
                                email: '',
                                role: '',
                                permission_type_id: 0,
                                space_id: null,
                                turnos: [],
                                agendas: [],
                            })
                        }
                    >
                        Criar Novo Usuário
                    </Button>
                )}

                {!userBeingEdited && (
                    <>
                        <div className="mb-4">
                            <label>Filtrar por espaço:</label>
                            <select value={filtroEspaco} onChange={(e) => setFiltroEspaco(e.target.value)} className="ml-2 rounded border p-1">
                                <option value="">Todos</option>
                                {spaces.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-3 text-left">Nome</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Permissão</th>
                                        <th className="p-3 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.length > 0 ? (
                                        usuariosFiltrados.map((u) => (
                                            <tr key={u.id} className="hover:bg-muted/50 border-t">
                                                <td className="p-3">{u.name}</td>
                                                <td className="p-3">{u.email}</td>
                                                <td className="p-3">
                                                    <span className="bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                        {getPermissionName(u.permission_type_id)}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button onClick={() => setUserBeingEdited(u)} className="text-primary font-medium underline">
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center">
                                                Nenhum usuário encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {userBeingEdited && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block">Nome</label>
                            <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label className="mb-1 block">Email</label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label className="mb-1 block">Permissão</label>
                            <select
                                value={data.permission_type_id}
                                onChange={(e) => setData('permission_type_id', e.target.value)}
                                required
                                className="w-full rounded border p-2"
                            >
                                <option value="1">Institucional</option>
                                <option value="2">Gestor</option>
                                <option value="3">Comum</option>
                            </select>
                            <InputError message={errors.permission_type_id} />
                        </div>

                        {data.permission_type_id === '2' && (
                            <>
                                <div>
                                    <label className="mb-1 block">Módulo</label>
                                    <select
                                        value={moduloSelecionado}
                                        onChange={(e) => {
                                            setModuloSelecionado(e.target.value);
                                            setAndarSelecionado('');
                                            setData('space_id', '');
                                        }}
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">Selecione</option>
                                        {modulos.map((modulo) => (
                                            <option key={modulo.id} value={modulo.id}>
                                                {modulo.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block">Andar</label>
                                    <select
                                        value={andarSelecionado}
                                        onChange={(e) => {
                                            setAndarSelecionado(e.target.value);
                                            setData('space_id', '');
                                        }}
                                        className="w-full rounded border p-2"
                                        disabled={!moduloSelecionado}
                                    >
                                        <option value="">Selecione</option>
                                        {andaresFiltrados.map((andar) => (
                                            <option key={andar.id} value={andar.id}>
                                                {andar.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block">Espaço</label>
                                    <select
                                        value={data.space_id}
                                        onChange={(e) => setData('space_id', e.target.value)}
                                        required
                                        className="w-full rounded border p-2"
                                        disabled={!andarSelecionado}
                                    >
                                        <option value="">Selecione</option>
                                        {espacosFiltrados.map((espaco) => (
                                            <option key={espaco.id} value={espaco.id}>
                                                {espaco.nome}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.space_id} />
                                </div>

                                {espacoDetalhes && (
                                    <div className="mb-4 rounded border bg-gray-50 p-2">
                                        <strong>Detalhes do Espaço:</strong>
                                        <div><b>Sala:</b> {espacoDetalhes.nome}</div>
                                        {espacoDetalhes.andar && (
                                            <>
                                                <div><b>Andar:</b> {espacoDetalhes.andar.nome}</div>
                                                {espacoDetalhes.andar.modulo && (
                                                    <>
                                                        <div><b>Módulo:</b> {espacoDetalhes.andar.modulo.nome}</div>
                                                        {espacoDetalhes.andar.modulo.unidade && (
                                                            <div><b>Unidade:</b> {espacoDetalhes.andar.modulo.unidade.nome}</div>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {espacoDetalhes.descricao && <div><b>Descrição:</b> {espacoDetalhes.descricao}</div>}
                                        {espacoDetalhes.capacidade_pessoas && <div><b>Capacidade:</b> {espacoDetalhes.capacidade_pessoas}</div>}
                                        {espacoDetalhes.endereco && <div><b>Endereço:</b> {espacoDetalhes.endereco}</div>}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block">Turnos</label>
                                    <select
                                        multiple
                                        value={data.turnos}
                                        onChange={(e) =>
                                            setData(
                                                'turnos',
                                                Array.from(e.target.selectedOptions, (o) => o.value),
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                    >
                                        {turnos.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.turnos} />
                                </div>

                                <div>
                                    <label className="mb-1 block">Agendas</label>
                                    <select
                                        multiple
                                        value={data.agendas}
                                        onChange={(e) =>
                                            setData(
                                                'agendas',
                                                Array.from(e.target.selectedOptions, (o) => o.value),
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                    >
                                        {agendas.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.agendas} />
                                </div>
                            </>
                        )}

                        <div className="flex space-x-2">
                            <Button type="submit" disabled={processing}>
                                {userBeingEdited?.id ? 'Atualizar' : 'Criar'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setUserBeingEdited(null)} disabled={processing}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}