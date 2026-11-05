"use client";

import { useActionState } from "react";
import { entrar, type Estado } from "@/app/acoes";
import { botaoPrincipal, campo, erroTexto, rotulo } from "./estilos";

export function FormEntrar() {
  const [estado, enviar, enviando] = useActionState<Estado, FormData>(entrar, null);
  const erro = estado && !estado.ok ? estado.mensagem : null;
  return (
    <form action={enviar} className="flex flex-col gap-4">
      <label htmlFor="senha" className={rotulo}>
        Senha
      </label>
      <input
        id="senha"
        name="senha"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? "erro-senha" : undefined}
        className={campo}
      />
      {erro && (
        <p id="erro-senha" className={erroTexto}>
          {erro}
        </p>
      )}
      <button type="submit" disabled={enviando} className={`${botaoPrincipal} mt-2`}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
