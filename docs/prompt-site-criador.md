# Prompt adaptado: portfólio estilo "criador 3D" para o Procopio

Adaptado de um prompt de template ("Jack, 3D Creator"). Mantém o layout e as animações do template, mas troca **todo o conteúdo e todas as imagens** pelos do Procopio (as imagens originais eram de terceiros) e encaixa no projeto que já existe (Next.js, dados de vendas, GitHub/Vercel, WhatsApp).

Itens marcados com **[decidir]** ainda dependem de uma escolha do Procopio.

---

Construa a landing page do portfólio de **Guilherme Procopio, desenvolvedor freelancer de sites**, no projeto Next.js existente (App Router, TypeScript, Tailwind CSS 4). Use **Framer Motion** (pacote `motion`) para as animações e **Phosphor** para os ícones. Mantenha Lenis (rolagem suave) e a camada de dados atual. Todo o texto em português do Brasil.

Título da página: `Procopio | Desenvolvedor de sites`.

## Estilo global

- **Fundo:** `#0C0C0C` em `html`, `body` e no invólucro principal. **[decidir]** ou manter o marinho atual (`#050816`) com destaque índigo `#4B5BFF`.
- **Fonte:** Kanit (Google Fonts via `next/font`, pesos 300 a 900).
- Reset global: `box-sizing: border-box`, margem e padding zerados.
- Classe `.hero-heading`: texto em degradê `linear-gradient(180deg, #646973 0%, #BBCCD7 100%)` com `background-clip: text` e preenchimento transparente.
- Invólucro principal com `overflow-x: clip`.
- Texto claro padrão: `#D7E2EA`.
- **Animações sempre ligadas**: não desligar com `prefers-reduced-motion` (decisão já registrada no `CLAUDE.md`).

## Ordem das seções

1. Hero
2. Faixa de projetos (marquee)
3. Sobre (com resultados)
4. Serviços
5. Projetos
6. Contato e rodapé

## 1. Hero

Altura da tela inteira, coluna flex, `overflow-x: clip`.

- **Menu:** 4 links espaçados com `justify-between`: "Sobre", "Serviços", "Projetos", "Contato" (âncoras da própria página). Cor `#D7E2EA`, `font-medium`, maiúsculas, `tracking-wider`, `text-sm md:text-lg lg:text-[1.4rem]`, `px-6 md:px-10 pt-6 md:pt-8`. Hover: opacidade 70% em 200 ms.
- **Título gigante:** `h1` com o texto **"Oi, sou Procopio"** usando `.hero-heading`, `font-black`, maiúsculas, `tracking-tight`, `leading-none`, `whitespace-nowrap`, largura total. Como o texto é maior que "Hi, i'm jack", ajuste o tamanho até caber numa linha sem estourar: ponto de partida `text-[12vw] lg:text-[13.5vw]`; conferir em 390 px e 1440 px. Margem superior `mt-6 sm:mt-4 md:-mt-5`, dentro de um contêiner com `overflow-hidden`.
- **Barra inferior** (`flex justify-between items-end pb-7 sm:pb-8 md:pb-10`):
  - Esquerda: "Desenvolvedor freelancer que cria sites rápidos que viram clientes", `#D7E2EA`, `font-light`, maiúsculas, `tracking-wide`, `leading-snug`, `font-size: clamp(0.75rem, 1.4vw, 1.5rem)`, `max-w-[160px] sm:max-w-[220px] md:max-w-[260px]`.
  - Direita: `BotaoContato` (abre o WhatsApp).
- **Personagem:** imagem do personagem 3D do Procopio (`/personagem.webp`, fundo transparente, ver "Personagem" abaixo), centralizada em posição absoluta, dentro do componente `Ima` (efeito magnético). Ima: alcance 150 px, força 3, transição ativa `transform 0.3s ease-out`, inativa `transform 0.6s ease-in-out`. Posição `absolute left-1/2 -translate-x-1/2 z-10`, largura `w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]`; no celular `top-1/2 -translate-y-1/2`, a partir de `sm` `sm:top-auto sm:translate-y-0 sm:bottom-0`. Texto alternativo: "Personagem 3D do Guilherme Procopio".
- **Entradas (FadeIn):** menu (atraso 0, y -20), título (0,15, y 40), texto da esquerda (0,35, y 20), botão (0,5, y 20), personagem (0,6, y 30).

## 2. Faixa de projetos (marquee)

Duas fileiras de imagens que andam na horizontal conforme a rolagem. Fundo `#0C0C0C`, `pt-24 sm:pt-32 md:pt-40 pb-10`.

- **Imagens: só trabalhos do Procopio.** Prints dos projetos vendidos (`imagem` em `data/projetos.json`) e dos projetos próprios (prints automáticos do GitHub/Vercel). Ideal: vídeos curtos ou GIFs de cada site rolando (gravar a tela de cada site, 5 a 8 s, WebM/MP4 sem som, em `public/marquee/`).
- Respeitar a privacidade: projeto com `exibir_cliente: false` não mostra o nome do cliente na faixa.
- Dividir a lista em duas metades. Fileira 1: primeira metade, repetida 3 vezes, anda para a **direita** (`translateX(deslocamento - 200)`). Fileira 2: segunda metade, repetida 3 vezes, anda para a **esquerda** (`translateX(-(deslocamento - 200))`). Com poucas imagens, repetir até preencher.
- Deslocamento: `(scrollY - topoDaSecao + innerHeight) * 0.3`, num listener passivo agendado com `requestAnimationFrame`.
- Cada item: 420 × 270 px, `rounded-2xl`, `object-cover`, carregamento preguiçoso, texto alternativo com o nome do projeto. Espaço `gap-3` entre itens e entre fileiras. `will-change: transform`.

## 3. Sobre (com resultados)

Seção centralizada, `min-h-screen`, `px-5 sm:px-8 md:px-10 py-20`.

- **Quatro objetos 3D decorativos** nos cantos (mesmas posições, tamanhos e entradas do template). **As imagens precisam ser geradas para o Procopio**, no mesmo estilo do personagem. Sugestão de objetos ligados a sites: um cursor de mouse, um navegador com uma página, um balão de WhatsApp, uma lupa (Google/SEO). Arquivos em `public/objetos/`, PNG transparente. Decorativos: `alt=""`.
  - Topo esquerdo: `w-[120px] sm:w-[160px] md:w-[210px]`, `top-[4%] left-[1%] sm:left-[2%] md:left-[4%]`; FadeIn atraso 0,1, x -80, duração 0,9.
  - Base esquerda: `w-[100px] sm:w-[140px] md:w-[180px]`, `bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]`; atraso 0,25, x -80.
  - Topo direito: `w-[120px] sm:w-[160px] md:w-[210px]`, `top-[4%] right-[1%] sm:right-[2%] md:right-[4%]`; atraso 0,15, x 80.
  - Base direita: `w-[130px] sm:w-[170px] md:w-[220px]`, `bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]`; atraso 0,3, x 80.
- **Título:** "Sobre mim" com `.hero-heading`, `font-black`, maiúsculas, centralizado, `font-size: clamp(3rem, 12vw, 160px)`; FadeIn atraso 0, y 40.
- **Parágrafo animado letra por letra** (cada letra vai de opacidade 0,2 a 1 com a rolagem, `offset ['start 0.8', 'end 0.2']`): "Sou Guilherme, desenvolvedor freelancer. Desenho e programo sites que carregam rápido, aparecem no Google e transformam visita em conversa no WhatsApp. Você fala direto comigo, do primeiro rascunho ao site no ar." Cor `#D7E2EA`, `font-medium`, centralizado, `leading-relaxed`, `max-w-[560px]`, `font-size: clamp(1rem, 2vw, 1.35rem)`.
- **Resultados** (vêm do site atual): os três números com contagem (faturamento total, projetos entregues, ticket médio) calculados de `data/projetos.json`, numa linha abaixo do parágrafo. **[decidir]** valores exatos ou em faixas (`site.modoValores`).
- `BotaoContato` abaixo. Espaços: título/texto `gap-10 sm:gap-14 md:gap-16`; bloco de texto/botão `gap-16 sm:gap-20 md:gap-24`.

## 4. Serviços

Fundo branco `#FFFFFF`, cantos de cima arredondados `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, `px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32`.

- **Título:** "Serviços", cor `#0C0C0C`, `font-black`, maiúsculas, centralizado, `font-size: clamp(3rem, 12vw, 160px)`, `mb-16 sm:mb-20 md:mb-28`.
- **5 itens** em lista vertical, `max-w-5xl` centralizada:
  - **01, Sites institucionais:** "Site completo da sua empresa, com páginas por serviço, pronto para aparecer no Google da sua região e levar o visitante até o WhatsApp."
  - **02, Landing pages:** "Uma página focada numa oferta só, para campanhas e lançamentos, desenhada para transformar clique em contato ou venda."
  - **03, Lojas virtuais:** "Loja com catálogo, carrinho, frete e pagamento, para você vender sem depender de responder pedido por mensagem."
  - **04, Sistemas web:** "Painéis e ferramentas sob medida para organizar a rotina do negócio, como agendamentos, estoque e controle de frota."
  - **05, Manutenção e melhorias:** "Ajustes, novas páginas e acompanhamento de desempenho depois que o site está no ar, sem você precisar procurar outra pessoa."
- Cada item: número à esquerda (`font-black`, `font-size: clamp(3rem, 10vw, 140px)`, `#0C0C0C`), nome e descrição empilhados à direita. Nome: `font-medium`, maiúsculas, `clamp(1rem, 2.2vw, 2.1rem)`. Descrição: `font-light`, `leading-relaxed`, `max-w-2xl`, `clamp(0.85rem, 1.6vw, 1.25rem)`, opacidade 0,6. Separadores de 1 px `rgba(12,12,12,0.15)`, `py-8 sm:py-10 md:py-12`. FadeIn escalonado (atraso `i * 0.1`).

## 5. Projetos

Fundo `#0C0C0C`, cantos de cima arredondados `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, puxada para cima com `-mt-10 sm:-mt-12 md:-mt-14`, `z-10`.

- **Título:** "Projetos" com `.hero-heading`.
- **Cartões empilhados com sticky** (Framer Motion `useScroll` + `useTransform`): cada um `sticky top-24 md:top-32` dentro de um contêiner `h-[85vh]`; escala final `1 - (total - 1 - i) * 0.03`; deslocamento `top: i * 28px`.
- Cartão: `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]`, `border-2 border-[#D7E2EA]`, fundo `#0C0C0C`, `p-4 sm:p-6 md:p-8`.
  - Linha de cima: número grande, categoria ("Cliente" para projeto vendido, "Pessoal" para projeto próprio), nome, tipo e valor (respeitando `site.modoValores`), e o botão `BotaoProjeto` "Ver site no ar" (quando houver link).
  - Linha de baixo: grade de 2 colunas. Esquerda (40%) com 2 imagens empilhadas (alturas `clamp(130px, 16vw, 230px)` e `clamp(160px, 22vw, 340px)`); direita (60%) com 1 imagem alta. Todas com `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]`.
- **Dados:** vêm de `data/projetos.json`. Adicionar o campo `imagens` (3 prints por projeto: página inicial no computador, uma página interna, a versão de celular) em `public/projetos/`. Cliente só aparece com `exibir_cliente: true`.
- Clique no cartão abre o detalhe já existente (stack, prazo, depoimento).
- Depois dos cartões, manter os **projetos próprios** do GitHub/Vercel (tópico `portfolio`) como cartões "Pessoal" ou como grade menor.

## 6. Contato e rodapé

Manter a seção final atual: "Pronto para tirar seu projeto do papel?" com o `BotaoContato` para o WhatsApp, e o rodapé com contato, redes e link de privacidade.

## Componentes reutilizáveis

- **BotaoContato:** pílula com fundo `linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)`, sombra `0px 4px 4px rgba(181,1,167,0.25), 4px 4px 12px #7721B1 inset`, contorno branco de 2 px com deslocamento -3 px. Texto branco, `font-medium`, maiúsculas, `tracking-widest`; `px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4`; `text-xs sm:text-sm md:text-base`. Rótulo: "Fale comigo". Abre o WhatsApp (`linkWhatsapp` de `data/site.ts`). **[decidir]** degradê roxo/laranja do template ou índigo.
- **BotaoProjeto:** pílula vazada, `border-2 border-[#D7E2EA]`, texto `#D7E2EA`, `font-medium`, maiúsculas, `tracking-widest`, `px-8 py-3 sm:px-10 sm:py-3.5`, `text-sm sm:text-base`; hover `bg-[#D7E2EA]/10`. Rótulo: "Ver site no ar".
- **FadeIn:** `whileInView` com `viewport={{ once: true, margin: "50px", amount: 0 }}`; aceita atraso, duração (padrão 0,7), x (padrão 0) e y (padrão 30); curva `[0.25, 0.1, 0.25, 1]`; elemento dinâmico com `motion.create()`.
- **Ima:** efeito magnético que segue o mouse: mede a posição relativa ao centro do elemento e aplica `translate3d` dividido pela força; ativa quando o cursor está a menos de `alcance` px da borda; `will-change: transform`. No celular (sem mouse), fica parado.
- **TextoAnimado:** revelação letra por letra com `useScroll` no próprio parágrafo, `offset ['start 0.8', 'end 0.2']`; cada letra com um espaço reservado invisível e o caractere animado em posição absoluta.

## O que sai do site atual

- Partículas (nome PROCOPIO, rosto, nuvem, túnel) e PROCOPIO girando no rodapé. **[decidir]** manter alguma delas (por exemplo, as partículas atrás do título do hero).
- Fonte Geist, menu flutuante embaixo, cards de vidro.

## Personagem 3D

Ver a seção "Como fazer o personagem" na conversa. Arquivo final: `public/personagem.webp`, fundo transparente, retrato de meio corpo, ao menos 1200 px de altura.

## Responsivo

Breakpoints padrão do Tailwind (`sm` 640, `md` 768, `lg` 1024), mobile first, `clamp()` na tipografia. Conferir 390 px e 1440 px sem rolagem horizontal.
