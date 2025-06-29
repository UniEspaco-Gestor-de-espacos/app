// Arquivo: resources/js/Pages/Admin/Instituicoes/Edit.jsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import InstituicaoForm from './fragments/InstituicaoForm';

export default function EditarInstituicao({ instituicao }) {
    const { data, setData, put, processing, errors } = useForm({
        nome: instituicao.nome || '',
        sigla: instituicao.sigla || '',
        endereço: instituicao.endereço || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.instituicoes.update', instituicao.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${instituicao.nome}`} />
            <div className="container mx-auto py-10">
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
        </AppLayout>
    );
}
