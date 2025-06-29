import espacoImage from '@/assets/espaco.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPrimeirosDoisNomes, getTurnoText } from '@/lib/utils';
import { Espaco } from '@/types';
import { Calendar, Edit, Home, Users } from 'lucide-react';

type CardEspacoProps = {
    espaco: Espaco;
    userType: number;
    isGerenciarEspacos?: boolean;
    handleSolicitarReserva?: (espacoId: string) => void;
    handleDetalhesEspaco?: (espacoId: string) => void;
    handleEditarEspaco?: (espacoId: string) => void;
    handleExcluirEspaco?: (espacoId: string) => void;
};

export default function EspacoCard({
    espaco,
    userType,
    isGerenciarEspacos,
    handleSolicitarReserva,
    handleDetalhesEspaco,
    handleEditarEspaco,
    handleExcluirEspaco,
}: CardEspacoProps) {
    // Helper para formatar a localização
    const formatarLocalizacao = (espaco: Espaco): string => {
        return `${espaco.andar?.modulo?.unidade?.nome} > ${espaco.andar?.modulo?.nome} > ${espaco?.andar?.nome}`;
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <img
                    src={espaco.main_image_index ? `/storage/${espaco.main_image_index}` : espacoImage}
                    alt={espaco.nome}
                    className="object-absolute h-40 w-full"
                />
            </CardHeader>
            <CardContent className="pt-6">
                <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">Espaço: {espaco.nome}</CardTitle>
                </div>

                <div className="espaco-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <Users className="text-muted-foreground h-4 w-4" />
                        <span>Capacidade: {espaco.capacidade_pessoas} pessoas</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Home className="text-muted-foreground h-4 w-4" />
                        <span>{formatarLocalizacao(espaco)}</span>
                    </div>

                    <div className="space-y-2">
                        <span className="text-muted-foreground">Gestores por turno:</span>
                        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
                            {espaco.agendas?.map((agenda) => (
                                <div key={agenda.id} className="flex flex-col items-center text-center">
                                    <span className="text-muted-foreground text-sm font-semibold">{getTurnoText(agenda.turno)}</span>
                                    <span className="mt-1 text-sm">{getPrimeirosDoisNomes(agenda.user?.name)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 pt-0">
                {isGerenciarEspacos && userType === 1 ? (
                    <>
                        <Button variant="outline" size="sm" onClick={() => handleDetalhesEspaco?.(espaco.id.toString())}>
                            <Edit className="mr-2 h-4 w-4" />
                            Ver Detalhes
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleEditarEspaco?.(espaco.id.toString())}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Espaço
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleExcluirEspaco?.(espaco.id.toString())}>
                            <Edit className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </>
                ) : (
                    <Button variant="default" size="sm" onClick={() => handleSolicitarReserva?.(espaco.id.toString())}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver agenda
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
