import { Menu } from "@/components/Menu";
import { RolagemSuave } from "@/components/RolagemSuave";
import { CenaLoader } from "@/components/three/CenaLoader";

export default function Home() {
  return (
    <>
      <RolagemSuave />
      <CenaLoader />
      <div className="vinheta" aria-hidden="true" />
      <Menu />
      <main id="conteudo" className="relative z-10">
        <section id="topo" className="grid min-h-svh place-items-center">
          <h1 className="titulo titulo-degrade text-6xl md:text-8xl">
            Sites que <em>geram</em> resultado.
          </h1>
        </section>
        <section id="sobre" className="min-h-[200svh]" />
        <section id="projetos" className="min-h-[200svh]" />
        <section id="contato" className="min-h-[150svh]" />
      </main>
    </>
  );
}
