import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import InstituicaoForm from './fragments/InstituicaoForm';

export default function CadastrarInstituicaoPage() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        sigla: '',
        endereço: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.instituicoes.store'));
    };

    return (
        <AppLayout>
            <Head title="Criar Instituição" />
            <div className="container mx-auto py-10">
                <InstituicaoForm
                    data={data}
                    setData={setData}
                    submit={submit}
                    errors={errors}
                    processing={processing}
                    title="Criar Nova Instituição"
                    description="Preencha os dados abaixo para cadastrar uma nova instituição."
                />
            </div>
        </AppLayout>
    );
}
