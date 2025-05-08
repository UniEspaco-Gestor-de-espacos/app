import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instituicao, Setor, Unidade } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Register() {
    const { props } = usePage<{ instituicaos: Instituicao[]; unidades: Unidade[]; setores: Setor[] }>();

    // Filtra apenas a UESB das instituições disponíveis
    const instituicaoUESB = props.instituicaos.find((inst) => inst.sigla === 'UESB');
    const [instituicaoId, setInstituicaoId] = useState<string>('');
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [unidadeId, setUnidadeId] = useState<string>('');
    const [setores, setSetores] = useState<Setor[]>([]);
    const [setorId, setSetorId] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [novaInstituicao, setNovaInstituicao] = useState({
        nome: '',
        unidade: '',
        setor: '',
    });

    useEffect(() => {
        if (instituicaoId === 'UESB') {
            const listUnidades = props.unidades.filter((unidade) => unidade.instituicao_id == instituicaoUESB?.id);
            setUnidades(listUnidades);
        } else {
            setUnidades([]);
            setUnidadeId('');
            setSetores([]);
            setSetorId('');
        }
    }, [instituicaoId]);

    useEffect(() => {
        if (unidadeId && instituicaoId === 'UESB') {
            const listSetores = props.setores.filter((setor) => setor.unidade_id == unidadeId);
            setSetores(listSetores);
        } else {
            setSetores([]);
            setSetorId('');
        }
    }, [unidadeId]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        campus: '',
        setor_id: '',
        instituicao_custom: '',
        unidade_custom: '',
        setor_custom: '',
    });

    const formatPhoneNumber = (value: string) => {
        // Remove tudo que não é dígito
        const cleaned = value.replace(/\D/g, '');

        // Limita a 11 dígitos (DDD + 9 dígitos)
        const limited = cleaned.slice(0, 11);

        // Aplica a formatação conforme o tamanho do número
        if (limited.length <= 2) {
            return `(${limited}`;
        } else if (limited.length <= 7) {
            return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        } else {
            return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setData('phone', formatted);
    };

    const handleNovaInstituicaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNovaInstituicao((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitNovaInstituicao = () => {
        setData({
            ...data,
            instituicao_custom: novaInstituicao.nome,
            unidade_custom: novaInstituicao.unidade,
            setor_custom: novaInstituicao.setor,
        });
        setShowModal(false);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (instituicaoId === '') {
            alert('Por favor, selecione uma instituição');
            return;
        }

        if (instituicaoId === 'outra') {
            if (!novaInstituicao.nome || !novaInstituicao.unidade || !novaInstituicao.setor) {
                alert('Por favor, preencha os dados da nova instituição');
                return;
            }
        } else if (instituicaoId === 'UESB') {
            if (!unidadeId || !setorId) {
                alert('Por favor, selecione a unidade e o setor');
                return;
            }
        }

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
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Digite seu nome"
                                    required
                                />
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
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Número de celular:</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={handlePhoneChange}
                                    placeholder="(73) 9999-9999"
                                    required
                                    maxLength={15}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <Label htmlFor="instituicao">Instituição:</Label>
                                <select
                                    id="instituicao"
                                    value={instituicaoId}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setInstituicaoId(selected);
                                        setUnidadeId('');
                                        setSetorId('');

                                        if (selected === 'outra') {
                                            setShowModal(true);
                                        }
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    required
                                >
                                    <option value="">Selecionar</option>
                                    {instituicaoUESB && (
                                        <option key={instituicaoUESB.id} value="UESB">
                                            {instituicaoUESB.sigla}
                                        </option>
                                    )}
                                    <option value="outra">Outra instituição</option>
                                </select>
                            </div>

                            {instituicaoId !== 'nenhuma' && (
                                <>
                                    <div>
                                        <Label htmlFor="unidade">Unidade:</Label>
                                        {instituicaoId === 'outra' ? (
                                            <Input
                                                id="unidade"
                                                value={novaInstituicao.unidade}
                                                onChange={(e) => setNovaInstituicao({ ...novaInstituicao, unidade: e.target.value })}
                                                placeholder="Digite a unidade"
                                                required
                                            />
                                        ) : (
                                            <select
                                                id="unidade"
                                                value={unidadeId}
                                                onChange={(e) => {
                                                    const selected = e.target.value;
                                                    setUnidadeId(selected);
                                                    setSetorId('');
                                                }}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required={instituicaoId === 'UESB'}
                                                disabled={instituicaoId !== 'UESB'}
                                            >
                                                <option value="">Selecionar</option>
                                                {unidades.map((unidade: Unidade) => (
                                                    <option key={unidade.id} value={unidade.id}>
                                                        {unidade.sigla}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="setor">Setor:</Label>
                                        {instituicaoId === 'outra' ? (
                                            <Input
                                                id="setor"
                                                value={novaInstituicao.setor}
                                                onChange={(e) => setNovaInstituicao({ ...novaInstituicao, setor: e.target.value })}
                                                placeholder="Digite o setor"
                                                required
                                            />
                                        ) : (
                                            <select
                                                id="setor"
                                                value={setorId}
                                                onChange={(e) => {
                                                    const selected = e.target.value;
                                                    setSetorId(selected);
                                                    setData('setor_id', selected);
                                                }}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required={instituicaoId === 'UESB'}
                                                disabled={instituicaoId !== 'UESB' || !unidadeId}
                                            >
                                                <option value="">Selecionar</option>
                                                {setores.map((setor: Setor) => (
                                                    <option key={setor.id} value={setor.id}>
                                                        {setor.sigla}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <InputError message={errors.setor_id} />
                                    </div>
                                </>
                            )}

                            <div>
                                <Label htmlFor="password">Senha:</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="********"
                                    required
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
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <Button type="submit" className="w-full px-6 py-2" disabled={processing}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : (
                                    'Cadastrar'
                                )}
                            </Button>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href={route('login')} className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar para o login
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para nova instituição */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cadastrar Nova Instituição</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="novaInstituicaoNome">Nome da Instituição:</Label>
                            <Input
                                id="novaInstituicaoNome"
                                name="nome"
                                value={novaInstituicao.nome}
                                onChange={handleNovaInstituicaoChange}
                                placeholder="Digite o nome da instituição"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="novaInstituicaoUnidade">Unidade:</Label>
                            <Input
                                id="novaInstituicaoUnidade"
                                name="unidade"
                                value={novaInstituicao.unidade}
                                onChange={handleNovaInstituicaoChange}
                                placeholder="Digite a unidade"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="novaInstituicaoSetor">Setor:</Label>
                            <Input
                                id="novaInstituicaoSetor"
                                name="setor"
                                value={novaInstituicao.setor}
                                onChange={handleNovaInstituicaoChange}
                                placeholder="Digite o setor"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={submitNovaInstituicao}>Salvar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
