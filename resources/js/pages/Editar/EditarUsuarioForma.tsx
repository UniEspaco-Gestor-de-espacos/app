// src/Pages/Usuarios/Partials/EditarUsuarioForm.tsx

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { type Agenda, type Andar, type Espaco, type Modulo, type User } from '@/types';
import { FormEvent } from 'react';

interface EditarUsuarioFormProps {
    user: User | null;
    data: {
        name: string;
        permission_type_id: string;
        space_id: string | null;
        agendas: string[];
    };
    modulos: Modulo[];
    andares: Andar[];
    spaces: Espaco[];
    agendas: Agenda[];
    moduloSelecionado: string;
    andarSelecionado: string;
    espacosFiltrados: Espaco[];
    filteredAgendas: Agenda[];
    errors: Record<string, string>;
    processing: boolean;
    setModuloSelecionado: (value: string) => void;
    setAndarSelecionado: (value: string) => void;
    setData: (field: string, value: any) => void;
    setUserBeingEdited: (user: User | null) => void;
    handleSubmit: (e: FormEvent) => void;
}

export default function EditarUsuarioForm({
    user,
    data,
    modulos,
    andares,
    espacos,
    moduloSelecionado,
    andarSelecionado,
    espacosFiltrados,
    filteredAgendas,
    agendas,
    errors,
    processing,
    setModuloSelecionado,
    setAndarSelecionado,
    setData,
    setUserBeingEdited,
    handleSubmit,
}: EditarUsuarioFormProps) {
    const andaresFiltrados = moduloSelecionado ? andares.filter((a) => String(a.modulo_id) === moduloSelecionado) : andares;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block">Nome</label>
                <div className="bg-muted rounded border p-2">{user?.name}</div>
            </div>

            <div>
                <label className="mb-1 block">Email</label>
                <div className="bg-muted rounded border p-2">{user?.email}</div>
            </div>

            <div>
                <label className="mb-1 block">Permissão</label>
                <select
                    value={data.permission_type_id}
                    onChange={(e) => setData('permission_type_id', e.target.value)}
                    className="w-full rounded border p-2"
                >
                    <option value="">Selecione</option>
                    <option value="1">Institucional</option>
                    <option value="2">Gestor</option>
                    <option value="3">Comum</option>
                </select>
                <InputError message={errors.permission_type_id} />
            </div>

            {data.permission_type_id === '2' && (
                <>
                    <div>
                        <label className="mb-1 block">Módulo</label>
                        <select
                            value={moduloSelecionado}
                            onChange={(e) => {
                                setModuloSelecionado(e.target.value);
                                setAndarSelecionado('');
                                setData('space_id', '');
                            }}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Selecione</option>
                            {modulos.map((modulo) => (
                                <option key={modulo.id} value={modulo.id}>
                                    {modulo.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block">Andar</label>
                        <select
                            value={andarSelecionado}
                            onChange={(e) => {
                                setAndarSelecionado(e.target.value);
                                setData('space_id', '');
                            }}
                            className="w-full rounded border p-2"
                            disabled={!moduloSelecionado}
                        >
                            <option value="">Selecione</option>
                            {andaresFiltrados.map((andar) => (
                                <option key={andar.id} value={andar.id}>
                                    {andar.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block">Espaço</label>
                        <select
                            value={data.space_id ?? ''}
                            onChange={(e) => setData('space_id', e.target.value)}
                            required
                            className="w-full rounded border p-2"
                            disabled={!andarSelecionado}
                        >
                            <option value="">Selecione</option>
                            {espacosFiltrados.map((espaco) => (
                                <option key={espaco.id} value={espaco.id}>
                                    {espaco.nome}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.space_id} />
                    </div>

                    {filteredAgendas.length > 0 && (
                        <div>
                            <label className="mb-1 block">Agendas / Turnos</label>
                            <div className="flex flex-wrap gap-2">
                                {filteredAgendas.map((agenda) => (
                                    <label key={agenda.id} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            checked={data.agendas.includes(String(agenda.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('agendas', [...data.agendas, String(agenda.id)]);
                                                } else {
                                                    setData(
                                                        'agendas',
                                                        data.agendas.filter((id) => id !== String(agenda.id)),
                                                    );
                                                }
                                            }}
                                        />
                                        {agenda.turno}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                    {user?.id && user.id !== 0 ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setUserBeingEdited(null)}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
