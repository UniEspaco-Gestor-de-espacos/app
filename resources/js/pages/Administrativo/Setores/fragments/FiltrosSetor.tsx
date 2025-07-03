import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Instituicao, Unidade } from '@/types';
import { Building2, Filter, MapPin, Search } from 'lucide-react';

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedInstituicao: string;
    setSelectedInstituicao: (value: string) => void;
    selectedUnidade: string;
    setSelectedUnidade: (value: string) => void;
    instituicoes: Instituicao[];
    unidades: Unidade[];
    filteredUnidades: Unidade[];
    onClearFilters: () => void;
}

export function FiltrosSetor({
    searchTerm,
    setSearchTerm,
    selectedInstituicao,
    setSelectedInstituicao,
    selectedUnidade,
    setSelectedUnidade,
    instituicoes,
    filteredUnidades,
    onClearFilters,
}: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Buscar</label>
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Nome ou sigla do setor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instituição</label>
                        <Select value={selectedInstituicao} onValueChange={setSelectedInstituicao}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as instituições" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as instituições</SelectItem>
                                {instituicoes.map((instituicao) => (
                                    <SelectItem key={instituicao.id} value={instituicao.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            {instituicao.sigla} - {instituicao.nome}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Unidade</label>
                        <Select value={selectedUnidade} onValueChange={setSelectedUnidade}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as unidades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as unidades</SelectItem>
                                {filteredUnidades.map((unidade) => (
                                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {unidade.sigla} - {unidade.nome}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button variant="outline" onClick={onClearFilters} className="flex-1 bg-transparent">
                            Limpar Filtros
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
