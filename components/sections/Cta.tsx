import { FadeIn } from "@/components/anim/FadeIn";
import { BotaoContato } from "@/components/ui/Botao";

export function Cta() {
  return (
    <section id="contato" aria-labelledby="titulo-cta" className="flex min-h-[80svh] flex-col items-center justify-center gap-10 px-5 py-24 text-center sm:px-8 md:gap-14 md:px-10">
      <FadeIn
        as="h2"
        id="titulo-cta"
        y={40}
        className="hero-heading max-w-6xl font-black uppercase leading-[0.95] tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 8vw, 120px)" }}
      >
        Pronto para tirar seu projeto do papel?
      </FadeIn>
      <FadeIn as="p" delay={0.15} className="max-w-md font-light leading-relaxed text-claro" style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}>
        Me conte o que você precisa. Respondo no mesmo dia com os próximos passos e uma estimativa de prazo.
      </FadeIn>
      <FadeIn delay={0.3}>
        <BotaoContato>Chamar no WhatsApp</BotaoContato>
      </FadeIn>
    </section>
  );
}
