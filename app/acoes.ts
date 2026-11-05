"use server";

import { revalidatePath } from "next/cache";
import { armazem } from "@/lib/armazem";
import { formatarReal, lerValorBR, nomeDoLink, normalizarLink } from "@/lib/ganhos";

export type EstadoForm = { ok: boolean; mensagem: string; campo?: "link" | "valor" | "geral" } | null;

export async function adicionarProjeto(_anterior: EstadoForm, dados: FormData): Promise<EstadoForm> {
  const banco = armazem();
  if (!banco) return { ok: false, campo: "geral", mensagem: "O banco ainda não foi ativado na Vercel. Siga o passo a passo acima." };

  const link = normalizarLink(String(dados.get("link") ?? ""));
  if (!link) return { ok: false, campo: "link", mensagem: "Cole o endereço do site, por exemplo meusite.vercel.app." };

  const valor = lerValorBR(String(dados.get("valor") ?? ""));
  if (valor === null) return { ok: false, campo: "valor", mensagem: "Digite o valor da venda, por exemplo 4.850 ou 4.850,00." };

  const nomeDigitado = String(dados.get("nome") ?? "").trim().slice(0, 80);
  const nome = nomeDigitado || nomeDoLink(link);

  try {
    await banco.salvar({ id: crypto.randomUUID(), link, nome, valor, criadoEm: new Date().toISOString() });
  } catch {
    return { ok: false, campo: "geral", mensagem: "Não consegui salvar agora. Tente de novo em alguns segundos." };
  }
  revalidatePath("/");
  return { ok: true, mensagem: `${nome} adicionado: ${formatarReal(valor)} somados ao saldo.` };
}

export async function removerProjeto(id: string): Promise<void> {
  const banco = armazem();
  if (!banco) return;
  await banco.remover(id);
  revalidatePath("/");
}
