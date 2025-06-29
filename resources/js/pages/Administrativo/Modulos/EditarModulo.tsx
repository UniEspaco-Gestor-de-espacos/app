import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Instituicao, Modulo, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import ModuloForm from './fragments/ModuloForm';

export interface EditarModuloForm {
    nome: string;
    unidade_id: string;
    [key: string]: string;
}

export default function EditarModulo() {
    const { instituicoes, unidades, modulo } = usePage<{ instituicoes: Instituicao[]; unidades: Unidade[]; modulo: Modulo }>().props;

    const { data, setData, put, processing, errors } = useForm<EditarModuloForm>({
        nome: modulo.nome,
        unidade_id: modulo.unidade?.id.toString() || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('institucional.modulos.update', { modulo: modulo.id }));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${modulo.nome}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <GenericHeader titulo={`Editar Modulo:  ${modulo.nome}`} descricao="Aqui você consegue editar o modulo selecionado" />
                    <ModuloForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        errors={errors}
                        processing={processing}
                        title="Editar Modulo"
                        description="Altere os dados do modulo abaixo."
                        instituicoes={instituicoes}
                        unidades={unidades}
                        modulo={modulo}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
