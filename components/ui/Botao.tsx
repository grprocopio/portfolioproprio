import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variante?: "primario" | "secundario";
  tamanho?: "normal" | "pequeno";
  externo?: boolean;
  className?: string;
};

const base =
  "group inline-flex items-center gap-3 rounded-full font-semibold transition duration-300 ease-suave active:scale-[0.98] select-none";

export function Botao({ href, children, variante = "primario", tamanho = "normal", externo, className = "" }: Props) {
  const texto = tamanho === "pequeno" ? "text-sm" : "text-base";
  const estilo =
    variante === "primario"
      ? "bg-white text-fundo shadow-[0_0_32px_rgb(75_91_255/0.35)] hover:bg-[#e6e9ff] hover:shadow-[0_0_44px_rgb(75_91_255/0.55)] py-2 pl-4 pr-2"
      : "border border-borda-forte bg-superficie/80 text-forte hover:border-destaque hover:bg-superficie-2 py-2 px-4";
  const alvo = externo ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={`${base} ${texto} ${estilo} ${className}`} {...alvo}>
      <span>{children}</span>
      {variante === "primario" && (
        <span
          aria-hidden="true"
          className={`grid place-items-center rounded-full bg-destaque text-white shadow-[0_0_12px_rgb(75_91_255/0.9)] ${tamanho === "pequeno" ? "size-6" : "size-8"}`}
        >
          <ArrowRightIcon
            weight="bold"
            className="size-4 transition-transform duration-500 ease-suave group-hover:translate-x-0.5"
          />
        </span>
      )}
    </a>
  );
}
