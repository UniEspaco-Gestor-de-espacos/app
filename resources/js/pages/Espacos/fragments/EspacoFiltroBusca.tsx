import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/lib/utils';
import { Andar, Modulo, Unidade } from '@/types';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type FiltroBuscaEspacosProps = {
    route: string;
    unidades: Unidade[];
    modulos: Modulo[];
    andares: Andar[];
    filters: {
        search?: string;
        unidade?: string;
        modulo?: string;
        andar?: string;
        capacidade?: string;
    };
};

export default function EspacoFiltroBusca(props: FiltroBuscaEspacosProps) {
    const { route, filters, unidades, modulos, andares } = props;
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        unidade: filters.unidade || 'all',
        modulo: filters.modulo || 'all',
        andar: filters.andar || 'all',
        capacidade: filters.capacidade || '',
    });
    const isInitialMount = useRef(true);
    const [debouncedSearchTerm] = useDebounce(localFilters.search, 300);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const allParams = {
            ...localFilters,
            search: debouncedSearchTerm,
        };
        const queryParams = Object.fromEntries(
            Object.entries(allParams).filter(([key, value]) => {
                if (value === null || value === '') return false;
                if (['unidade', 'modulo', 'andar'].includes(key) && value === 'all') return false;
                if (key === 'capacidade' && value === 'qualquer') return false;
                return true;
            }),
        );

        router.get(route, queryParams, {
            preserveState: true, // Mantém o estado dos filtros na página
            preserveScroll: true, // Não rola a página para o topo
            replace: true,
        });
    }, [debouncedSearchTerm, route, localFilters]);
    const handleFilterChange = (name: keyof typeof localFilters, value: string) => {
        console.log(`Filtro alterado: ${name} = ${value}`);
        setLocalFilters((prevFilters) => {
            const newFilters = { ...prevFilters, [name]: value };

            if (name === 'unidade') {
                newFilters.modulo = 'all';
                newFilters.andar = 'all';
            }
            if (name === 'modulo') {
                newFilters.andar = 'all';
            }

            return newFilters;
        });
    };

    return (
        <>
            {/* Filtros e Busca */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Busca */}
                        <div className="relative sm:col-span-2 lg:col-span-5">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Buscar por nome do espaço, andar ou módulo..."
                                className="pl-8"
                                value={localFilters.search}
                                onChange={(value) => handleFilterChange('search', value.target.value)}
                            />
                        </div>

                        {/* Filtro de Unidade */}
                        <Select value={localFilters.unidade} onValueChange={(value) => handleFilterChange('unidade', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Unidades</SelectItem>
                                {unidades.map((unidade) => (
                                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                        {unidade.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Filtro de Módulo */}
                        <Select
                            value={localFilters.modulo}
                            onValueChange={(value) => handleFilterChange('modulo', value)}
                            disabled={localFilters.unidade === 'all'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Módulo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Módulos</SelectItem>
                                {modulos.map((modulo) => (
                                    <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                        {modulo.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Filtro de Andar */}
                        <Select
                            value={localFilters.andar}
                            onValueChange={(value) => handleFilterChange('andar', value)}
                            disabled={localFilters.modulo === 'all'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Andar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Andares</SelectItem>
                                {andares.map((andar) => (
                                    <SelectItem key={andar.id} value={andar.id.toString()}>
                                        {andar.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Filtro de Capacidade */}
                        <Select value={localFilters.capacidade} onValueChange={(value) => handleFilterChange('capacidade', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Capacidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="qualquer">Qualquer</SelectItem>
                                <SelectItem value="pequeno">Pequeno (até 30)</SelectItem>
                                <SelectItem value="medio">Médio (31-100)</SelectItem>
                                <SelectItem value="grande">Grande (+100)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
