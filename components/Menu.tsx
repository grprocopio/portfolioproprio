"use client";

import { useEffect, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { linkWhatsapp, site } from "@/data/site";

const links = [
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#projetos", rotulo: "Projetos" },
  { href: "#contato", rotulo: "Contato" },
];

export function Menu() {
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);

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

  useEffect(() => {
    document.documentElement.style.overflow = aberto ? "hidden" : "";
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <a href="#topo" className="titulo text-2xl" aria-label={`${site.nome}, voltar ao início`}>
          {site.marca}
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={ativo === l.href ? "true" : undefined}
                  className="block rounded-full px-4 py-2 text-sm text-apagado transition duration-300 ease-suave hover:text-forte aria-[current]:bg-white/10 aria-[current]:text-forte"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Botao href={linkWhatsapp} externo tamanho="pequeno">
            Fale comigo
          </Botao>
        </div>

        <button
          type="button"
          className="relative z-50 grid size-12 place-items-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-white transition-transform duration-500 ease-suave ${aberto ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-4 bg-white transition-transform duration-500 ease-suave ${aberto ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="menu-movel"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-black/90 px-6 backdrop-blur-xl transition-opacity duration-500 ease-suave md:hidden ${aberto ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!aberto}
      >
        <nav aria-label="Menu móvel">
          <ul className="flex flex-col gap-4">
            {links.map((l, i) => (
              <li
                key={l.href}
                className={`transition duration-500 ease-suave ${aberto ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: aberto ? `${i * 60}ms` : "0ms" }}
              >
                <a href={l.href} onClick={() => setAberto(false)} className="titulo text-5xl">
                  {l.rotulo}
                </a>
              </li>
            ))}
            <li
              className={`pt-6 transition duration-500 ease-suave ${aberto ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: aberto ? "180ms" : "0ms" }}
            >
              <Botao href={linkWhatsapp} externo>
                Fale comigo
              </Botao>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
