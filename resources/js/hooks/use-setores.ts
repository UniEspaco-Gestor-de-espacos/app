import { useState, useCallback } from "react"
import { Setor, Unidade } from "@/types"
import { SetorFormData } from "@/pages/Administrativo/Setores/fragments/SetorForm"

export function useSetores(listSetores: Setor[] = []) {
  const [setores, setSetores] = useState<Setor[]>(listSetores)

  
  return {
    setores,
    createSetor,
    updateSetor,
    deleteSetor,
  }
}
