// resources/js/Pages/Editar/UserController.tsx
import { Link, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface PageProps {
    users?: User[];
    user?: User;
    roles?: string[];
    statuses?: string[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Usúario',
        href: '/Editar',
    },
];

export default function UserController() {
    const { users = [], user, roles = [], statuses = [] } = usePage<PageProps>().props;

    const isEdit = Boolean(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-8 p-6">
                <h1 className="text-2xl font-bold">{isEdit ? 'Editar Usuário' : users.length ? 'Lista de Usuários' : 'Criar Novo Usuário'}</h1>

                {/* Lista de usuários (index) */}
                {users.length > 0 && (
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Nome</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Função</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="border p-2">{u.name}</td>
                                    <td className="border p-2">{u.email}</td>
                                    <td className="border p-2">{u.role}</td>
                                    <td className="border p-2">{u.status}</td>
                                    <td className="border p-2">
                                        <Link href={route('institucional.usuarios.edit', u.id)} className="text-blue-600 hover:underline">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Formulário de criação/edição */}
                {(roles.length > 0 || isEdit) && (
                    <form method="post" action={isEdit ? route('usuario.update', user!.id) : route('usuario.store')}>
                        {/* CSRF Token */}
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                        {isEdit && <input type="hidden" name="_method" value="PATCH" />}

                        <div className="mb-4">
                            <label className="block font-semibold">Nome</label>
                            <input type="text" name="name" defaultValue={user?.name} className="w-full border p-2" required />
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">Email</label>
                            <input type="email" name="email" defaultValue={user?.email} className="w-full border p-2" required />
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">Função</label>
                            <select name="role" defaultValue={user?.role ?? ''} className="w-full border p-2" required>
                                <option value="">Selecione</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">Status</label>
                            <select name="status" defaultValue={user?.status ?? ''} className="w-full border p-2" required>
                                <option value="">Selecione</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
                            {isEdit ? 'Atualizar' : 'Criar'}
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
