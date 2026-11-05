import { FadeIn } from "@/components/anim/FadeIn";

const servicos = [
  {
    nome: "Sites institucionais",
    texto: "Site completo da sua empresa, com páginas por serviço, pronto para aparecer no Google da sua região e levar o visitante até o WhatsApp.",
  },
  {
    nome: "Landing pages",
    texto: "Uma página focada numa oferta só, para campanhas e lançamentos, desenhada para transformar clique em contato ou venda.",
  },
  {
    nome: "Lojas virtuais",
    texto: "Loja com catálogo, carrinho, frete e pagamento, para você vender sem depender de responder pedido por mensagem.",
  },
  {
    nome: "Sistemas web",
    texto: "Painéis e ferramentas sob medida para organizar a rotina do negócio, como agendamentos, estoque e controle de frota.",
  },
  {
    nome: "Manutenção e melhorias",
    texto: "Ajustes, novas páginas e acompanhamento de desempenho depois que o site está no ar, sem você precisar procurar outra pessoa.",
  },
];

export function Servicos() {
  return (
    <section
      id="servicos"
      aria-labelledby="titulo-servicos"
      className="rounded-t-[40px] bg-white px-5 py-20 text-fundo sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        id="titulo-servicos"
        y={40}
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-fundo sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Serviços
      </FadeIn>
      <ol className="mx-auto max-w-5xl">
        {servicos.map((s, i) => (
          <FadeIn
            as="li"
            key={s.nome}
            delay={i * 0.1}
            className="flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:py-12"
            style={{ borderTop: i === 0 ? "none" : "1px solid rgba(12, 12, 12, 0.15)" }}
          >
            <span aria-hidden="true" className="font-black leading-none text-fundo" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2 pt-2 sm:pt-4">
              <h3 className="font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                {s.nome}
              </h3>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}>
                {s.texto}
              </p>
            </div>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
