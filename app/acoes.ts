"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { armazem } from "@/lib/armazem";
import { exigirSessao } from "@/lib/auth";
import { falta, type Projeto } from "@/lib/financeiro";
import { dataValida, formatarReal, lerValorBR, normalizarLink } from "@/lib/formato";
import { COOKIE, criarToken, segredoDoAmbiente, senhaCorreta, VALIDADE_DIAS } from "@/lib/sessao";

export type Estado = { ok: boolean; mensagem: string; campo?: string } | null;

const hojeISO = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
const texto = (d: FormData, k: string, max = 120) => String(d.get(k) ?? "").trim().slice(0, max);

// ---------- Entrar e sair ----------

export async function entrar(_a: Estado, dados: FormData): Promise<Estado> {
  if (!process.env.CRM_SENHA) {
    return { ok: false, mensagem: "A senha ainda não foi criada. Adicione CRM_SENHA nas variáveis de ambiente da Vercel e faça um novo deploy." };
  }
  if (!(await senhaCorreta(String(dados.get("senha") ?? ""), process.env.CRM_SENHA))) {
    // Atraso fixo: deixa tentativas em massa lentas
    await new Promise((r) => setTimeout(r, 800));
    return { ok: false, campo: "senha", mensagem: "Senha incorreta." };
  }
  (await cookies()).set(COOKIE, await criarToken(segredoDoAmbiente()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VALIDADE_DIAS * 86_400,
  });
  redirect("/");
}

export async function sair(): Promise<void> {
  (await cookies()).delete(COOKIE);
  redirect("/entrar");
}

// ---------- Projetos ----------

function banco() {
  const b = armazem();
  if (!b) throw new Error("Banco não configurado");
  return b;
}

/** Cria (sem id) ou edita (com id) um projeto. */
export async function salvarProjeto(_a: Estado, dados: FormData): Promise<Estado> {
  await exigirSessao();
  const b = armazem();
  if (!b) return { ok: false, campo: "geral", mensagem: "O banco ainda não foi ativado na Vercel." };

  const id = texto(dados, "id", 60);
  const cliente = texto(dados, "cliente", 80);
  const nome = texto(dados, "nome", 80);
  const linkBruto = texto(dados, "link", 300);
  const valor = lerValorBR(texto(dados, "valor", 30));
  const data = texto(dados, "data", 10);
  const entradaBruta = texto(dados, "entrada", 30);

  if (!cliente) return { ok: false, campo: "cliente", mensagem: "Digite o nome do cliente." };
  if (!nome) return { ok: false, campo: "nome", mensagem: "Digite o nome do projeto." };
  const link = linkBruto ? normalizarLink(linkBruto) : undefined;
  if (linkBruto && !link) return { ok: false, campo: "link", mensagem: "Link inválido. Exemplo: meusite.vercel.app." };
  if (valor === null) return { ok: false, campo: "valor", mensagem: "Digite o valor total, por exemplo 4.850,00." };
  if (!dataValida(data)) return { ok: false, campo: "data", mensagem: "Escolha a data da venda." };
  const entrada = entradaBruta ? lerValorBR(entradaBruta) : null;
  if (entradaBruta && entrada === null) return { ok: false, campo: "entrada", mensagem: "Valor de entrada inválido." };
  if (entrada !== null && entrada > valor) return { ok: false, campo: "entrada", mensagem: "A entrada não pode ser maior que o valor total." };

  try {
    if (id) {
      const atual = await b.buscar(id);
      if (!atual) return { ok: false, campo: "geral", mensagem: "Esse projeto não existe mais. Recarregue a página." };
      await b.salvar({ ...atual, cliente, nome, link: link ?? undefined, valor, data });
    } else {
      const novo: Projeto = {
        id: crypto.randomUUID(),
        cliente,
        nome,
        link: link ?? undefined,
        valor,
        data,
        pagamentos: entrada ? [{ id: crypto.randomUUID(), valor: entrada, data }] : [],
        criadoEm: new Date().toISOString(),
      };
      await b.salvar(novo);
    }
  } catch {
    return { ok: false, campo: "geral", mensagem: "Não consegui salvar agora. Tente de novo em alguns segundos." };
  }
  revalidatePath("/");
  return { ok: true, mensagem: id ? `${nome} atualizado.` : `${nome} adicionado (${formatarReal(valor)}).` };
}

export async function registrarPagamento(_a: Estado, dados: FormData): Promise<Estado> {
  await exigirSessao();
  const b = banco();
  const p = await b.buscar(texto(dados, "projeto", 60));
  if (!p) return { ok: false, campo: "geral", mensagem: "Esse projeto não existe mais. Recarregue a página." };
  const valor = lerValorBR(texto(dados, "valor", 30));
  const data = texto(dados, "data", 10) || hojeISO();
  if (valor === null) return { ok: false, campo: "valor", mensagem: "Digite o valor recebido." };
  if (!dataValida(data)) return { ok: false, campo: "data", mensagem: "Escolha a data do pagamento." };
  if (valor > falta(p) + 0.005) return { ok: false, campo: "valor", mensagem: `Falta receber só ${formatarReal(falta(p))} deste projeto.` };
  await b.salvar({ ...p, pagamentos: [...p.pagamentos, { id: crypto.randomUUID(), valor, data }] });
  revalidatePath("/");
  return { ok: true, mensagem: `Pagamento de ${formatarReal(valor)} registrado.` };
}

export async function removerPagamento(projetoId: string, pagamentoId: string): Promise<void> {
  await exigirSessao();
  const b = banco();
  const p = await b.buscar(projetoId);
  if (!p) return;
  await b.salvar({ ...p, pagamentos: p.pagamentos.filter((x) => x.id !== pagamentoId) });
  revalidatePath("/");
}

export async function excluirProjeto(id: string): Promise<void> {
  await exigirSessao();
  await banco().remover(id);
  revalidatePath("/");
}
