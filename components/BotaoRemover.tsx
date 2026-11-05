"use client";

import { useTransition } from "react";
import { removerProjeto } from "@/app/acoes";

export function BotaoRemover({ id, nome }: { id: string; nome: string }) {
  const [removendo, iniciar] = useTransition();
  return (
    <button
      type="button"
      disabled={removendo}
      onClick={() => {
        if (window.confirm(`Remover ${nome} do saldo?`)) iniciar(() => removerProjeto(id));
      }}
      className="rounded-full border border-claro/30 px-4 py-2 text-xs font-medium uppercase tracking-widest text-claro/80 transition-colors duration-200 hover:border-claro hover:text-white disabled:opacity-50"
    >
      {removendo ? "Removendo..." : "Remover"}
    </button>
  );
}
