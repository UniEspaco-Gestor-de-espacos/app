import GenericHeader from '@/components/generic-header';
import { useFiltros } from '@/hooks/use-filtros';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, Setor, Unidade, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { FiltrosSetor } from './fragments/FiltrosSetor';
import { ModaisSetor } from './fragments/ModaisSetors';
import { SetorFormData } from './fragments/SetorForm';
import { TabelaSetores } from './fragments/TabelaSetores';

const breadcrumbs = [
    {
        title: 'Gerenciar Setores',
        href: '/institucional/setores',
    },
];

export default function SetoresPage() {
    const { instituicoes, unidades, setores, usuarios } = usePage<{
        instituicoes: Instituicao[];
        unidades: Unidade[];
        setores: Setor[];
        usuarios: User[];
    }>().props;

    const {
        searchTerm,
        setSearchTerm,
        selectedInstituicao,
        setSelectedInstituicao,
        selectedUnidade,
        setSelectedUnidade,
        filteredUnidades,
        filteredSetores,
        clearFilters,
    } = useFiltros(instituicoes, unidades, setores);

    // Estados dos modais
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSetor, setEditingSetor] = useState<Setor | null>(null);
    const [viewingUsuarios, setViewingUsuarios] = useState<Setor | null>(null);

    function handleCreateSetor(data: SetorFormData): void {
        router.post(
            route('institucional.setors.store'),
            {
                ...data,
                unidade_id: data.unidade_id,
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingSetor(null);
                },
            },
        );
    }

    function handleUpdateSetor(setorId: number, data: SetorFormData): void {
        router.put(
            route('institucional.setors.update', { setor: setorId }),
            {
                ...data,
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingSetor(null);
                },
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modulos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <div className="container mx-auto space-y-6 p-6">
                        <GenericHeader
                            titulo={'Gerenciar Setores'}
                            descricao={'Gerencie os setores das unidades organizacionais'}
                            canSeeButton
                            buttonText="Cadastrar setor"
                            ButtonIcon={PlusCircle}
                            buttonOnClick={() => setIsCreateModalOpen(true)}
                        />

                        <FiltrosSetor
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedInstituicao={selectedInstituicao}
                            setSelectedInstituicao={setSelectedInstituicao}
                            selectedUnidade={selectedUnidade}
                            setSelectedUnidade={setSelectedUnidade}
                            instituicoes={instituicoes}
                            unidades={unidades}
                            filteredUnidades={filteredUnidades}
                            onClearFilters={clearFilters}
                        />

                        <TabelaSetores
                            setores={filteredSetores ?? []}
                            onEdit={setEditingSetor}
                            onViewUsuarios={setViewingUsuarios}
                            usuarios={usuarios}
                        />

                        <ModaisSetor
                            isCreateModalOpen={isCreateModalOpen}
                            setIsCreateModalOpen={setIsCreateModalOpen}
                            editingSetor={editingSetor}
                            setEditingSetor={setEditingSetor}
                            viewingUsuarios={viewingUsuarios}
                            setViewingUsuarios={setViewingUsuarios}
                            instituicoes={instituicoes}
                            unidades={unidades}
                            usuarios={usuarios}
                            onCreateSetor={(data) => handleCreateSetor(data)}
                            onUpdateSetor={(setorId, data) => handleUpdateSetor(setorId, data)}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
