import { PalavraGiratoria } from "@/components/PalavraGiratoria";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section
      id="topo"
      aria-labelledby="titulo-hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-24"
    >
      <h1 id="titulo-hero" className="entrada">
        <span className="sr-only">{site.nome}, desenvolvedor freelancer: sites que geram resultado.</span>
        <PalavraGiratoria palavra="Procopio" />
      </h1>
    </section>
  );
}
