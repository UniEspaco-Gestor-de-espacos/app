import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate, formatDateTime, getStatusReservaColor, getStatusReservaText, pegarPrimeiroHorario, pegarUltimoHorario } from '@/lib/utils';
import { ReservaHorarios, SituacaoReserva } from '@/types';
import { Calendar, Clock, Edit, Eye, XCircle } from 'lucide-react';
import { useState } from 'react';

// Componente para exibir o status da reserva com cores e ícones apropriados
export function SituacaoIndicator({ situacao }: { situacao: SituacaoReserva }) {
    return (
        <span className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${getStatusReservaColor(situacao)}`}></span>
            <span className="text-sm font-medium">{getStatusReservaText(situacao)}</span>
        </span>
    );
}

export function ReservaCard(reservaHorarios: ReservaHorarios) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { reserva, horarios } = reservaHorarios;
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{reserva.titulo}</h3>
                    <SituacaoIndicator situacao={reserva.situacao} />
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="text-muted-foreground mb-4 text-sm">{reserva.descricao}</p>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>
                            {formatDate(reserva.data_inicial)} - {formatDate(reserva.data_final)}
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>
                            {pegarPrimeiroHorario(horarios).horario_inicio} - {pegarUltimoHorario(horarios).horario_fim}
                        </span>
                    </div>
                </div>

                {reserva.observacao && reserva.situacao === 'indeferida' && (
                    <div className="bg-muted mt-4 rounded-md p-2 text-xs">
                        <p className="font-semibold">Observações:</p>
                        <p>{reserva.observacao}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-4 w-4" />
                            Detalhes
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{reserva.titulo}</DialogTitle>
                            <DialogDescription>
                                <SituacaoIndicator situacao={reserva.situacao} />
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Descrição</h4>
                                <p className="text-muted-foreground text-sm">{reserva.descricao}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Data de Início</h4>
                                    <p className="text-sm">{pegarPrimeiroHorario(horarios).horario_inicio}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Data de Término</h4>
                                    <p className="text-sm">{pegarUltimoHorario(horarios).horario_fim}</p>
                                </div>
                            </div>

                            {reserva.observacao && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Observações</h4>
                                    <p className="text-muted-foreground text-sm">{reserva.observacao}</p>
                                </div>
                            )}

                            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                                <div>
                                    <p>Criado em: {formatDateTime(reserva.created_at)}</p>
                                </div>
                                <div>
                                    <p>Atualizado em: {formatDateTime(reserva.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Fechar
                            </Button>
                            {reserva.situacao === 'em_analise' && (
                                <>
                                    <Button variant="outline">
                                        <Edit className="mr-1 h-4 w-4" />
                                        Editar
                                    </Button>
                                    <Button variant="destructive">
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Cancelar
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {reserva.situacao === 'em_analise' && (
                    <>
                        <Button variant="ghost" size="sm">
                            <Edit className="mr-1 h-4 w-4" />
                            Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="mr-1 h-4 w-4" />
                            Cancelar
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
