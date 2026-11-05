import { Botao } from "@/components/ui/Botao";

export default function NaoEncontrada() {
  return (
    <main id="conteudo" className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <p className="text-sm text-apagado">Erro 404</p>
        <h1 className="titulo titulo-degrade mt-4 text-6xl md:text-8xl">
          Página <em>perdida</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-base text-texto">Este endereço não existe ou mudou de lugar.</p>
        <div className="mt-8">
          <Botao href="/">Voltar ao início</Botao>
        </div>
      </div>
    </main>
  );
}
