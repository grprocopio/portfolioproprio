import { Suspense } from "react";
import { Rodape } from "@/components/Rodape";
import { RolagemSuave } from "@/components/RolagemSuave";
import { Cta } from "@/components/sections/Cta";
import { Faixa } from "@/components/sections/Faixa";
import { Hero } from "@/components/sections/Hero";
import { Projetos } from "@/components/sections/Projetos";
import { ProjetosProprios, ProjetosPropriosCarregando } from "@/components/sections/ProjetosProprios";
import { Servicos } from "@/components/sections/Servicos";
import { Sobre } from "@/components/sections/Sobre";
import { site } from "@/data/site";
import { resumo } from "@/lib/projetos";
import { carregarProjetos, temExemplos } from "@/lib/projetos-servidor";

export const revalidate = 3600;

export default function Home() {
  const projetos = carregarProjetos();
  const r = resumo(projetos);
  const faixa = projetos.map((p) => ({ id: p.id, nome: p.nome, imagem: p.imagem || p.imagens?.[0] }));

  return (
    <div style={{ overflowX: "clip" }}>
      <RolagemSuave />
      <main id="conteudo">
        <Hero />
        <Faixa itens={faixa} />
        <Sobre resumo={r} exemplos={temExemplos} />
        <Servicos />
        <Projetos projetos={projetos} modo={site.modoValores} exemplos={temExemplos} />
        <Suspense fallback={<ProjetosPropriosCarregando />}>
          <ProjetosProprios />
        </Suspense>
        <Cta />
      </main>
      <Rodape />
    </div>
  );
}
