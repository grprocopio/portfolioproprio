// Configuração pessoal do site. Itens marcados com PREENCHER ainda são provisórios.

export type ModoValores = "exato" | "faixa";

export const site = {
  nome: "Guilherme Procopio",
  marca: "Procopio.",
  descricao:
    "Desenvolvedor freelancer. Sites e sistemas web sob medida para empresas que precisam vender pela internet.",
  url: "https://portfolioproprio.vercel.app", // PREENCHER: domínio final
  // PREENCHER: número com DDI e DDD, só dígitos. Ex.: 5511999999999
  whatsapp: "5500000000000",
  mensagemWhatsapp: "Olá, Guilherme. Vi seu portfólio e quero conversar sobre um projeto.",
  email: "", // PREENCHER (fica oculto enquanto vazio)
  redes: [
    { nome: "GitHub", url: "https://github.com/grprocopio" },
    { nome: "LinkedIn", url: "" }, // PREENCHER
    { nome: "Instagram", url: "" }, // PREENCHER
  ],
  githubUsuario: "grprocopio",
  githubTopic: "portfolio",
  // Ainda não decidido pelo usuário: "exato" mostra o valor, "faixa" mostra uma faixa.
  modoValores: "exato" as ModoValores,
};

export const linkWhatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.mensagemWhatsapp)}`;
export const redesAtivas = site.redes.filter((r) => r.url);
