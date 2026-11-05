"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjetoCard } from "@/components/ProjetoCard";
import { ProjetoDialog } from "@/components/ProjetoDialog";
import { Botao } from "@/components/ui/Botao";
import { linkWhatsapp, type ModoValores } from "@/data/site";
import { tipos as listarTipos, type ProjetoPublico } from "@/lib/projetos";

gsap.registerPlugin(ScrollTrigger);

type Props = { projetos: ProjetoPublico[]; modo: ModoValores; exemplos: boolean };

export function ProjetosVendidos({ projetos, modo, exemplos }: Props) {
  const [filtro, setFiltro] = useState<string | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const colA = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);

  const tipos = useMemo(() => listarTipos(projetos), [projetos]);
  const visiveis = filtro ? projetos.filter((p) => p.tipo === filtro) : projetos;
  const colunas = [visiveis.filter((_, i) => i % 2 === 0), visiveis.filter((_, i) => i % 2 === 1)];

  // Parallax: as duas colunas sobem em velocidades diferentes (só telas largas)
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      [
        [colA.current, 40, -40],
        [colB.current, 120, -120],
      ].forEach(([el, de, ate]) => {
        if (!el) return;
        gsap.fromTo(
          el as HTMLElement,
          { y: de as number },
          {
            y: ate as number,
            ease: "none",
            scrollTrigger: { trigger: el as HTMLElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [filtro]);

  const projetoAberto = projetos.find((p) => p.id === aberto) ?? null;

  return (
    <section id="projetos" aria-labelledby="titulo-projetos" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <p className="etiqueta">Projetos vendidos</p>
            <h2 id="titulo-projetos" className="titulo mt-4 text-5xl md:text-6xl">
              Feitos para clientes <em>reais</em>.
            </h2>
            <p className="mt-6 max-w-sm text-base text-texto">
              Sites, lojas e sistemas que estão no ar e trabalham todo dia para quem me contratou. Toque em um projeto
              para ver prazo, tecnologias e o que o cliente achou.
            </p>

            <div role="group" aria-label="Filtrar por tipo" className="mt-8 flex flex-wrap gap-2">
              {[null, ...tipos].map((t) => (
                <button
                  key={t ?? "todos"}
                  type="button"
                  aria-pressed={filtro === t}
                  onClick={() => setFiltro(t)}
                  className="rounded-full border border-borda px-3 py-2 text-sm text-apagado transition duration-300 ease-suave hover:border-borda-forte hover:text-forte active:scale-[0.98] aria-pressed:border-destaque aria-pressed:bg-destaque aria-pressed:text-white aria-pressed:shadow-[0_0_16px_rgb(75_91_255/0.6)]"
                >
                  {t ?? "Todos"}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Botao href={linkWhatsapp} externo>
                Quero um projeto assim
              </Botao>
            </div>
            {exemplos && <p className="mt-4 text-xs text-apagado">Projetos de exemplo, até os reais serem cadastrados.</p>}
          </div>
        </div>

        <div className="md:col-span-7">
          {visiveis.length === 0 ? (
            <p className="vidro rounded-2xl p-6 text-sm text-apagado">
              Nenhum projeto cadastrado ainda. Eles aparecem aqui assim que entrarem em data/projetos.json.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" aria-live="polite">
              <div ref={colA} className="flex flex-col gap-6">
                {colunas[0].map((p) => (
                  <ProjetoCard key={p.id} projeto={p} modo={modo} aoAbrir={setAberto} />
                ))}
              </div>
              <div ref={colB} className="flex flex-col gap-6 sm:pt-24">
                {colunas[1].map((p) => (
                  <ProjetoCard key={p.id} projeto={p} modo={modo} aoAbrir={setAberto} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjetoDialog projeto={projetoAberto} modo={modo} aoFechar={() => setAberto(null)} />
    </section>
  );
}
