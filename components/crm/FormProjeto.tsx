"use client";

import { useActionState, useEffect } from "react";
import { salvarProjeto, type Estado } from "@/app/acoes";
import type { Projeto } from "@/lib/financeiro";
import { botaoPrincipal, campo, erroTexto, rotulo } from "./estilos";

const hoje = () => new Date().toLocaleDateString("sv-SE");
const valorBR = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Novo projeto (sem `projeto`) ou edição (com `projeto`). */
export function FormProjeto({ projeto, aoSalvar }: { projeto?: Projeto; aoSalvar: (msg: string) => void }) {
  const [estado, enviar, enviando] = useActionState<Estado, FormData>(salvarProjeto, null);
  useEffect(() => {
    if (estado?.ok) aoSalvar(estado.mensagem);
  }, [estado, aoSalvar]);
  const erro = (c: string) => (!estado?.ok && estado?.campo === c ? estado.mensagem : null);

  const linha = (id: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, extra?: string) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={rotulo}>
        {label} {extra && <span className="font-light normal-case tracking-normal text-claro/70">{extra}</span>}
      </label>
      <input id={id} name={id} autoComplete="off" aria-invalid={Boolean(erro(id))} aria-describedby={erro(id) ? `erro-${id}` : undefined} className={campo} {...props} />
      {erro(id) && (
        <p id={`erro-${id}`} className={erroTexto}>
          {erro(id)}
        </p>
      )}
    </div>
  );

  return (
    <form action={enviar} noValidate className="flex flex-col gap-4">
      {projeto && <input type="hidden" name="id" value={projeto.id} />}
      {linha("cliente", "Cliente", { required: true, maxLength: 80, defaultValue: projeto?.cliente, placeholder: "Nome do cliente ou da empresa" })}
      {linha("nome", "Projeto", { required: true, maxLength: 80, defaultValue: projeto?.nome, placeholder: "Ex.: site institucional" })}
      {linha("link", "Link do site", { inputMode: "url", defaultValue: projeto?.link, placeholder: "meusite.vercel.app" }, "(opcional)")}
      <div className="grid gap-4 sm:grid-cols-2">
        {linha("valor", "Valor total", { required: true, inputMode: "decimal", defaultValue: projeto ? valorBR(projeto.valor) : undefined, placeholder: "R$ 4.850,00" })}
        {linha("data", "Data da venda", { required: true, type: "date", defaultValue: projeto?.data ?? hoje() })}
      </div>
      {!projeto && linha("entrada", "Já recebeu de entrada?", { inputMode: "decimal", placeholder: "R$ 0,00" }, "(opcional)")}
      {!estado?.ok && estado?.campo === "geral" && <p className={erroTexto}>{estado.mensagem}</p>}
      <button type="submit" disabled={enviando} className={`${botaoPrincipal} mt-2 self-start`}>
        {enviando ? "Salvando..." : projeto ? "Salvar alterações" : "Adicionar projeto"}
      </button>
    </form>
  );
}
