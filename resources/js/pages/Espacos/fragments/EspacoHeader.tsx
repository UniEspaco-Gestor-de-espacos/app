import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

type HeaderEspacoProps = {
    isGerenciarEspacos?: boolean;
};

export default function EspacoHeader({ isGerenciarEspacos }: HeaderEspacoProps) {
    return (
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{isGerenciarEspacos ? 'Gerenciar espaços' : 'Consultar espaços'}</h1>
                <p className="text-muted-foreground">
                    {isGerenciarEspacos
                        ? 'Gerencie todos os espaços disponíveis, cadastre novos,exclua ou edite os existentes'
                        : 'Todos os espaços disponíveis para reserva estão listados aqui. Você pode solicitar reservas para os espaços que desejar.'}
                </p>
            </div>
            {isGerenciarEspacos && (
                <Link href={route('institucional.espacos.create')}>
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Cadastrar Espaço
                    </Button>
                </Link>
            )}
        </header>
    );
}
