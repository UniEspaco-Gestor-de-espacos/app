import AppLayout from '@/layouts/app-layout';
import { Instituicao } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import InstituicaoForm from './fragments/InstituicaoForm';

export interface EditarInstituicaoForm {
    nome: string;
    sigla: string;
    endereco: string;
    [key: string]: string;
}

export default function EditarInstituicao() {
    const { instituicao } = usePage<{ instituicao: Instituicao }>().props;
    const breadcrumbs = [
        {
            title: 'Gerenciar Instituicões',
            href: '/institucional/instituicao',
        },
        {
            title: 'Editar Instituicao',
            href: `/institucional/instituicao/${instituicao.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors } = useForm<EditarInstituicaoForm>({
        nome: instituicao.nome,
        sigla: instituicao.sigla,
        endereco: instituicao.endereco,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('institucional.instituicoes.update', { instituico: instituicao.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${instituicao.nome}`} />
            <div className="container mx-auto py-10">
                <div className="container mx-auto space-y-6 p-6">
                    <InstituicaoForm
                        data={data}
                        setData={setData}
                        submit={submit}
                        errors={errors}
                        processing={processing}
                        title="Editar Instituição"
                        description="Altere os dados da instituição abaixo."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
