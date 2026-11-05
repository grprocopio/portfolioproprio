"use client";

import { useEffect, useRef } from "react";

export type ItemFaixa = { id: string; nome: string; imagem?: string };

function Bloco({ item }: { item: ItemFaixa }) {
  return (
    <div className="relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl bg-[#161616]">
      {item.imagem ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imagem} alt={`Site ${item.nome}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        // Sem print ainda: capa tipográfica com o nome do projeto
        <div className="grid h-full w-full place-items-center bg-[linear-gradient(160deg,#1b1b1f,#0f0f11)] px-8">
          <span className="hero-heading text-center text-4xl font-black uppercase leading-none tracking-tight">{item.nome}</span>
        </div>
      )}
    </div>
  );
}

/** Duas fileiras de projetos que andam em sentidos opostos conforme a rolagem. */
export function Faixa({ itens }: { itens: ItemFaixa[] }) {
  const secao = useRef<HTMLElement>(null);
  const fila1 = useRef<HTMLDivElement>(null);
  const fila2 = useRef<HTMLDivElement>(null);

  // Garante fileiras cheias mesmo com poucos projetos
  let lista = itens;
  while (lista.length > 0 && lista.length < 10) lista = [...lista, ...itens];
  const meio = Math.ceil(lista.length / 2);
  const linha1 = [...lista.slice(0, meio), ...lista.slice(0, meio), ...lista.slice(0, meio)];
  const linha2 = [...lista.slice(meio), ...lista.slice(meio), ...lista.slice(meio)];

  useEffect(() => {
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const s = secao.current;
      if (!s) return;
      const topo = s.getBoundingClientRect().top + window.scrollY;
      const desl = (window.scrollY - topo + window.innerHeight) * 0.3;
      if (fila1.current) fila1.current.style.transform = `translate3d(${desl - 200}px,0,0)`;
      if (fila2.current) fila2.current.style.transform = `translate3d(${-(desl - 200)}px,0,0)`;
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  if (itens.length === 0) return null;

  return (
    <section ref={secao} aria-label="Projetos em destaque" className="overflow-hidden bg-fundo pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        {/* A fileira 1 anda para a direita: começa deslocada para a esquerda */}
        <div ref={fila1} className="flex w-max gap-3" style={{ willChange: "transform", marginLeft: "-100%" }}>
          {linha1.map((it, i) => (
            <Bloco key={`a${i}`} item={it} />
          ))}
        </div>
        <div ref={fila2} className="flex w-max gap-3" style={{ willChange: "transform" }}>
          {linha2.map((it, i) => (
            <Bloco key={`b${i}`} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
