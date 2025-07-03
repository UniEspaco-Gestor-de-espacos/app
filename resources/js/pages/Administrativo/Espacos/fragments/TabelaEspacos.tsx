'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Espaco } from '@/types';
import { Edit, MoreHorizontal, Trash2, Users } from 'lucide-react';
import { GestoresEspaco } from './GestoresEspaco';

interface TabelaEspacosProps {
    espacos: Espaco[];
    onEditar: (espaco: Espaco) => void;
    onExcluir: (espaco: Espaco) => void;
    onGerenciarGestores: (espaco: Espaco) => void;
}

export function TabelaEspacos({ espacos, onEditar, onExcluir, onGerenciarGestores }: TabelaEspacosProps) {
    if (espacos.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <h2 className="text-xl font-semibold">Nenhum espaço encontrado</h2>
                        <p className="text-muted-foreground mt-2">Tente ajustar os filtros ou cadastre um novo espaço para que ele apareça aqui.</p>
                        <Button className="mt-4">Cadastrar Primeiro Espaço</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Espaços Cadastrados ({espacos.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Espaço</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead>Capacidade</TableHead>
                                <TableHead>Gestores por Turno</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {espacos.map((espaco) => (
                                <TableRow key={espaco.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {espaco.imagens && espaco.imagens.length > 0 ? (
                                                <img
                                                    src={espaco.imagens[0] || '/placeholder.svg'}
                                                    alt={espaco.nome}
                                                    className="h-12 w-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
                                                    <span className="text-muted-foreground text-xs">Sem foto</span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{espaco.nome}</div>
                                                <div className="text-muted-foreground max-w-[200px] truncate text-sm">{espaco.descricao}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">{espaco.andar?.modulo?.unidade?.instituicao?.sigla}</div>
                                            <div>{espaco.andar?.modulo?.unidade?.nome}</div>
                                            <div className="text-muted-foreground">
                                                {espaco.andar?.modulo?.nome} - {espaco.andar?.nome}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{espaco.capacidade_pessoas} pessoas</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <GestoresEspaco agendas={espaco.agendas} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEditar(espaco)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onGerenciarGestores(espaco)}>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    Gerenciar Gestores
                                                </DropdownMenuItem>
                                                <Separator />
                                                <DropdownMenuItem onClick={() => onExcluir(espaco)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
