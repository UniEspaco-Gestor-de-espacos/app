"use client"

import { Bell, CheckCircle, Clock, History, Home, Plus, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dados de exemplo
const pendingRequests = 8

const managedSpaces = [
  {
    id: "1",
    name: "Laboratório de Informática 3",
    status: "available",
  },
  {
    id: "2",
    name: "Laboratório de Informática 4",
    status: "reserved",
  },
  {
    id: "3",
    name: "Sala de Videoconferência",
    status: "unavailable",
  },
  {
    id: "4",
    name: "Laboratório de Redes",
    status: "available",
  },
]

const scheduledUnavailability = [
  {
    id: "1",
    spaceName: "Laboratório de Informática 3",
    startDate: "20/05/2023",
    endDate: "25/05/2023",
    reason: "Manutenção de Equipamentos",
  },
  {
    id: "2",
    spaceName: "Sala de Videoconferência",
    startDate: "15/05/2023",
    endDate: "16/05/2023",
    reason: "Atualização de Software",
  },
]

const decisionHistory = [
  {
    id: "1",
    spaceName: "Laboratório de Informática 3",
    requester: "Prof. Carlos Silva",
    date: "12/05/2023",
    time: "14:00 - 16:00",
    decision: "approved",
  },
  {
    id: "2",
    spaceName: "Laboratório de Redes",
    requester: "Prof. Ana Oliveira",
    date: "11/05/2023",
    time: "10:00 - 12:00",
    decision: "rejected",
    reason: "Conflito de horário",
  },
  {
    id: "3",
    spaceName: "Sala de Videoconferência",
    requester: "Prof. Marcos Santos",
    date: "10/05/2023",
    time: "15:00 - 17:00",
    decision: "approved",
  },
  {
    id: "4",
    spaceName: "Laboratório de Informática 4",
    requester: "Prof. Juliana Costa",
    date: "09/05/2023",
    time: "08:00 - 10:00",
    decision: "approved",
  },
]

export function ManagerDashboard() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{pendingRequests} solicitações</div>
          <p className="text-xs text-muted-foreground">Aguardando sua análise</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Ver Solicitações</Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Espaços que Gerencio</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
            {managedSpaces.map((space) => (
              <div key={space.id} className="flex items-center justify-between rounded-lg border p-2">
                <div className="font-medium truncate mr-2">{space.name}</div>
                <Badge
                  className={
                    space.status === "available"
                      ? "bg-green-500 hover:bg-green-600"
                      : space.status === "reserved"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-red-500 hover:bg-red-600"
                  }
                >
                  {space.status === "available" ? "Livre" : space.status === "reserved" ? "Reservado" : "Indisponível"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Gerenciar Espaços
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Indisponibilidades Agendadas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scheduledUnavailability.map((unavailability) => (
              <div key={unavailability.id} className="rounded-lg border p-2">
                <div className="font-medium truncate">{unavailability.spaceName}</div>
                <div className="text-xs text-muted-foreground">
                  {unavailability.startDate} até {unavailability.endDate}
                </div>
                <div className="text-xs">{unavailability.reason}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> Nova
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Histórico de Decisões</CardTitle>
          <History className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Espaço</TableHead>
                  <TableHead className="hidden sm:table-cell">Solicitante</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden lg:table-cell">Horário</TableHead>
                  <TableHead>Decisão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionHistory.map((decision) => (
                  <TableRow key={decision.id}>
                    <TableCell className="font-medium">{decision.spaceName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{decision.requester}</TableCell>
                    <TableCell className="hidden md:table-cell">{decision.date}</TableCell>
                    <TableCell className="hidden lg:table-cell">{decision.time}</TableCell>
                    <TableCell>
                      {decision.decision === "approved" ? (
                        <div className="flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                          <span className="text-green-500">Aprovada</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="mr-1 h-4 w-4 text-red-500" />
                          <span className="text-red-500">Recusada</span>
                        </div>
                      )}
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
