import { Botao } from "@/components/ui/Botao";
import { linkWhatsapp } from "@/data/site";

type Props = { entregues: number; desde: string };

export function Hero({ entregues, desde }: Props) {
  return (
    <section
      id="topo"
      aria-labelledby="titulo-hero"
      className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-24 pt-24 text-center"
    >
      <h1 id="titulo-hero" className="titulo titulo-degrade entrada max-w-[680px] text-6xl md:text-8xl">
        Sites que <em>geram</em>
        <br />
        resultado.
      </h1>
      <p className="entrada mt-6 max-w-[560px] text-base text-texto md:text-lg" style={{ animationDelay: "120ms" }}>
        Sou desenvolvedor freelancer. Faço sites e sistemas sob medida para empresas que querem vender mais pela
        internet, com você falando direto comigo do começo ao fim.
      </p>
      <div className="entrada mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
        <Botao href="#projetos">Ver projetos</Botao>
        <Botao href={linkWhatsapp} externo variante="secundario">
          Fale comigo
        </Botao>
      </div>
      <p className="entrada mt-6 text-sm text-apagado" style={{ animationDelay: "360ms" }}>
        {entregues} projetos entregues desde {desde}
      </p>
    </section>
  );
}
