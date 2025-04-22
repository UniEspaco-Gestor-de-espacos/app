import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        campus: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen">
                {/* Lado esquerdo */}
                <div className="flex w-1/2 items-center justify-center overflow-hidden rounded-l-xl bg-blue-100">
                    <img src="/_img/sign_up.png" alt="Sign Up Illustration" className="max-h-[500px] w-auto object-contain" />
                </div>

                {/* Lado direito */}
                <div className="flex w-1/2 flex-col justify-center space-y-8 p-12 pt-0 pb-0">
                    <div className="mb-2 flex h-52 items-center justify-center">
                        <img src="/_img/Logo_uniEspaco.png" alt="Logo UniEspaço" className="max-h-full object-contain" />
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first_name">Primeiro nome:</Label>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="Digite seu nome."
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div>
                                <Label htmlFor="last_name">Sobrenome:</Label>
                                <Input
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="Digite seu nome."
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div>
                                <Label htmlFor="email">Email:</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="info@xyz.com"
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

                            <div className="col-span-2">
                                <Label htmlFor="campus">Nome do campus:</Label>
                                <Input
                                    id="campus"
                                    value={data.campus}
                                    onChange={(e) => setData('campus', e.target.value)}
                                    placeholder="Digite o nome do campus."
                                />
                                <InputError message={errors.campus} />
                            </div>
                        </div>

                        <Button type="submit" className="mt-4 w-full" disabled={processing}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Sign up'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
