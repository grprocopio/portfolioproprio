import { Menu } from "@/components/Menu";
import { RolagemSuave } from "@/components/RolagemSuave";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { CenaLoader } from "@/components/three/CenaLoader";
import { resumo } from "@/lib/projetos";
import { carregarProjetos, temExemplos } from "@/lib/projetos-servidor";

export default function Home() {
  const projetos = carregarProjetos();
  const r = resumo(projetos);
  const desde = r.porMes[0]?.mes.slice(0, 4) ?? String(new Date().getFullYear());

  return (
    <>
      <RolagemSuave />
      <CenaLoader />
      <div className="vinheta" aria-hidden="true" />
      <Menu />
      <main id="conteudo" className="relative z-10">
        <Hero entregues={r.quantidade} desde={desde} />
        <Sobre resumo={r} exemplos={temExemplos} />
        <section id="projetos" className="min-h-[200svh]" />
        <section id="contato" className="min-h-[150svh]" />
      </main>
    </>
  );
}
