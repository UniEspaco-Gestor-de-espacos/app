import DeleteEspaco from '@/components/delete-espaco';
import GenericHeader from '@/components/generic-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Andar, Espaco, Modulo, Unidade, User } from '@/types'; // Importe seus tipos
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import EspacoCard from '../fragments/EspacoCard';
import EspacoFiltroBusca from '../fragments/EspacoFiltroBusca';

const breadcrumbs = [
    { title: 'Início', href: '/' },
    { title: 'Espaços', href: '/espacos' },
];

export default function GerenciarEspacosPage() {
    const {
        andares,
        modulos,
        unidades,
        user: { permission_type_id },
        espacos: { data: espacos, links },
        filters,
    } = usePage<{
        espacos: {
            data: Espaco[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object; // Contém 'from', 'to', 'total', etc.
        };
        unidades: Unidade[];
        modulos: Modulo[];
        andares: Andar[];
        filters: {
            // Recebe os filtros atuais do controller
            search?: string;
            unidade?: string;
            modulo?: string;
            andar?: string;
            capacidade?: string;
        };
        user: User;
    }>().props;

    // Estado para controlar qual espaço está sendo alvo de exclusão
    const [removerEspaco, setRemoverEspaco] = useState<Espaco | null>(null);
    const [espacoParaEditar, setEspacoParaEditar] = useState<Espaco | null>(null);

    const handleDetalhesEspaco = () => {};
    // Função para lidar com a submissão da exclusão

    useEffect(() => {
        if (!espacoParaEditar) return;
        router.visit(route('institucional.espacos.edit', { espaco: espacoParaEditar.id }));
    }, [espacoParaEditar]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Espaços" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    {/* Cabeçalho da Página */}
                    <GenericHeader
                        titulo="Gerenciar espaços"
                        descricao="Gerencie todos os espaços disponíveis, cadastre novos,exclua ou edite os existentes"
                        ButtonIcon={PlusCircle}
                        buttonText="Cadastrar Espaço"
                        buttonLink={route('institucional.espacos.create')}
                        canSeeButton={permission_type_id === 1} // Exibe o botão apenas para administradores
                    />
                    {/* Filtros e Busca */}
                    <EspacoFiltroBusca
                        route={route('institucional.espacos.index')}
                        unidades={unidades}
                        modulos={modulos}
                        andares={andares}
                        filters={filters}
                    />
                    {/* Grid de Espaços */}
                    <main>
                        {espacos.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {espacos.map((espaco) => (
                                    <EspacoCard
                                        key={espaco.id}
                                        espaco={espaco}
                                        userType={permission_type_id}
                                        isGerenciarEspacos
                                        handleExcluirEspaco={() => setRemoverEspaco(espaco)}
                                        handleEditarEspaco={() => setEspacoParaEditar(espaco)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <h2 className="text-xl font-semibold">Nenhum espaço encontrado</h2>
                                <p className="text-muted-foreground mt-2">Comece cadastrando um novo espaço para que ele apareça aqui.</p>
                                <Link href={route('institucional.espacos.create')}>
                                    <Button className="mt-4">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Cadastrar Primeiro Espaço
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </main>
                    {/* Componente de Paginação */}
                    <div className="mt-6 flex justify-center">
                        <div className="flex gap-1">
                            {links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`rounded-md border px-4 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
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
                    {removerEspaco && (
                        <DeleteEspaco
                            isOpen={(open) => {
                                if (!open) {
                                    setRemoverEspaco(null);
                                }
                            }}
                            id={removerEspaco.id}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
