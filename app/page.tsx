import { Suspense } from "react";
import { Menu } from "@/components/Menu";
import { Rodape } from "@/components/Rodape";
import { Cta } from "@/components/sections/Cta";
import { ProjetosProprios, ProjetosPropriosCarregando } from "@/components/sections/ProjetosProprios";
import { RolagemSuave } from "@/components/RolagemSuave";
import { Hero } from "@/components/sections/Hero";
import { ProjetosVendidos } from "@/components/sections/ProjetosVendidos";
import { Sobre } from "@/components/sections/Sobre";
import { site } from "@/data/site";
import { CenaLoader } from "@/components/three/CenaLoader";
import { resumo } from "@/lib/projetos";
import { carregarProjetos, temExemplos } from "@/lib/projetos-servidor";

export const revalidate = 3600;

export default function Home() {
  const projetos = carregarProjetos();
  const r = resumo(projetos);

  return (
    <>
      <RolagemSuave />
      <CenaLoader palavra="PROCOPIO" />
      <div className="vinheta" aria-hidden="true" />
      <Menu />
      <main id="conteudo" className="relative z-10">
        <Hero palavra="PROCOPIO" />
        <Sobre resumo={r} exemplos={temExemplos} />
        <ProjetosVendidos projetos={projetos} modo={site.modoValores} exemplos={temExemplos} />
        <Suspense fallback={<ProjetosPropriosCarregando />}>
          <ProjetosProprios />
        </Suspense>
        <Cta />
      </main>
      <Rodape />
    </>
  );
}
