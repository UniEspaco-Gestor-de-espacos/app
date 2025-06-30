import DeleteItem from '@/components/delete-item';
import GenericHeader from '@/components/generic-header';
import Paginacao from '@/components/paginacao-listas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, Unidade } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FilePenLine, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UnidadeFilters } from './fragments/UnidadeFilters';
const breadcrumbs = [
    {
        title: 'Gerenciar Modulos',
        href: '/institucional/modulos',
    },
];

export default function InstituicoesPage() {
    const { unidades, instituicoes } = usePage<{
        unidades: {
            data: Unidade[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object;
        };
        instituicoes: Instituicao[];
    }>().props;
    const unidadesData = unidades.data;
    const [removerUnidade, setRemoverUnidade] = useState<Unidade | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstituicao, setSelectedInstituicao] = useState<Instituicao | undefined>(undefined);
    const [unidadesFilter, setUnidadesFilter] = useState<Unidade[]>(unidades.data);

    useEffect(() => {
        if (!searchTerm && selectedInstituicao === undefined) {
            setUnidadesFilter(unidadesData);
            return;
        }
        setUnidadesFilter(
            unidadesData.filter((unidade) => {
                const matchesSearch = unidade.nome.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesInstituicao = selectedInstituicao ? unidade.instituicao?.id === selectedInstituicao.id : true;
                return matchesSearch && matchesInstituicao;
            }),
        );
    }, [searchTerm, selectedInstituicao, unidadesData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instituições" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <GenericHeader
                        titulo="Gerenciar Unidades"
                        descricao="Aqui você consegue gerenciar as unidades cadastradas"
                        buttonText="Criar nova"
                        buttonLink={route('institucional.unidades.create')}
                        ButtonIcon={PlusCircle}
                        canSeeButton={true}
                    />
                    <Card>
                        <CardHeader className="flex justify-between">
                            <UnidadeFilters
                                searchTerm={searchTerm}
                                onSearchTermChange={setSearchTerm}
                                instituicoes={instituicoes}
                                selectedInstituicao={selectedInstituicao}
                                onInstituicaoChange={setSelectedInstituicao}
                            />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Sigla</TableHead>
                                        <TableHead>Instituicao</TableHead>
                                        <TableHead className="w-[120px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unidadesFilter.map((unidade: Unidade) => {
                                        return (
                                            <TableRow key={unidade.id}>
                                                <TableCell>{unidade.nome}</TableCell>
                                                <TableCell>{unidade.sigla}</TableCell>
                                                <TableCell>{unidade.instituicao?.sigla}</TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                    <Link href={route('institucional.unidades.edit', { unidade: unidade.id })}>
                                                        <Button variant="outline" size="icon">
                                                            <FilePenLine className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="destructive" size="icon" onClick={() => setRemoverUnidade(unidade)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <Paginacao links={unidades.links} />
                        </CardContent>
                    </Card>
                    {removerUnidade && (
                        <DeleteItem
                            isOpen={(open) => {
                                if (!open) {
                                    setRemoverUnidade(null);
                                }
                            }}
                            itemName={removerUnidade?.nome || 'Unidade'}
                            route={route('institucional.unidades.destroy', removerUnidade.id)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
