import { Contador } from "@/components/Contador";
import { FadeIn } from "@/components/anim/FadeIn";
import { TextoAnimado } from "@/components/anim/TextoAnimado";
import { BotaoContato } from "@/components/ui/Botao";
import { site } from "@/data/site";
import { formatarTotal, formatarValor, type Resumo } from "@/lib/projetos";

type Props = { resumo: Resumo; exemplos: boolean };

export function Sobre({ resumo, exemplos }: Props) {
  const modo = site.modoValores;
  const numeros = [
    {
      rotulo: "Faturamento total",
      el: <Contador valor={resumo.total} formato="moeda" textoFixo={modo === "faixa" ? formatarTotal(resumo.total, modo) : undefined} />,
    },
    { rotulo: "Projetos entregues", el: <Contador valor={resumo.quantidade} formato="numero" /> },
    {
      rotulo: "Ticket médio",
      el: <Contador valor={resumo.ticketMedio} formato="moeda" textoFixo={modo === "faixa" ? formatarValor(resumo.ticketMedio, modo) : undefined} />,
    },
  ];

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10">
      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            id="titulo-sobre"
            y={40}
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Sobre mim
          </FadeIn>
          <TextoAnimado
            className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-claro"
            texto={`Sou ${site.nome.split(" ")[0]}, desenvolvedor freelancer. Desenho e programo sites que carregam rápido, aparecem no Google e transformam visita em conversa no WhatsApp. Você fala direto comigo, do primeiro rascunho ao site no ar.`}
          />
        </div>

        <div className="w-full max-w-4xl">
          <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {numeros.map((n, i) => (
              <FadeIn key={n.rotulo} delay={i * 0.1} className="flex flex-col-reverse gap-2">
                <dt className="text-sm font-light uppercase tracking-widest text-claro/70">{n.rotulo}</dt>
                <dd className="hero-heading font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}>
                  {n.el}
                </dd>
              </FadeIn>
            ))}
          </dl>
          {exemplos && (
            <p className="mt-6 text-center text-xs font-light text-claro/60">Números de exemplo, calculados a partir de projetos fictícios.</p>
          )}
        </div>

        <FadeIn>
          <BotaoContato />
        </FadeIn>
      </div>
    </section>
  );
}
