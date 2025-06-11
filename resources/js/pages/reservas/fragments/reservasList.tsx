import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatDateTime, pegarPrimeiroHorario, pegarUltimoHorario } from '@/lib/utils';
import { ReservaHorarios } from '@/types';
import { router } from '@inertiajs/react';
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Edit, Eye, XCircle, XSquare } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { ReservaCard, SituacaoIndicator } from './reservaCard';

// Tipos baseados no modelo de dados fornecido
type Situacao = 'em_analise' | 'deferida' | 'indeferida';

// Componente para exibir o status da reserva com cores e ícones apropriados
function SituacaoBadge({ situacao }: { situacao: Situacao }) {
    switch (situacao) {
        case 'em_analise':
            return (
                <Badge variant="outline" className="flex items-center gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
                    <Clock className="h-3 w-3" />
                    Em analise
                </Badge>
            );
        case 'deferida':
            return (
                <Badge variant="outline" className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Deferida
                </Badge>
            );
        case 'indeferida':
            return (
                <Badge variant="outline" className="flex items-center gap-1 border-red-200 bg-red-50 text-red-700">
                    <XSquare className="h-3 w-3" />
                    Indeferida
                </Badge>
            );
        default:
            return null;
    }
}

// Componente principal da lista de reservas
export function ReservasList({
    fallback,
    reservas,
    isGestor = false,
}: {
    fallback: React.ReactNode;
    reservas: ReservaHorarios[];
    isGestor?: boolean;
}) {
    const [page, setPage] = useState(1);
    const [view, setView] = useState<'table' | 'cards'>('table');
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    if (reservas.length === 0) {
        return fallback;
    }
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="flex items-center space-x-2">
                    <Button variant={view === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setView('table')} className="hidden sm:flex">
                        Tabela
                    </Button>
                    <Button variant={view === 'cards' ? 'default' : 'outline'} size="sm" onClick={() => setView('cards')}>
                        Cartões
                    </Button>
                </div>
            </div>

            {view === 'table' ? (
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead className="hidden md:table-cell">Situação</TableHead>
                                <TableHead className="hidden md:table-cell">Local</TableHead>
                                <TableHead className="hidden lg:table-cell">Data de Início</TableHead>
                                <TableHead className="hidden lg:table-cell">Data de Término</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservas.map((reserva) => (
                                <TableRow key={reserva.reserva.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            {reserva.reserva.titulo}
                                            <p className="text-muted-foreground hidden text-sm sm:block">
                                                {reserva.reserva.descricao.substring(0, 60)}
                                                {reserva.reserva.descricao.length > 60 ? '...' : ''}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <SituacaoBadge situacao={reserva.reserva.situacao} />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div>
                                            <p>
                                                Espaço: {reserva.espaco.nome} / {reserva.andar.nome} / {reserva.modulo.nome}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell">{formatDate(reserva.reserva.data_inicial)}</TableCell>
                                    <TableCell className="hidden lg:table-cell"> {formatDate(reserva.reserva.data_final)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        Detalhes
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>{reserva.reserva.titulo}</DialogTitle>
                                                        <DialogDescription asChild>
                                                            <SituacaoIndicator situacao={reserva.reserva.situacao} />
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium">Descrição</h4>
                                                            <p className="text-muted-foreground text-sm">{reserva.reserva.descricao}</p>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium">Data de Início</h4>
                                                                <p className="text-sm">{pegarPrimeiroHorario(reserva.horarios).horario_inicio}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium">Data de Término</h4>
                                                                <p className="text-sm">{pegarUltimoHorario(reserva.horarios).horario_fim}</p>
                                                            </div>
                                                        </div>

                                                        {reserva.reserva.observacao && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium">Observações</h4>
                                                                <p className="text-muted-foreground text-sm">{reserva.reserva.observacao}</p>
                                                            </div>
                                                        )}

                                                        <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                                                            <div>
                                                                <p>Criado em: {formatDateTime(reserva.reserva.created_at)}</p>
                                                            </div>
                                                            <div>
                                                                <p>Atualizado em: {formatDateTime(reserva.reserva.updated_at)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                            Fechar
                                                        </Button>
                                                        {reserva.reserva.situacao === 'em_analise' && (
                                                            <>
                                                                {isGestor ? (
                                                                    <div>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                router.visit(`/gestor/reservas/${reserva.reserva.id}`);
                                                                            }}
                                                                        >
                                                                            <Edit className="mr-1 h-4 w-4" />
                                                                            Avaliar
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <Button variant="outline">
                                                                            <Edit className="mr-1 h-4 w-4" />
                                                                            Editar
                                                                        </Button>
                                                                        <Button variant="destructive">
                                                                            <XCircle className="mr-1 h-4 w-4" />
                                                                            Cancelar
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            {reserva.reserva.situacao === 'em_analise' && (
                                                <>
                                                    {isGestor ? (
                                                        <div>
                                                            <Button
                                                                onClick={() => {
                                                                    router.visit(`/gestor/reservas/${reserva.reserva.id}`);
                                                                }}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                title="Avaliar"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Avaliar</span>
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">Editar</span>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Cancelar">
                                                                <XCircle className="h-4 w-4" />
                                                                <span className="sr-only">Cancelar</span>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reservas.map((reserva: ReservaHorarios, index: number) => (
                        <ReservaCard key={index} {...reserva} />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-center space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                </Button>
                <div className="text-muted-foreground text-sm">Página {page} de 1</div>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={true}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                </Button>
            </div>
        </div>
    );
}
