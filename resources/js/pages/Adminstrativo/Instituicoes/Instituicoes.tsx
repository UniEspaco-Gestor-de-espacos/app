import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Instituicao } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FilePenLine, PlusCircle, Trash2 } from 'lucide-react';

// Componente para a Paginação (pode ser movido para um arquivo separado)
const Paginacao = ({ links }: { links: any[] }) => (
    <div className="mt-6 flex justify-center">
        <div className="flex gap-1">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`rounded-md border px-4 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                ) : (
                    <span
                        key={index}
                        className="text-muted-foreground rounded-md border px-4 py-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    </div>
);

export default function InstituicoesPage() {
    const { instituicoes } = usePage<{ instituicoes: { data: Instituicao[]; links: any[] } }>().props;
    const deleteInstituicao = (id: string) => {
        // IMPORTANTE: Adicione um modal de confirmação aqui antes de executar o delete.
        if (confirm('Tem certeza que deseja excluir esta instituição?')) {
            router.delete(route('admin.instituicoes.destroy', id), {
                preserveScroll: true, // Mantém a posição do scroll após a exclusão
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Instituições" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Gerenciar Instituições</CardTitle>
                            <Link href={route('admin.instituicoes.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Criar Nova
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Sigla</TableHead>
                                    <TableHead>Endereço</TableHead>
                                    <TableHead className="w-[120px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {instituicoes.data.map((instituicao: Instituicao) => (
                                    <TableRow key={instituicao.id}>
                                        <TableCell>{instituicao.nome}</TableCell>
                                        <TableCell>{instituicao.sigla}</TableCell>
                                        <TableCell>{instituicao.endereço || 'N/A'}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Link href={route('admin.instituicoes.edit', instituicao.id)}>
                                                <Button variant="outline" size="icon">
                                                    <FilePenLine className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="destructive" size="icon" onClick={() => deleteInstituicao(instituicao.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Paginacao links={instituicoes.links} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
