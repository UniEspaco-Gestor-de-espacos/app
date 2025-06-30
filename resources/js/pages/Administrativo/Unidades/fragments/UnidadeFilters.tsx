import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Instituicao } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';

type UnidadesFiltersProps = {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    instituicoes: Instituicao[];
    selectedInstituicao: Instituicao | undefined;
    onInstituicaoChange: (instituicao: Instituicao | undefined) => void;
};

export function UnidadeFilters({ searchTerm, onSearchTermChange, instituicoes, onInstituicaoChange }: UnidadesFiltersProps) {
    const [selectedInstituicao, setSelectedInstituicao] = useState<Instituicao | undefined>(undefined);
    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                    type="search"
                    placeholder="Buscar por nome"
                    className="w-full pl-8"
                    value={searchTerm} // 3. O valor vem das props
                    onChange={(e) => onSearchTermChange(e.target.value)} // 4. A mudança notifica o pai
                />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                    value={selectedInstituicao?.id.toString()} // 5. O valor vem das props
                    onValueChange={(value) => {
                        setSelectedInstituicao(instituicoes.find((i) => i.id.toString() === value));
                        onInstituicaoChange(instituicoes.find((i) => i.id.toString() === value));
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Instituição" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {instituicoes.map((instituicao) => (
                            <SelectItem value={instituicao.id.toString()}>{instituicao.sigla}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
