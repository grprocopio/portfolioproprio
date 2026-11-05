import type { Metadata } from "next";
import { linkWhatsapp, site } from "@/data/site";

export const metadata: Metadata = { title: `Privacidade | ${site.nome}` };

export default function Privacidade() {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-24">
      <a href="/" className="text-sm text-apagado transition duration-300 ease-suave hover:text-forte">
        Voltar ao início
      </a>
      <h1 className="titulo mt-8 text-5xl">
        Política de <em>privacidade</em>
      </h1>
      <div className="mt-8 space-y-4 text-base text-texto">
        <p>Este site não usa cookies de rastreamento, não tem formulários e não coleta dados pessoais.</p>
        <p>
          Quando você clica em um botão de contato, a conversa acontece no WhatsApp, sob a política de privacidade dele. As
          informações que você me enviar por lá servem só para responder ao seu pedido de orçamento.
        </p>
        <p>
          Projetos de clientes só mostram o nome da empresa quando ela autorizou. Para pedir a remoção de qualquer
          informação,{" "}
          <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="text-forte underline underline-offset-4">
            fale comigo
          </a>
          .
        </p>
      </div>
    </main>
  );
}
