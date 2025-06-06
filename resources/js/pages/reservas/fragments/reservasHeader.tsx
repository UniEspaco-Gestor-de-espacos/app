import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function ReservasHeader() {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Minhas Reservas</h1>
                <p className="text-muted-foreground">Gerencie suas solicitações de reservas de espaços acadêmicos</p>
            </div>
            <Button  className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Reserva
            </Button>
        </div>
    );
}
