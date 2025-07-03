'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PermissionModal } from './fragments/PermissionModal';

import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Search, Settings, Shield, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import DeleteItem from '@/components/delete-item';
import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, PermissionType, User } from '@/types';
import { toast } from 'sonner';
const breadcrumbs = [
    {
        title: 'Gerenciar Usuarios',
        href: '/institucional/usuarios',
    },
];

export default function UsuariosPage() {
    const { props } = usePage<{
        users: User[];
        permissionTypes: PermissionType[];
        instituicoes: Instituicao[];
    }>();
    const { users: initialUsers, permissionTypes, instituicoes } = props;

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [removerUsuario, setRemoverUsuario] = useState<User | undefined>();
    useEffect(() => {
        const filtered = users.filter(
            (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const getPermissionLabel = (permissionTypeId: number) => {
        const permission = permissionTypes.find((p) => p.id === permissionTypeId);
        return permission?.label || 'Desconhecido';
    };

    const getPermissionColor = (permissionTypeId: number) => {
        switch (permissionTypeId) {
            case 1:
                return 'bg-red-100 text-red-800';
            case 2:
                return 'bg-blue-100 text-blue-800';
            case 3:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        // Implementação futura para edição de usuário
        toast('Funcionalidade de edição ainda não implementada.');
    };

    const handlePermissionUpdate = (userId: number, newPermissionTypeId: number, agendas?: number[]) => {
        setProcessing(true);
        router.put(
            route('institucional.usuarios.updatepermissions', { user: userId }),
            {
                permission_type_id: newPermissionTypeId,
                agendas: agendas || [],
            },
            {
                onSuccess: () => {
                    setUsers(users.map((user) => (user.id === userId ? { ...user, permission_type_id: newPermissionTypeId } : user)));
                    setIsModalOpen(false);
                    setSelectedUser(undefined);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <div className="container mx-auto space-y-6 p-6">
                        <div className="container mx-auto space-y-6 p-6">
                            <GenericHeader
                                titulo={'Gestão de usuarios'}
                                descricao={'Aqui voce pode gerir os usuarios, editando ou alterando as permissoes'}
                            />
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Lista de Usuários</span>
                                        <div className="relative w-72">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                            <Input
                                                placeholder="Buscar por nome ou email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {filteredUsers.map((user) => (
                                            <div key={user.id}>
                                                <Card key={user.id} className="cursor-pointer transition-shadow hover:shadow-md">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar>
                                                                    <AvatarImage src={user.profile_pic || '/placeholder.svg'} />
                                                                    <AvatarFallback>
                                                                        {user.name
                                                                            .split(' ')
                                                                            .map((n) => n[0])
                                                                            .join('')
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="space-y-1">
                                                                    <h3 className="text-lg font-semibold">{user.name}</h3>
                                                                    <p className="text-gray-600">{user.email}</p>
                                                                    <p className="text-sm text-gray-500">{user.telefone}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <Badge className={getPermissionColor(user.permission_type_id)}>
                                                                    {getPermissionLabel(user.permission_type_id)}
                                                                </Badge>
                                                                <div className="flex items-center space-x-2">
                                                                    <div
                                                                        className={`h-2 w-2 rounded-full ${user.email_verified_at ? 'bg-green-500' : 'bg-red-500'}`}
                                                                    />
                                                                    <span className="text-xs text-gray-500">
                                                                        {user.email_verified_at ? 'Verificado' : 'Não verificado'}
                                                                    </span>
                                                                </div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            <Settings className="mr-2 h-4 w-4" />
                                                                            Gerenciar
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleUserClick(user)}>
                                                                            <Shield className="mr-2 h-4 w-4" />
                                                                            Permissões
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => setRemoverUsuario(user)}
                                                                            className="text-red-600"
                                                                        >
                                                                            <Trash className="mr-2 h-4 w-4" />
                                                                            Excluir
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                {removerUsuario && removerUsuario.id === user.id && (
                                                    <div className="container mx-auto space-y-6 py-6">
                                                        <DeleteItem
                                                            key={user.id}
                                                            itemName={removerUsuario.name}
                                                            isOpen={(open) => {
                                                                if (!open) {
                                                                    setRemoverUsuario(undefined);
                                                                }
                                                            }}
                                                            route={route('institucional.usuarios.destroy', { usuario: removerUsuario.id })}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {isModalOpen && selectedUser && (
                                <PermissionModal
                                    user={selectedUser}
                                    isOpen={isModalOpen}
                                    onClose={() => {
                                        setIsModalOpen(false);
                                        setSelectedUser(undefined);
                                    }}
                                    onUpdate={handlePermissionUpdate}
                                    permissionTypes={permissionTypes}
                                    instituicoes={instituicoes}
                                    processing={processing}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
