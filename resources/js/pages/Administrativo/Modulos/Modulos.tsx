import DeleteItem from '@/components/delete-item';
import GenericHeader from '@/components/generic-header';
import Paginacao from '@/components/paginacao-listas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Modulo } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FilePenLine, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs = [
    {
        title: 'Gerenciar Modulos',
        href: '/institucional/modulos',
    },
];

export default function InstituicoesPage() {
    const { modulos } = usePage<{
        modulos: {
            data: Modulo[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object;
        };
    }>().props;
    const [removerModulo, setRemoverModulo] = useState<Modulo | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instituições" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <GenericHeader
                        titulo="Gerenciar Modulos"
                        descricao="Aqui você consegue gerenciar os modulos cadastradas"
                        buttonText="Criar novo"
                        buttonLink={route('institucional.modulos.create')}
                        ButtonIcon={PlusCircle}
                        canSeeButton={true}
                    />
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Endereço</TableHead>
                                        <TableHead className="w-[120px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {modulos.data.map((modulo: Modulo) => {
                                        console.log(modulo);
                                        return (
                                            <TableRow key={modulo.id}>
                                                <TableCell>{modulo.nome}</TableCell>
                                                <TableCell>{modulo.unidade?.nome}</TableCell>
                                                <TableCell>{modulo.unidade?.instituicao?.sigla}</TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                    <Link href={route('institucional.modulos.edit', { modulo: modulo.id })}>
                                                        <Button variant="outline" size="icon">
                                                            <FilePenLine className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="destructive" size="icon" onClick={() => setRemoverModulo(modulo)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <Paginacao links={modulos.links} />
                        </CardContent>
                    </Card>
                    {removerModulo && (
                        <DeleteItem
                            isOpen={(open) => {
                                if (!open) {
                                    setRemoverModulo(null);
                                }
                            }}
                            itemName={removerModulo?.nome || 'Modulo'}
                            route={route('institucional.modulos.destroy', removerModulo.id)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
