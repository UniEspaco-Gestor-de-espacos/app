import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import UnidadeForm from './fragments/UnidadesForm';

export interface EditarUnidadeForm {
    nome: string;
    sigla: string;
    instituicao_id: string;
    [key: string]: string;
}

export default function EditarUnidade() {
    const { instituicoes, unidade } = usePage<{ instituicoes: Instituicao[]; unidade: Unidade }>().props;

    const { data, setData, put, processing, errors } = useForm<EditarUnidadeForm>({
        nome: unidade.nome,
        sigla: unidade.sigla,
        instituicao_id: unidade.instituicao?.id.toString() || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('institucional.unidades.update', { unidade: unidade.id }));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${unidade.nome}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <GenericHeader titulo={`Editar Unidade:  ${unidade.nome}`} descricao="Aqui você consegue editar a unidade selecionada" />
                    <UnidadeForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        errors={errors}
                        processing={processing}
                        title="Editar Modulo"
                        description="Altere os dados do modulo abaixo."
                        instituicoes={instituicoes}
                        unidade={unidade}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
