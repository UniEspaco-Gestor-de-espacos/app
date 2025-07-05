import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { diasSemanaParser, formatDate, getStatusReservaColor, getStatusReservaText, getTurnoText } from '@/lib/utils';
import { BreadcrumbItem, Reserva, SituacaoReserva } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, CalendarDays, CheckCircle, Clock, FileText, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerenciar Reservas',
        href: '/gestor/reservas',
    },
    {
        title: 'Avaliar reserva',
        href: '/gestor/reservas',
    },
];

type FormAvaliacaoType = {
    situacao: SituacaoReserva;
    motivo: string;
};

export default function AvaliarReserva() {
    const { props } = usePage<{ reserva: Reserva }>();
    const reserva = props.reserva;
    const { setData, patch, reset } = useForm<FormAvaliacaoType>({
        situacao: reserva.situacao,
        motivo: '',
    });

    const [decisao, setDecisao] = useState<SituacaoReserva>(reserva.situacao);
    const [motivo, setMotivo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setData('situacao', decisao);
    }, [decisao, setData]);

    useEffect(() => {
        setData('motivo', motivo);
    }, [motivo, setData]);
    const getSituacaoIcon = (situacao: string) => {
        switch (situacao) {
            case 'deferida':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'indeferida':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-600" />;
        }
    };
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!decisao) return;
        if (decisao === 'indeferida' && !motivo.trim()) {
            alert('Motivo é obrigatório para reservas indeferidas');
            return;
        }
        setIsSubmitting(true);

        patch(route('gestor.reservas.update', reserva.id), {
            onSuccess: () => {
                reset();
            },
            onError: (error) => {
                const firstError = Object.values(error)[0];
                toast.error(firstError || 'Ocorreu um erro de validação. Verifique os campos');
            },
        });
        setIsSubmitting(false);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Avaliar reserva" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="container mx-auto space-y-6 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Avaliar Reserva</h1>
                                <p className="mt-1 text-gray-600">
                                    Espaço: {reserva.horarios[0].agenda?.espaco?.nome} / {reserva.horarios[0].agenda?.espaco?.andar?.nome}/{' '}
                                    {reserva.horarios[0].agenda?.espaco?.andar?.modulo?.nome} / {getTurnoText(reserva.horarios[0].agenda!.turno)}{' '}
                                </p>
                            </div>
                            <Badge className={`${getStatusReservaColor(reserva.situacao)} flex items-center gap-1`}>
                                {getSituacaoIcon(reserva.situacao)}
                                {getStatusReservaText(reserva.situacao)}
                            </Badge>
                        </div>

                        {/* Informações da Reserva */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {reserva.titulo}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Solicitado por: {reserva.user?.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="mb-2 font-medium text-gray-900">Descrição</h4>
                                    <p className="rounded-lg bg-gray-50 p-3 text-gray-700">{reserva.descricao}</p>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Período</p>
                                            <p className="font-medium">
                                                {formatDate(reserva.data_inicial)} até {formatDate(reserva.data_final)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                        <Clock className="h-4 w-4" />
                                        Horários Solicitados
                                    </h4>
                                    <div className="grid gap-2">
                                        {reserva.horarios.map((horario) => {
                                            const dia = new Date(horario.data);
                                            return (
                                                <div key={horario.id} className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                                    <span className="font-medium text-blue-900">{diasSemanaParser[dia.getDay()]}</span>
                                                    <span className="text-blue-700">
                                                        {horario.horario_inicio} às {horario.horario_fim}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Avaliação */}
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avaliação da Reserva</CardTitle>
                                    <CardDescription>Defina se a reserva será deferida ou indeferida</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-base font-medium">Decisão</Label>
                                        <RadioGroup value={decisao} onValueChange={(value) => setDecisao(value as 'deferida' | 'indeferida')}>
                                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-green-50">
                                                <RadioGroupItem value="deferida" id="deferida" />
                                                <Label htmlFor="deferida" className="flex cursor-pointer items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    Deferir Reserva
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-red-50">
                                                <RadioGroupItem value="indeferida" id="indeferida" />
                                                <Label htmlFor="indeferida" className="flex cursor-pointer items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                    Indeferir Reserva
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {decisao === 'indeferida' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="motivo" className="text-base font-medium text-red-700">
                                                Motivo do Indeferimento *
                                            </Label>
                                            <Textarea
                                                id="motivo"
                                                placeholder="Descreva o motivo pelo qual a reserva está sendo indeferida..."
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                                className="min-h-[100px] border-red-200 focus:border-red-500"
                                            />
                                            <p className="text-sm text-red-600">Este campo é obrigatório para reservas indeferidas</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!decisao || (decisao === 'indeferida' && !motivo.trim()) || isSubmitting}
                                            className="flex-1"
                                        >
                                            {isSubmitting ? 'Processando...' : 'Confirmar Avaliação'}
                                        </Button>
                                        <Button variant="outline" className="px-8">
                                            Cancelar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
