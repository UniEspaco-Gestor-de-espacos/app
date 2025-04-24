import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instituicao, Setor, Unidade } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
export default function Register() {
    const { props } = usePage<{ instituicaos: Instituicao[]; unidades: Unidade[]; setores: Setor[] }>();
    const instituicaos = props.instituicaos;
    const [instituicaoId, setInstituicaoId] = useState<string>();
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [unidadeId, setUnidadeId] = useState<string>();
    const [setores, setSetores] = useState<Setor[]>([]);
    const [setorId, setSetorId] = useState<string>();
    useEffect(() => {
        const listUnidades = props.unidades.filter((unidade) => unidade.instituicao_id == instituicaoId);
        setUnidades(listUnidades);
    }, [instituicaoId]);

    useEffect(() => {
        const listSetores = props.setores.filter((setor) => setor.unidade_id == unidadeId);
        setSetores(listSetores);
    }, [unidadeId]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        campus: '',
        setor_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Cadastro usuário" />
            <div className="flex min-h-screen">
                {/* Lado esquerdo */}
                <div className="flex w-2/5 items-center justify-center overflow-hidden rounded-l-xl bg-blue-100">
                    <img src="/_img/sign_up.png" alt="Sign Up Illustration" className="max-h-[500px] w-auto object-contain" />
                </div>

                {/* Lado direito */}
                <div className="flex w-2/3 flex-col justify-center space-y-8 p-12 pt-0 pb-0">
                    <div className="mb-2 flex h-52 items-center justify-center">
                        <img src="/_img/Logo_uniEspaco.png" alt="Logo UniEspaço" className="max-h-full object-contain" />
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nome completo:</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Digite seu nome" />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email">Email:</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Número de celular:</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+55 73 9999-9999"
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <div>
                                <Label htmlFor="instituicao">Instituição:</Label>
                                <select
                                    id="instituicao"
                                    value={instituicaoId || ''}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setInstituicaoId(selected);
                                        setUnidadeId(''); // limpa unidade ao mudar instituição
                                        setSetorId(''); // limpa setor ao mudar instituição
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                >
                                    <option value="">Selecionar</option>
                                    {instituicaos.map((instituicao: Instituicao) => (
                                        <option key={instituicao.id} value={instituicao.id}>
                                            {instituicao.sigla}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="unidade">Unidade:</Label>
                                <select
                                    id="unidade"
                                    value={unidadeId || ''}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setUnidadeId(selected);
                                        setSetorId(''); // limpa setor ao mudar unidade
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                >
                                    <option value="">Selecionar</option>
                                    {unidades.map((unidade: Unidade) => (
                                        <option key={unidade.id} value={unidade.id}>
                                            {unidade.sigla}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="setor">Setor:</Label>
                                <select
                                    id="setor"
                                    value={setorId || ''}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setSetorId(selected);
                                        setData('setor_id', selected);
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                >
                                    <option value="">Selecionar</option>
                                    {setores.map((setor: Setor) => (
                                        <option key={setor.id} value={setor.id}>
                                            {setor.sigla}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.setor_id} />
                            </div>

                            <div>
                                <Label htmlFor="password">Senha:</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="********"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirme sua senha:</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="********"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button type="submit" className="mx-auto mt-4 block px-6 py-2" disabled={processing}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Cadastrar'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
