import type { ReactNode } from "react";
import { linkWhatsapp } from "@/data/site";

/** Botão principal do template: pílula em degradê roxo/laranja. Abre o WhatsApp. */
export function BotaoContato({ children = "Fale comigo", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <a
      href={linkWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao-contato inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
    >
      {children}
    </a>
  );
}

/** Botão vazado do template (projetos). */
export function BotaoProjeto({ href, children = "Ver site no ar" }: { href: string; children?: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block shrink-0 rounded-full border-2 border-claro px-8 py-3 text-sm font-medium uppercase tracking-widest text-claro transition-colors duration-200 hover:bg-claro/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      {children}
    </a>
  );
}
