"use client";

import { useActionState, useEffect, useRef } from "react";
import { adicionarProjeto, type EstadoForm } from "@/app/acoes";

const campo =
  "w-full rounded-2xl border-2 border-claro/30 bg-transparent px-5 py-4 text-base text-white placeholder:text-claro/40 transition-colors duration-200 focus:border-claro focus:outline-none aria-[invalid=true]:border-[#ff6b8a]";

export function FormProjeto({ desativado }: { desativado: boolean }) {
  const [estado, enviar, enviando] = useActionState<EstadoForm, FormData>(adicionarProjeto, null);
  const form = useRef<HTMLFormElement>(null);

  // Projeto salvo: limpa o formulário para o próximo
  useEffect(() => {
    if (estado?.ok) form.current?.reset();
  }, [estado]);

  const erro = (c: "link" | "valor") => (!estado?.ok && estado?.campo === c ? estado.mensagem : null);

  return (
    <form ref={form} action={enviar} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="link" className="text-sm font-medium uppercase tracking-widest text-claro">
          Link do site
        </label>
        <input
          id="link"
          name="link"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="meusite.vercel.app"
          required
          disabled={desativado}
          aria-invalid={Boolean(erro("link"))}
          aria-describedby={erro("link") ? "erro-link" : undefined}
          className={campo}
        />
        {erro("link") && (
          <p id="erro-link" className="text-sm text-[#ff8fa6]">
            {erro("link")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="valor" className="text-sm font-medium uppercase tracking-widest text-claro">
          Por quanto você vendeu?
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="R$ 4.850,00"
          required
          disabled={desativado}
          aria-invalid={Boolean(erro("valor"))}
          aria-describedby={erro("valor") ? "erro-valor" : undefined}
          className={campo}
        />
        {erro("valor") && (
          <p id="erro-valor" className="text-sm text-[#ff8fa6]">
            {erro("valor")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="nome" className="text-sm font-medium uppercase tracking-widest text-claro">
          Nome do projeto <span className="font-light normal-case tracking-normal text-claro/70">(opcional)</span>
        </label>
        <input id="nome" name="nome" type="text" maxLength={80} autoComplete="off" placeholder="Usa o nome do link se ficar vazio" disabled={desativado} className={campo} />
      </div>

      <button
        type="submit"
        disabled={desativado || enviando}
        className="botao-contato mt-2 self-start rounded-full px-10 py-4 text-sm font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
      >
        {enviando ? "Adicionando..." : "Adicionar projeto"}
      </button>

      <p aria-live="polite" className={`min-h-6 text-sm ${estado?.ok ? "text-[#8ff0b4]" : "text-[#ff8fa6]"}`}>
        {estado && (estado.ok || estado.campo === "geral") ? estado.mensagem : ""}
      </p>
    </form>
  );
}
