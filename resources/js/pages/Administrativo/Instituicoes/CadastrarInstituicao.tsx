import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import InstituicaoForm from './fragments/InstituicaoForm';

export interface CadastrarInstituicaoForm {
    nome: string;
    sigla: string;
    endereco: string;
    [key: string]: string; // Permite campos adicionais
}

export default function CadastrarInstituicaoPage() {
    const { data, setData, post, processing, errors } = useForm<CadastrarInstituicaoForm>();

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('institucional.instituicoes.store'));
    };

    return (
        <AppLayout>
            <Head title="Criar Instituição" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    {' '}
                    <div className="container mx-auto space-y-6 p-6">
                        <GenericHeader
                            titulo="Cadastrar Instituição"
                            descricao="Preencha os dados abaixo para cadastrar uma nova instituição."
                            buttonText="Cadastrar instituição"
                            buttonLink={route('institucional.instituicoes.create')}
                            ButtonIcon={PlusCircle}
                        />
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
                </div>
            </div>
        </AppLayout>
    );
}
