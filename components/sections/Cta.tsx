import { Botao } from "@/components/ui/Botao";
import { linkWhatsapp } from "@/data/site";

/** Seção final: a câmera entra no túnel enquanto o convite fica fixo no centro. */
export function Cta() {
  return (
    <section id="contato" aria-labelledby="titulo-cta" className="relative h-[200svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-4 text-center">
        <h2 id="titulo-cta" className="titulo titulo-degrade sobre-3d max-w-[680px] text-6xl md:text-8xl">
          Pronto para <em>tirar</em> seu projeto do papel?
        </h2>
        <p className="sobre-3d-texto mt-6 max-w-md text-base text-texto md:text-lg">
          Me conte o que você precisa. Respondo no mesmo dia com os próximos passos e uma estimativa de prazo.
        </p>
        <div className="mt-8">
          <Botao href={linkWhatsapp} externo>
            Chamar no WhatsApp
          </Botao>
        </div>
      </div>
    </section>
  );
}
