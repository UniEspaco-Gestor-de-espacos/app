import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Componente reutilizável para os formulários de Criar e Editar
export default function InstituicaoForm({ data, setData, submit, errors, processing, title, description }) {
    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome da Instituição</Label>
                        <Input
                            id="nome"
                            value={data.nome}
                            onChange={(e) => setData('nome', e.target.value)}
                            placeholder="Ex: Universidade Federal da Bahia"
                        />
                        {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sigla">Sigla</Label>
                        <Input id="sigla" value={data.sigla} onChange={(e) => setData('sigla', e.target.value)} placeholder="Ex: UFBA" />
                        {errors.sigla && <p className="mt-1 text-sm text-red-500">{errors.sigla}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endereço">Endereço</Label>
                        <Input
                            id="endereço"
                            value={data.endereço}
                            onChange={(e) => setData('endereço', e.target.value)}
                            placeholder="Ex: Rua Barão de Jeremoabo, s/n"
                        />
                        {errors.endereço && <p className="mt-1 text-sm text-red-500">{errors.endereço}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Salvar'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
