import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteReserva(props: { id: number; isOpen?: (open: boolean) => void }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteReserva: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('reservas.destroy', { reserva: props.id }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        props.isOpen?.(false);
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title="Excluir Reserva" description="Exclua sua reserva e as informações" />

            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Aviso</p>
                    <p className="text-sm">Por favor, prossiga com cautela, esta ação não pode ser desfeita.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Excluir reserva</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Tem certeza que deseja excluir a reserva?</DialogTitle>

                        <DialogDescription>
                            Uma vez que sua reserva for excluída, todos os dados serão permanentemente removidos. Por favor, digite sua senha para
                            confirmar que deseja excluir permanentemente sua Reserva.
                        </DialogDescription>

                        <form className="space-y-6" onSubmit={deleteReserva}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    Senha
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Senha"
                                    autoComplete="current-password"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={closeModal}>
                                        Cancelar
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} asChild>
                                    <button type="submit">Excluir Reserva</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
