import { CeuNoturno } from "@/components/CeuNoturno";
import { Rodape } from "@/components/Rodape";
import { RolagemSuave } from "@/components/RolagemSuave";
import { Ganhos } from "@/components/sections/Ganhos";
import { Hero } from "@/components/sections/Hero";

// Os projetos vêm do banco a cada visita (e o salvar já atualiza a página na hora)
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div style={{ overflowX: "clip" }}>
      <RolagemSuave />
      <CeuNoturno />
      <main id="conteudo" className="relative z-10">
        <Hero />
        <Ganhos />
      </main>
      <div className="relative z-10">
        <Rodape />
      </div>
    </div>
  );
}
