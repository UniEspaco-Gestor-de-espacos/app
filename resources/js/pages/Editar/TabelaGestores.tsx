import { Agenda, Espaco, User } from '@/types';

// Tipagem das props que o componente vai receber
interface Props {
    // A estrutura de dados que a tabela precisa para funcionar
    gestores: (User & { agendas?: (Agenda & { espaco?: Espaco })[] })[];
}

// O componente agora renderiza apenas a tabela, tornando-o reutilizável
export default function TabelaGestores({ gestores }: Props) {
    return (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted">
                        <th className="p-3 text-left">Nome</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Espaço</th>
                        <th className="p-3 text-left">Turnos</th>
                    </tr>
                </thead>
                <tbody>
                    {gestores.length > 0 ? (
                        gestores.map((gestor) => (
                            <tr key={gestor.id} className="hover:bg-muted/50 border-t">
                                <td className="p-3">{gestor.name}</td>
                                <td className="p-3">{gestor.email}</td>
                                <td className="p-3">
                                    {gestor.agendas && gestor.agendas.length > 0 ? (
                                        gestor.agendas
                                            // A lógica da tabela já espera o 'espaco' aninhado
                                            .map((a) => a.espaco?.nome ?? 'Sem espaço')
                                            .filter((v, i, arr) => arr.indexOf(v) === i)
                                            .join(', ')
                                    ) : (
                                        <span className="text-muted-foreground italic">Nenhum</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {gestor.agendas && gestor.agendas.length > 0 ? (
                                        gestor.agendas
                                            .map((a) => a.turno)
                                            .filter((v, i, arr) => arr.indexOf(v) === i)
                                            .join(', ')
                                    ) : (
                                        <span className="text-muted-foreground italic">Nenhum</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-4 text-center">
                                Nenhum gestor cadastrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}