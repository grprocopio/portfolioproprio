import { site } from "@/data/site";

/**
 * O nome é formado pelas partículas (CenaLoader). Este texto estático com brilho
 * já vem no HTML: aparece enquanto o 3D carrega e fica como versão final quando
 * o aparelho não aguenta o 3D ou pede menos movimento.
 */
export function Hero({ palavra }: { palavra: string }) {
  return (
    <section
      id="topo"
      aria-labelledby="titulo-hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-24"
    >
      <h1 id="titulo-hero">
        <span className="sr-only">{site.nome}, desenvolvedor freelancer: sites que geram resultado.</span>
        <span aria-hidden="true" className="nome-estatico">
          {palavra}
        </span>
      </h1>
      <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-sm text-apagado md:bottom-32">
        Role para explorar
      </p>
    </section>
  );
}
