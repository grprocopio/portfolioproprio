export default function NaoEncontrada() {
  return (
    <main id="conteudo" className="grid min-h-svh place-items-center px-5 text-center">
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-light uppercase tracking-widest text-claro/70">Erro 404</p>
        <h1 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Página perdida
        </h1>
        <p className="max-w-sm font-light text-claro">Este endereço não existe ou mudou de lugar.</p>
        <a
          href="/"
          className="botao-contato inline-block rounded-full px-10 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          Voltar ao início
        </a>
      </div>
    </main>
  );
}
