import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permission_type_id: number;
}

interface PageProps {
    users?: User[];
    user?: User;
    roles?: string[];
    statuses?: string[];
    errors: Record<string, string>;
    [key: string]: unknown;
}

/*
Todas as informções que vir do permission_type_id vai ser transformada em texto.
Se o numero for 1 é Institucional
Se o numero for 2 é Gestor
Se o numero for 3 é Comum
*/

/* Vamos adicionar um mapeamento para os cargos, se necessário
1 - Primeira coisa vai ser adicioar uma função para transformar o permission_type_id em texto Vamos usar o funciton getPermissionName.
2 - Depois de criar 
 */

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
        title: 'Editar Usuário',
        href: '/Editar',
    },
];

export default function UserController() {
    const { users = [], user, roles = [], statuses = [], errors } = usePage<PageProps>().props;
    const isEdit = Boolean(user);

    const { data, setData, post, patch, processing } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? '',
        status: user?.permission_type_id ?? '',
    });

    // Atualiza o formulário se `user` mudar
    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.permission_type_id,
            });
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && user) {
            patch(route('usuario.update', user.id));
        } else {
            post(route('usuario.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-5xl space-y-8 p-2 lg:p-4">
                <h1 className="text-2xl font-bold break-words">
                    {isEdit ? 'Editar Usuário' : users.length ? 'Lista de Usuários' : 'Criar Novo Usuário'}
                </h1>

                {/* Lista de usuários */}
                {users.length > 0 && (
                    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
                        <table className="w-full min-w-[500px] text-sm">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="p-3 text-left font-semibold">Nome</th>
                                    <th className="p-3 text-left font-semibold">Email</th>
                                    <th className="p-3 text-left font-semibold">Função</th>
                                    <th className="p-3 text-left font-semibold">Status</th>
                                    <th className="p-3 text-left font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/50 border-t">
                                        <td className="max-w-[120px] p-3 break-words">{u.name}</td>
                                        <td className="max-w-[140px] p-3 break-words">{u.email}</td>
                                        <td className="p-3 capitalize"> {getPermissionName(u.permission_type_id)}</td>
                                        <td className="p-3 capitalize">{u.permission_type_id}</td>
                                        <td className="p-3">
                                            <Link
                                                href={route('institucional.usuarios.edit', u.id)}
                                                className="text-primary font-medium underline"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Formulário de criação/edição */}
                {(roles.length > 0 || isEdit) && (
                    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-6">
                        <div>
                            <label className="mb-1 block font-medium">Nome</label>
                            <Input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="w-full"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Função</label>
                            <Select name="role" value={data.role} onValueChange={(value) => setData('role', value)} required>
                                <option value="">Selecione</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Status</label>
                            <Select name="status" value={data.status} onValueChange={(value) => setData('status', value)} required>
                                <option value="">Selecione</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {isEdit ? 'Atualizar' : 'Criar'}
                        </Button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
