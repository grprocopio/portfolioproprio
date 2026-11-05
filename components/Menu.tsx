"use client";

import { useEffect, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { linkWhatsapp, site } from "@/data/site";

const links = [
  { href: "#topo", rotulo: "Início" },
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#projetos", rotulo: "Projetos" },
  { href: "#contato", rotulo: "Contato" },
];

/**
 * Logo e contato no topo; links numa pílula flutuante embaixo (alcançável pelo polegar no celular).
 * Superfícies sólidas translúcidas: sem backdrop-filter, que recalcula o desfoque do 3D a cada quadro.
 */
export function Menu() {
  const [ativo, setAtivo] = useState<string>("#topo");

  // Marca no menu a seção visível no momento
  useEffect(() => {
    const secoes = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtivo(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <a href="#topo" className="pointer-events-auto text-lg font-semibold tracking-tight text-forte" aria-label={`${site.nome}, voltar ao início`}>
            {site.marca}
          </a>
          <div className="pointer-events-auto">
            <Botao href={linkWhatsapp} externo tamanho="pequeno">
              Fale comigo
            </Botao>
          </div>
        </div>
      </header>

      <nav aria-label="Principal" className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <ul className="flex items-center gap-1 rounded-full border border-borda-forte bg-superficie/90 p-1 shadow-[0_8px_32px_rgb(2_4_14/0.6)]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={ativo === l.href ? "true" : undefined}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-apagado transition duration-300 ease-suave hover:text-forte aria-[current]:bg-superficie-2 aria-[current]:text-forte md:px-4"
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full bg-destaque shadow-[0_0_8px_rgb(75_91_255)] transition-opacity duration-300 ease-suave ${ativo === l.href ? "opacity-100" : "opacity-0"}`}
                />
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
