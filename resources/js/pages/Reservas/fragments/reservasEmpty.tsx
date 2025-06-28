  import { CalendarX } from "lucide-react"
  import { Button } from "@/components/ui/button"

  export function ReservasEmpty() {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <CalendarX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Nenhuma reserva encontrada</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          Você ainda não possui reservas de espaços. Clique no botão abaixo para criar sua primeira reserva.
        </p>
        <Button>Criar Nova Reserva</Button>
      </div>
    )
  }
