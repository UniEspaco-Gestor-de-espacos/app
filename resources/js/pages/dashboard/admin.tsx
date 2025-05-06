import { FileText, PieChart, Search, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo
const userStats = {
  total: 245,
  professors: 180,
  staff: 45,
  admins: 20,
}

const spaceStats = {
  total: 85,
  available: 62,
  reserved: 18,
  unavailable: 5,
}

const reservationStats = {
  total: 1250,
  thisMonth: 320,
  pending: 45,
  approved: 1150,
  rejected: 55,
}

export function AdminDashboard() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários e Permissões</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total de Usuários</p>
              <p className="text-xl md:text-2xl font-bold">{userStats.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Professores</p>
              <p className="text-xl md:text-2xl font-bold">{userStats.professors}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Funcionários</p>
              <p className="text-xl md:text-2xl font-bold">{userStats.staff}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Administradores</p>
              <p className="text-xl md:text-2xl font-bold">{userStats.admins}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button variant="outline" size="sm">
            Gerenciar Professores
          </Button>
          <Button variant="outline" size="sm">
            Gerenciar Setores
          </Button>
          <Button size="sm">Adicionar Usuário</Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Espaços e Gestores</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total de Espaços</p>
              <p className="text-xl md:text-2xl font-bold">{spaceStats.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Disponíveis</p>
              <p className="text-xl md:text-2xl font-bold text-green-500">{spaceStats.available}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Reservados</p>
              <p className="text-xl md:text-2xl font-bold text-amber-500">{spaceStats.reserved}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Indisponíveis</p>
              <p className="text-xl md:text-2xl font-bold text-red-500">{spaceStats.unavailable}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button variant="outline" size="sm">
            Gerenciar Espaços
          </Button>
          <Button variant="outline" size="sm">
            Gerenciar Gestores
          </Button>
          <Button size="sm">Adicionar Espaço</Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Relatórios / Visões Gerais</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="spaces">Por Espaço</TabsTrigger>
              <TabsTrigger value="departments">Por Setor</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total de Reservas</p>
                  <p className="text-xl md:text-2xl font-bold">{reservationStats.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Este Mês</p>
                  <p className="text-xl md:text-2xl font-bold">{reservationStats.thisMonth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                  <p className="text-xl md:text-2xl font-bold">{reservationStats.pending}</p>
                </div>
              </div>
              <div className="h-[200px] rounded-md border bg-muted/50 p-4">
                <div className="h-full w-full rounded-md bg-muted/50 flex items-center justify-center">
                  Gráfico de Reservas por Período
                </div>
              </div>
            </TabsContent>
            <TabsContent value="spaces">
              <div className="h-[250px] rounded-md border bg-muted/50 p-4">
                <div className="h-full w-full rounded-md bg-muted/50 flex items-center justify-center">
                  Gráfico de Reservas por Espaço
                </div>
              </div>
            </TabsContent>
            <TabsContent value="departments">
              <div className="h-[250px] rounded-md border bg-muted/50 p-4">
                <div className="h-full w-full rounded-md bg-muted/50 flex items-center justify-center">
                  Gráfico de Reservas por Setor
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <FileText className="mr-2 h-4 w-4" /> Exportar Relatórios
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Filtros Avançados e Consultas</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium">Período</label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input type="date" className="w-full" placeholder="Data inicial" />
                <Input type="date" className="w-full" placeholder="Data final" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Filtros</label>
              <div className="flex space-x-2">
                <Input className="w-full" placeholder="Espaço ou Setor" />
                <Button variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-md border bg-muted/50 p-4">
            <div className="h-[150px] w-full rounded-md bg-muted/50 flex items-center justify-center">
              Resultados da Consulta
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button variant="outline" size="sm">
            Limpar Filtros
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" /> Exportar Dados
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
