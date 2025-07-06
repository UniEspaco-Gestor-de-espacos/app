import GenericHeader from '@/components/generic-header';
import AppLayout from '@/layouts/app-layout';
import { validarEstrutura } from '@/lib/utils/andars/AndarHelpers';
import { Instituicao, Modulo, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { CadastrarModuloForm } from './CadastrarModulo';
import ModuloForm from './fragments/ModuloForm';

export default function EditarModulo() {
    const { instituicao, unidades, modulo } = usePage<{ instituicao: Instituicao; unidades: Unidade[]; modulo: Modulo }>().props;
    const breadcrumbs = [
        {
            title: 'Gerenciar Modulos',
            href: '/institucional/modulo',
        },
        {
            title: 'Editar Modulo',
            href: `/institucional/modulos/${modulo.id}/edit`,
        },
    ];
    const { data, setData, patch, processing, errors } = useForm<CadastrarModuloForm>({
        nome: '',
        unidade_id: '',
        andares: [],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errors = false;
        // Validação de integridade da estrutura
        const validacaoEstrutura = validarEstrutura(data.andares);
        if (!validacaoEstrutura.valido) {
            errors = true;
            toast.error(`Estrutura inválida: ${validacaoEstrutura.erros.join(', ')}`);
            return;
        }

        // Validar tipos de acesso para cada andar
        data.andares.forEach((andar) => {
            if (andar.tipo_acesso.length === 0) {
                errors = true;
            }
        });
        if (errors) {
            toast.error('Todos os andares devem ter pelo menos um tipo de acesso definido.');
            return;
        }
        patch(route('institucional.modulos.update', { modulo: modulo.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Modulo" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto space-y-6 py-6">
                    <div className="container mx-auto space-y-6 p-6">
                        <GenericHeader titulo="Cadastrar Modulo" descricao="Preencha os dados abaixo para cadastrar um novo modulo." />
                        <ModuloForm
                            data={data}
                            setData={setData}
                            submit={submit}
                            errors={errors}
                            processing={processing}
                            title="Criar Novo Módulo"
                            description="Preencha os dados abaixo para cadastrar um novo modulo."
                            instituicao={instituicao}
                            unidades={unidades}
                            modulo={modulo}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
