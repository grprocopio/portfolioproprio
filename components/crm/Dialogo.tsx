"use client";

import { XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Janela modal nativa (<dialog>): foco preso dentro, Esc fecha, clique fora fecha. */
export function Dialogo({ aberto, aoFechar, titulo, children }: { aberto: boolean; aoFechar: () => void; titulo: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => e.target === ref.current && aoFechar()}
      aria-label={titulo}
      className="m-auto max-h-[92svh] w-[calc(100%-24px)] max-w-lg overflow-y-auto rounded-[28px] border border-claro/20 bg-[#101012] p-0 text-claro backdrop:bg-black/70"
    >
      {aberto && (
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="hero-heading text-3xl font-black uppercase leading-none tracking-tight">{titulo}</h2>
            <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid size-10 shrink-0 place-items-center rounded-full border border-claro/25 transition-colors hover:bg-claro/10">
              <XIcon className="size-4" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
