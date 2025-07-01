'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, Select as SelectUI, SelectValue } from '@/components/ui/select';
import { gerarOpcoesAndares } from '@/lib/utils/AndarOptions';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AndarFormCardProps {
    andar: {
        nome: string;
        tipo_acesso: string[];
    };
    index: number;
    onUpdate: (index: number, andar: { nome: string; tipo_acesso: string[] }) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
    errors?: Record<string, string>;
}

const tiposDeAcesso = [
    { id: 'terreo', label: 'Térreo' },
    { id: 'escada', label: 'Escada' },
    { id: 'elevador', label: 'Elevador' },
    { id: 'rampa', label: 'Rampa' },
];

export default function AndarFormCard({ andar, index, onUpdate, onRemove, canRemove, errors }: AndarFormCardProps) {
    const [isOpen, setIsOpen] = useState(true);

    const handleNomeChange = (nome: string) => {
        onUpdate(index, { ...andar, nome });
    };

    const handleTipoAcessoChange = (tipoId: string, checked: boolean) => {
        const newTiposAcesso = checked ? [...andar.tipo_acesso, tipoId] : andar.tipo_acesso.filter((tipo) => tipo !== tipoId);

        onUpdate(index, { ...andar, tipo_acesso: newTiposAcesso });
    };

    const getAndarLabel = () => {
        const opcoes = gerarOpcoesAndares();
        return opcoes.find((opcao) => opcao.value === andar.nome)?.label || 'Selecione o andar';
    };

    const hasErrors = errors?.[`andares.${index}.nome`] || errors?.[`andares.${index}.tipo_acesso`];

    return (
        <Card className={`relative ${hasErrors ? 'border-red-200' : ''}`}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex h-auto items-center gap-2 p-0 font-semibold">
                                <span>Andar {index + 1}</span>
                                {andar.nome && <span className="text-muted-foreground text-sm font-normal">- {getAndarLabel()}</span>}
                                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                        <div className="flex items-center gap-2">
                            {andar.tipo_acesso.length > 0 && (
                                <div className="flex gap-1">
                                    {andar.tipo_acesso.slice(0, 2).map((tipo) => (
                                        <span key={tipo} className="bg-secondary rounded px-2 py-1 text-xs">
                                            {tiposDeAcesso.find((t) => t.id === tipo)?.label}
                                        </span>
                                    ))}
                                    {andar.tipo_acesso.length > 2 && (
                                        <span className="text-muted-foreground text-xs">+{andar.tipo_acesso.length - 2}</span>
                                    )}
                                </div>
                            )}
                            {canRemove && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onRemove(index)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="space-y-3 pt-0">
                        {/* Nome do Andar */}
                        <div className="space-y-2">
                            <Label htmlFor={`andar-nome-${index}`} className="text-sm">
                                Nome do Andar
                            </Label>
                            <SelectUI value={andar.nome} onValueChange={(value) => handleNomeChange(value)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Selecione o andar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gerarOpcoesAndares().map((opcao) => (
                                        <SelectItem key={opcao.value} value={opcao.value}>
                                            {opcao.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectUI>
                            {errors?.[`andares.${index}.nome`] && <p className="text-xs text-red-500">{errors[`andares.${index}.nome`]}</p>}
                        </div>

                        {/* Tipos de Acesso */}
                        <div className="space-y-2">
                            <Label className="text-sm">Tipos de Acesso</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {tiposDeAcesso.map((tipo) => (
                                    <div key={tipo.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${index}-${tipo.id}`}
                                            checked={andar.tipo_acesso.includes(tipo.id)}
                                            onCheckedChange={(checked) => handleTipoAcessoChange(tipo.id, checked as boolean)}
                                        />
                                        <Label htmlFor={`${index}-${tipo.id}`} className="cursor-pointer text-xs font-normal">
                                            {tipo.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors?.[`andares.${index}.tipo_acesso`] && (
                                <p className="text-xs text-red-500">{errors[`andares.${index}.tipo_acesso`]}</p>
                            )}
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
