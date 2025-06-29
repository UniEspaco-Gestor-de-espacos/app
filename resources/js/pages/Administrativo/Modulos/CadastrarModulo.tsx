import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import ModuloForm from './fragments/ModuloForm';

export interface CadastrarModuloForm {
    nome: string;
    unidade_id: string;
    [key: string]: string; // Permite campos adicionais
}

export default function CadastrarModuloPage() {
    const { instituicoes, unidades } = usePage<{ instituicoes: Instituicao[]; unidades: Unidade[] }>().props;
    const { data, setData, post, processing, errors } = useForm<CadastrarModuloForm>();

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('institucional.modulos.store'));
    };

    return (
        <AppLayout>
            <Head title="Criar Modulo" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <GenericHeader titulo="Cadastrar Modulo" descricao="Preencha os dados abaixo para cadastrar um novo modulo." />
                    <ModuloForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        errors={errors}
                        processing={processing}
                        title="Criar Novo Módulo"
                        description="Preencha os dados abaixo para cadastrar um novo modulo."
                        instituicoes={instituicoes}
                        unidades={unidades}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
