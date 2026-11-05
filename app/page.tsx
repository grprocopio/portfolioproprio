import { Menu } from "@/components/Menu";

export default function Home() {
  return (
    <>
      <Menu />
      <div className="vinheta" aria-hidden="true" />
      <main id="conteudo" className="relative z-10">
        <section id="topo" className="grid min-h-svh place-items-center">
          <h1 className="titulo titulo-degrade text-6xl md:text-8xl">
            Sites que <em>geram</em> resultado.
          </h1>
        </section>
      </main>
    </>
  );
}
