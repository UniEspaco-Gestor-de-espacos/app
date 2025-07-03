
import { useState, useEffect, useMemo } from "react"
import type { Instituicao, Unidade, Setor } from "../types"

export function useFiltros(instituicoes: Instituicao[], unidades: Unidade[], setores: Setor[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstituicao, setSelectedInstituicao] = useState<string>("all")
  const [selectedUnidade, setSelectedUnidade] = useState<string>("all")
  const [filteredUnidades, setFilteredUnidades] = useState<Unidade[]>(unidades)

  // Filtrar unidades baseado na instituição selecionada
  useEffect(() => {
    if (selectedInstituicao === "all") {
      setFilteredUnidades(unidades)
    } else {
      const instituicao = instituicoes.find((i) => i.id.toString() === selectedInstituicao)
      const newFilteredUnidades = instituicao?.unidades || []
      setFilteredUnidades(newFilteredUnidades)

      if (selectedUnidade !== "all" && !newFilteredUnidades.find((u) => u.id.toString() === selectedUnidade)) {
        setSelectedUnidade("all")
      }
    }
  }, [selectedInstituicao, instituicoes, unidades, selectedUnidade])

  // Filtrar setores baseado nos filtros aplicados
  const filteredSetores = useMemo(() => {
    return setores.filter((setor) => {
      const matchesSearch =
        searchTerm === "" ||
        setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setor.sigla.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesInstituicao =
        selectedInstituicao === "all" || setor.unidade?.instituicao?.id.toString() === selectedInstituicao

      const matchesUnidade = selectedUnidade === "all" || setor.unidade?.id.toString() === selectedUnidade

      return matchesSearch && matchesInstituicao && matchesUnidade
    })
  }, [setores, searchTerm, selectedInstituicao, selectedUnidade])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedInstituicao("all")
    setSelectedUnidade("all")
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedInstituicao,
    setSelectedInstituicao,
    selectedUnidade,
    setSelectedUnidade,
    filteredUnidades,
    filteredSetores,
    clearFilters,
  }
}
