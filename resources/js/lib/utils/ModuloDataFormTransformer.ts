import { CadastrarModuloForm } from "@/pages/Administrativo/Modulos/CadastrarModulo";
import { Modulo } from "@/types";
/**
 * Transforma os dados do backend (Modulo) para o formato do formulário
 */
export function transformModuloToFormData(modulo: Modulo): CadastrarModuloForm {
  return {
    nome: modulo.nome || "",
    unidade_id: modulo.unidade?.id.toString() || "",
    andares:
      modulo.andars?.map((andar) => ({
        nome: andar.nome || "",
        tipo_acesso: Array.isArray(andar.tipo_acesso) ? andar.tipo_acesso : [],
      })) || [],
  }
}

/**
 * Transforma os dados do formulário para o formato do backend
 */
export function transformFormDataToModulo(formData: CadastrarModuloForm): {
  nome: string
  unidade_id: number
  andares: {
    nome: string
    tipo_acesso: string[]
  }[]
} {
  return {
    nome: formData.nome,
    unidade_id: Number.parseInt(formData.unidade_id),
    andares: formData.andares,
  }
}

/**
 * Verifica se é modo de edição baseado na presença de um módulo
 */
export function isEditMode(modulo?: Modulo): boolean {
  return modulo !== undefined && modulo.id !== undefined
}
