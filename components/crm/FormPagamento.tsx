"use client";

import { useActionState, useEffect } from "react";
import { registrarPagamento, type Estado } from "@/app/acoes";
import { falta, type Projeto } from "@/lib/financeiro";
import { formatarReal } from "@/lib/formato";
import { botaoPrincipal, campo, erroTexto, rotulo } from "./estilos";

export function FormPagamento({ projeto, aoSalvar }: { projeto: Projeto; aoSalvar: (msg: string) => void }) {
  const [estado, enviar, enviando] = useActionState<Estado, FormData>(registrarPagamento, null);
  useEffect(() => {
    if (estado?.ok) aoSalvar(estado.mensagem);
  }, [estado, aoSalvar]);
  const erro = (c: string) => (!estado?.ok && estado?.campo === c ? estado.mensagem : null);
  const resto = falta(projeto);

  return (
    <form action={enviar} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="projeto" value={projeto.id} />
      <p className="font-light text-claro">
        {projeto.cliente} · {projeto.nome}. Falta receber <strong className="font-medium text-white">{formatarReal(resto)}</strong>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="pg-valor" className={rotulo}>
            Valor recebido
          </label>
          <input
            id="pg-valor"
            name="valor"
            inputMode="decimal"
            autoComplete="off"
            required
            defaultValue={resto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            aria-invalid={Boolean(erro("valor"))}
            aria-describedby={erro("valor") ? "erro-pg-valor" : undefined}
            className={campo}
          />
          {erro("valor") && (
            <p id="erro-pg-valor" className={erroTexto}>
              {erro("valor")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pg-data" className={rotulo}>
            Data
          </label>
          <input id="pg-data" name="data" type="date" required defaultValue={new Date().toLocaleDateString("sv-SE")} aria-invalid={Boolean(erro("data"))} className={campo} />
          {erro("data") && <p className={erroTexto}>{erro("data")}</p>}
        </div>
      </div>
      {!estado?.ok && estado?.campo === "geral" && <p className={erroTexto}>{estado.mensagem}</p>}
      <button type="submit" disabled={enviando} className={`${botaoPrincipal} mt-2 self-start`}>
        {enviando ? "Registrando..." : "Registrar pagamento"}
      </button>
    </form>
  );
}
