import { Agenda, Andar, Espaco, Modulo, User } from '@/types';

interface Props {
    gestores: (User & {
        agendas?: (Agenda & {
            espaco?: Espaco & {
                andar?: Andar & {
                    modulo?: Modulo;
                };
            };
        })[];
    })[];
}

export default function TabelaGestores({ gestores }: Props) {
    // Debug para checar agendas de cada gestor
    gestores.forEach((gestor) => {
        console.log(`Gestor ${gestor.name} agendas:`, gestor.agendas);
    });

    return (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Nome</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Espaço</th>
                        <th className="p-3 text-left">Andar</th>
                        <th className="p-3 text-left">Módulo</th>
                        <th className="p-3 text-left">Turnos</th>
                    </tr>
                </thead>
                <tbody>
                    {gestores.length > 0 ? (
                        gestores.map((gestor) => (
                            <tr key={gestor.id} className="hover:bg-muted/50 border-t">
                                <td className="p-3">{gestor.id}</td>
                                <td className="p-3">{gestor.name}</td>
                                <td className="p-3">{gestor.email}</td>
                                <td className="p-3">
                                    {gestor.agendas && gestor.agendas.length > 0 ? (
                                        gestor.agendas
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
                                            .map((a) => (a.espaco?.andar ? `${a.espaco.andar.nome} (ID: ${a.espaco.andar.id})` : 'Sem andar'))
                                            .filter((v, i, arr) => arr.indexOf(v) === i)
                                            .join(', ')
                                    ) : (
                                        <span className="text-muted-foreground italic">Nenhum</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {gestor.agendas && gestor.agendas.length > 0 ? (
                                        gestor.agendas
                                            .map((a) => a.espaco?.andar?.modulo?.nome ?? 'Sem módulo')
                                            .filter((v, i, arr) => arr.indexOf(v) === i)
                                            .join(', ')
                                    ) : (
                                        <span className="text-muted-foreground italic">Nenhum</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {gestor.agendas && gestor.agendas.length > 0 ? (
                                        gestor.agendas
                                            .map((a) => a.turno ?? 'Sem turno')
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
                            <td colSpan={7} className="p-4 text-center">
                                Nenhum gestor cadastrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
