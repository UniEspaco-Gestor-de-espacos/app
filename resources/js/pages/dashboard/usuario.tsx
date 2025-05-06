
import { CalendarClock, Clock, History, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dados de exemplo
const nextReservation = {
  spaceName: "Laboratório de Informática 3",
  date: "15/05/2023",
  startTime: "14:00",
  endTime: "16:00",
}

const reservationStatus = {
  pending: 2,
  approved: 3,
  rejected: 1,
}

const reservationHistory = [
  {
    id: "1",
    spaceName: "Auditório Principal",
    date: "10/05/2023",
    time: "09:00 - 11:00",
    status: "approved",
  },
  {
    id: "2",
    spaceName: "Sala de Reuniões 2",
    date: "05/05/2023",
    time: "13:00 - 14:00",
    status: "approved",
  },
  {
    id: "3",
    spaceName: "Laboratório de Química",
    date: "03/05/2023",
    time: "15:00 - 17:00",
    status: "rejected",
  },
  {
    id: "4",
    spaceName: "Sala 101",
    date: "28/04/2023",
    time: "08:00 - 10:00",
    status: "approved",
  },
  {
    id: "5",
    spaceName: "Sala de Videoconferência",
    date: "25/04/2023",
    time: "14:00 - 15:00",
    status: "pending",
  },
]

export function UserDashboard() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próxima Reserva</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold truncate">{nextReservation.spaceName}</div>
          <p className="text-xs text-muted-foreground">
            {nextReservation.date} • {nextReservation.startTime} às {nextReservation.endTime}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Ver detalhes
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status das Minhas Reservas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{reservationStatus.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando</p>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{reservationStatus.approved}</div>
              <p className="text-xs text-muted-foreground">Aprovadas</p>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{reservationStatus.rejected}</div>
              <p className="text-xs text-muted-foreground">Recusadas</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Ver todas
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitar Nova Reserva</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Crie uma nova solicitação de reserva para salas, laboratórios ou auditórios.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Nova Reserva</Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Histórico de Reservas</CardTitle>
          <History className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Espaço</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Horário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationHistory.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.spaceName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{reservation.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{reservation.time}</TableCell>
                    <TableCell>
                      {reservation.status === "approved" && (
                        <Badge className="bg-green-500 hover:bg-green-600">Aprovada</Badge>
                      )}
                      {reservation.status === "pending" && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          Pendente
                        </Badge>
                      )}
                      {reservation.status === "rejected" && <Badge variant="destructive">Recusada</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Ver histórico completo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
