import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Andar, Espaco, FiltrosEspacosType, Modulo, Unidade, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { DialogConfirmacao } from './fragments/DialogConfirmacao';
import { FiltrosEspacos } from './fragments/FiltrosEspacos';
import { GerenciarGestoresDialog } from './fragments/GerenciarGestoresDialog';
import { TabelaEspacos } from './fragments/TabelaEspacos';
const breadcrumbs = [
    { title: 'Início', href: '/' },
    { title: 'Espaços', href: '/espacos' },
];
export default function GerenciarEspacos() {
    const {
        unidades,
        modulos,
        andares,
        espacos: { data: espacos, links },
        filters,
        users,
    } = usePage<{
        espacos: {
            data: Espaco[];
            links: { url: string | null; label: string; active: boolean }[];
            meta: object; // Contém 'from', 'to', 'total', etc.
        };
        unidades: Unidade[];
        modulos: Modulo[];
        andares: Andar[];
        filters: FiltrosEspacosType;
        users: User[];
    }>().props;

    const [filtros, setFiltros] = useState<FiltrosEspacosType>(filters);
    const [espacoParaExcluir, setEspacoParaExcluir] = useState<Espaco | null>(null);
    const [espacoParaGerenciar, setEspacoParaGerenciar] = useState<Espaco | null>(null);

    const isInitialMount = useRef(true);

    // Filtrar espaços baseado nos filtros aplicados

    const handleFiltrar = () => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        router.get(
            route('institucional.espacos.index'),
            { ...filtros },
            {
                preserveState: true, // Mantém o estado dos filtros na página
                preserveScroll: true, // Não rola a página para o topo
                replace: true,
            },
        );
    };

    const handleEditar = (espaco: Espaco) => {
        console.log('Editar espaço:', espaco.nome);
        // Aqui você redirecionaria para a página de edição
    };

    const handleExcluir = (espaco: Espaco) => {
        console.log('Espaço excluído:', espaco.nome);
    };

    const handleGerenciarGestores = (espaco: Espaco) => {
        setEspacoParaGerenciar(espaco);
    };

    const handleSalvarGestores = (espacoId: number, gestores: Record<string, number | null>) => {
        console.log('Gestores salvos para espaço', espacoId, ':', gestores);
    };

    const handleCadastrarEspaco = () => {
        console.log('Redirecionar para cadastro de espaço');
        // Aqui você redirecionaria para a página de cadastro
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Espaços" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <div className="container mx-auto space-y-6 p-6">
                        {/* Cabeçalho */}
                        <GenericHeader
                            titulo={'Gerenciar Espaços'}
                            descricao={'Gerencie todos os espaços disponíveis, seus dados e gestores'}
                            buttonText="Cadastrar Espaço"
                            ButtonIcon={PlusCircle}
                            buttonOnClick={handleCadastrarEspaco}
                            canSeeButton // Exibe o botão apenas para
                        />

                        {/* Filtros */}
                        <FiltrosEspacos
                            filtros={filtros}
                            setFiltros={setFiltros}
                            unidades={unidades}
                            onFiltrar={handleFiltrar}
                            modulos={modulos}
                            andares={andares}
                        />

                        {/* Tabela de Espaços */}
                        <TabelaEspacos
                            espacos={espacos}
                            onEditar={handleEditar}
                            onExcluir={setEspacoParaExcluir}
                            onGerenciarGestores={handleGerenciarGestores}
                        />

                        {/* Dialog para gerenciar gestores */}
                        <GerenciarGestoresDialog
                            key={espacoParaGerenciar?.id}
                            espaco={espacoParaGerenciar}
                            usuarios={users}
                            isOpen={!!espacoParaGerenciar}
                            onClose={() => setEspacoParaGerenciar(null)}
                            onSave={handleSalvarGestores}
                        />

                        {/* Dialog de confirmação para exclusão */}
                        <DialogConfirmacao
                            espaco={espacoParaExcluir}
                            isOpen={!!espacoParaExcluir}
                            onClose={() => setEspacoParaExcluir(null)}
                            onConfirm={handleExcluir}
                        />
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
