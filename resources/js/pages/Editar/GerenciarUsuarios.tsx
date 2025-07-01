import AppLayout from '@/layouts/app-layout';
import { type Agenda, type Andar, type User as BaseUser, type BreadcrumbItem, type Espaco, type Modulo } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import EditarUsuarioForm from './EditarUsuarioForma';
import TabelaGestores from './TabelaGestores';

interface GerenciarUsuariosUser extends BaseUser {
    role: string;
    space_id: number | null;
    agendas?: Agenda[];
}

interface PageProps {
    users: GerenciarUsuariosUser[];
    modulos: Modulo[];
    andares: Andar[];
    spaces: Espaco[];
    agendas: Agenda[];
    errors?: Record<string, string>;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuários', href: '/usuarios' }];

export default function GerenciarUsuarios() {
    const { props } = usePage<PageProps>();
    const { users = [], modulos = [], andares = [], spaces = [], agendas = [], errors: serverErrors = {} } = props;

    const [userBeingEdited, setUserBeingEdited] = useState<GerenciarUsuariosUser | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [moduloSelecionado, setModuloSelecionado] = useState<string>('');
    const [andarSelecionado, setAndarSelecionado] = useState<string>('');
    const [filteredAgendas, setFilteredAgendas] = useState<Agenda[]>([]);

    // Espaços filtrados conforme andar selecionado
    const espacosFiltrados = andarSelecionado ? spaces.filter((e) => String(e.andar_id) === andarSelecionado) : spaces;

    // Filtra só gestores (permission_type_id === 2)
    const gestores = users.filter((u) => u.permission_type_id === 2);

    // Monta agendas com dados aninhados completos para o TabelaGestores
    const gestoresParaTabela = gestores.map((gestor) => ({
        ...gestor,
        agendas: gestor.agendas
            ? gestor.agendas.map((agenda) => {
                  const espaco = agenda.espaco ?? spaces.find((s) => s.id === agenda.espaco_id);
                  const andar = espaco?.andar ?? (espaco ? andares.find((a) => a.id === espaco.andar_id) : undefined);
                  const modulo = andar?.modulo ?? (andar ? modulos.find((m) => m.id === Number(andar.modulo_id)) : undefined);
                  return {
                      ...agenda,
                      espaco: espaco
                          ? {
                                ...espaco,
                                andar: andar
                                    ? {
                                          ...andar,
                                          modulo: modulo ?? undefined,
                                      }
                                    : undefined,
                            }
                          : undefined,
                  };
              })
            : [], // Se agendas for undefined, usa array vazia
    }));

    // useForm para o formulário
    const { data, setData, patch, post, processing, reset } = useForm({
        name: '',
        permission_type_id: '',
        space_id: '',
        agendas: [] as string[],
        turnos: [] as string[],
        user_id: undefined as number | undefined,
    });

    useEffect(() => {
        if (userBeingEdited) {
            setData({
                name: userBeingEdited.name ?? '',
                permission_type_id: String(userBeingEdited.permission_type_id ?? ''),
                space_id: userBeingEdited.space_id ? String(userBeingEdited.space_id) : '',
                agendas: userBeingEdited.agendas?.map((a) => String(a.id)) ?? [],
                turnos: [],
                user_id: userBeingEdited.id,
            });

            if (userBeingEdited.space_id) {
                const filtradas = agendas.filter((a) => a.espaco_id === userBeingEdited.space_id);
                setFilteredAgendas(filtradas);

                const turnosUsuario = userBeingEdited.agendas?.map((a) => a.turno) ?? [];
                setData('turnos', turnosUsuario);
            } else {
                setFilteredAgendas([]);
                setData('turnos', []);
            }

            const espacoAtual = spaces.find((s) => s.id === userBeingEdited.space_id);
            if (espacoAtual) {
                setAndarSelecionado(String(espacoAtual.andar_id));
                const andarAtual = andares.find((a) => a.id === espacoAtual.andar_id);
                if (andarAtual) {
                    setModuloSelecionado(String(andarAtual.modulo_id));
                }
            } else {
                setModuloSelecionado('');
                setAndarSelecionado('');
            }
        } else {
            reset();
            setFilteredAgendas([]);
            setModuloSelecionado('');
            setAndarSelecionado('');
            setData('turnos', []);
        }
        setErrors({});
    }, [userBeingEdited, agendas, reset, setData, spaces, andares]);

    useEffect(() => {
        setErrors(serverErrors);
    }, [serverErrors]);

    useEffect(() => {
        if (data.space_id) {
            const filtradas = agendas.filter((a) => String(a.espaco_id) === data.space_id);
            setFilteredAgendas(filtradas);
        } else {
            setFilteredAgendas([]);
        }
    }, [data.space_id, agendas]);

    const validate = () => {
        const validationErrors: Record<string, string> = {};
        if (!data.permission_type_id) validationErrors.permission_type_id = 'A permissão é obrigatória.';
        if (data.permission_type_id === '2' && !data.space_id) {
            validationErrors.space_id = 'O espaço é obrigatório para gestores.';
        }
        return validationErrors;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (userBeingEdited?.id) {
            patch(route('usuario.update', { user: userBeingEdited.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    setUserBeingEdited(null);
                    toast('Usuário atualizado com sucesso.');
                },
                onError: (pageErrors) => {
                    setErrors(pageErrors);
                    toast.error('Erro ao atualizar o usuário.');
                },
            });
        } else {
            post(route('usuario.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setUserBeingEdited(null);
                    toast('Usuário criado com sucesso.');
                },
                onError: (pageErrors) => {
                    setErrors(pageErrors);
                    toast.error('Erro ao criar o usuário.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-5xl space-y-8 p-2 lg:p-4">
                <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>

                {!userBeingEdited ? (
                    <>
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
                                    {users.length > 0 ? (
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-muted/50 border-t">
                                                <td className="p-3">{u.name}</td>
                                                <td className="p-3">{u.email}</td>
                                                <td className="p-3">
                                                    {u.permission_type_id === 2 ? 'Gestor' : u.permission_type_id === 1 ? 'Institucional' : 'Comum'}
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

                        <h2 className="mt-10 text-xl font-bold">Conferir Gestores e Turnos</h2>
                        <TabelaGestores gestores={gestoresParaTabela} />
                    </>
                ) : (
                    <EditarUsuarioForm
                        user={userBeingEdited}
                        data={data}
                        modulos={modulos}
                        andares={andares}
                        moduloSelecionado={moduloSelecionado}
                        andarSelecionado={andarSelecionado}
                        espacosFiltrados={espacosFiltrados}
                        filteredAgendas={filteredAgendas}
                        errors={errors}
                        processing={processing}
                        setModuloSelecionado={setModuloSelecionado}
                        setAndarSelecionado={setAndarSelecionado}
                        setData={setData}
                        setUserBeingEdited={(user) => setUserBeingEdited(user as GerenciarUsuariosUser | null)}
                        handleSubmit={handleSubmit}
                    />
                )}
            </div>
        </AppLayout>
    );
}
