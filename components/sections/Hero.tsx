import { FadeIn } from "@/components/anim/FadeIn";
import { Ima } from "@/components/anim/Ima";
import { BotaoContato } from "@/components/ui/Botao";
import { linkWhatsapp, site } from "@/data/site";

const links = [
  { href: "#ganhos", rotulo: "Saldo", externo: false },
  { href: "#projetos", rotulo: "Projetos", externo: false },
  { href: "#adicionar", rotulo: "Adicionar", externo: false },
  { href: linkWhatsapp, rotulo: "Contato", externo: true },
];

const tituloClasse = "w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight";
const tituloEstilo = { fontSize: "min(20vw, 42vh)" };

export function Hero() {
  return (
    <section id="topo" aria-labelledby="titulo-hero" className="relative flex h-svh min-h-[560px] flex-col" style={{ overflowX: "clip" }}>
      <FadeIn as="nav" y={-20} aria-label="Principal" className="relative z-20 px-6 pt-6 md:px-10 md:pt-8">
        <ul className="flex justify-between">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...(l.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-sm font-medium uppercase tracking-wider text-claro transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
              >
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      {/*
        PROCOPIO em duas camadas sobrepostas, com a mesma caixa:
        - atrás do personagem (z-0): "PRO" e "PIO" em branco sólido;
        - na frente do personagem (z-20): só o "CO" em contorno branco.
      */}
      <FadeIn delay={0.15} y={40} className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="relative overflow-hidden pt-16 sm:pt-16 md:pt-14 lg:pt-16">
          <h1 id="titulo-hero" className={`${tituloClasse} relative z-0 text-white`} style={tituloEstilo}>
            <span className="sr-only">Procopio</span>
            <span aria-hidden="true">
              PRO<span className="text-transparent">CO</span>PIO
            </span>
          </h1>
        </div>
      </FadeIn>
      <FadeIn delay={0.15} y={40} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-full">
        <div className="relative overflow-hidden pt-16 sm:pt-16 md:pt-14 lg:pt-16">
          <p className={`${tituloClasse} text-transparent`} style={tituloEstilo}>
            PRO<span className="contorno-branco">CO</span>PIO
          </p>
        </div>
      </FadeIn>

      {/* Personagem: posição no invólucro, animação no filho (o transform do FadeIn não briga com o translate) */}
      <div className="absolute left-1/2 top-[7svh] z-10 w-[min(320px,84vw)] -translate-x-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Ima alcance={150} forca={3}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/personagem.webp"
              alt={`Personagem 3D do ${site.nome}`}
              width={706}
              height={978}
              fetchPriority="high"
              className="h-auto w-full select-none"
              draggable={false}
            />
          </Ima>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-claro sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
        >
          Desenvolvedor freelancer que cria sites rápidos que viram clientes
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <BotaoContato />
        </FadeIn>
      </div>
    </section>
  );
}
