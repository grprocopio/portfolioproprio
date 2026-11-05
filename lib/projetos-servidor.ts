import "server-only";
import dados from "@/data/projetos.json";
import { paraPublico, type Projeto, type ProjetoPublico } from "./projetos";

// Só no servidor: o JSON bruto tem nomes de clientes que não podem chegar ao navegador.

/** Projetos vendidos, já sem dados de clientes que não autorizaram aparecer, do mais recente ao mais antigo. */
export function carregarProjetos(): ProjetoPublico[] {
  return paraPublico(dados as Projeto[]).sort((a, b) => b.data.localeCompare(a.data));
}

export const temExemplos = (dados as Projeto[]).some((p) => p.exemplo);
