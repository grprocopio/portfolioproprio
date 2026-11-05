# Portfólio — contexto do projeto

Leia este arquivo inteiro antes de qualquer tarefa. Ele guarda as decisões já tomadas. Atualize-o quando uma decisão nova for tomada.

## Objetivo

Portfólio pessoal de desenvolvedor freelancer. Mostra os sites/projetos que vendi para clientes, quanto faturei com eles e meus projetos do GitHub e da Vercel. Serve para atrair novos clientes.

## Método de trabalho (obrigatório)

1. **Explorar:** leia o que já existe antes de mudar algo.
2. **Planejar:** escreva um plano curto e espere aprovação antes de codar algo grande.
3. **Contexto:** pergunte o que faltar em vez de supor. Registre decisões novas aqui.
4. **Implementar em partes:** uma seção por vez, commits pequenos. Comece pela cena 3D + scroll (parte mais arriscada).
5. **Verificar:** confira cada parte no link de prévia da Vercel (desktop e mobile) e o desempenho do 3D antes de seguir. Não diga que está pronto sem verificar.

## Estilo visual

Referência: vídeo de um site de agência (prints em `referencias/`). Usar como **inspiração de estilo**: não copiar marca, textos nem design literal.

- **Paleta:** só preto, cinza e branco. Fundo ~#0a0a0a com leve vinheta e granulado. Sem cor de destaque; o brilho vem do 3D cromado.
- **Tipografia:** títulos em serifada fina e condensada (ex.: Instrument Serif), grandes e centralizados, sempre com **uma palavra em itálico** por frase. Menu e textos em sans pequena (ex.: Inter), cinza claro.
- **Botões:** pílula branca com ícone de seta dentro de um círculo preto.
- **Menu fixo:** logo à esquerda, links no centro, botão "Fale comigo" à direita.
- **Objeto 3D:** fita metálica cromada com gomos (anel/mola), material espelhado em preto e branco, iluminação de estúdio. O mesmo objeto atravessa a página toda.

## Animação no scroll

Stack: Three.js ou React Three Fiber + GSAP ScrollTrigger + Lenis (rolagem suave com inércia).

1. **Hero** (`referencias/01-hero.jpg`): fita em arco atrás do título; ao rolar, gira e se aproxima da câmera.
2. **Sobre** (`02-sobre-coluna-3d.jpg`): fita vira coluna em espiral fixa à direita (sticky) enquanto o texto passa à esquerda.
3. **Projetos** (`03-grade-projetos.jpg`): coluna vai para o lado; cards escuros sobem em parallax com velocidades diferentes.
4. **CTA final** (`04-cta-tunel.jpg`): câmera entra num túnel em espiral com uma esfera cromada no centro.

Respeitar `prefers-reduced-motion` (versão estática). No mobile, 3D mais leve ou vídeo em loop.

## Seções

1. **Hero:** "Sites que *geram* resultado." + subtítulo + botões "Ver projetos" e "Fale comigo".
2. **Sobre + Resultados:** texto curto sobre mim; números animados (contagem ao aparecer) de faturamento total, projetos entregues e ticket médio; gráfico de faturamento por mês, monocromático.
3. **Projetos vendidos:** grade de cards escuros com print do site, nome, tipo e valor; filtro por tipo; clique abre detalhe (stack, prazo, link no ar, depoimento).
4. **Projetos próprios:** puxados do GitHub e da Vercel, com print gerado automaticamente.
5. **CTA final:** "Pronto para *tirar* seu projeto do papel?" + botão para o WhatsApp.
6. **Rodapé:** contato e redes.

## Dados

- **Stack:** Next.js (App Router) + Tailwind, deploy na Vercel. Dados buscados no servidor, revalidação a cada 1h.
- **Vendas:** `data/projetos.json` (preenchido à mão). Campos: `nome`, `cliente` (opcional), `exibir_cliente` (true/false), `tipo`, `valor`, `data`, `prazo`, `stack`, `link`, `imagem`, `repositorio` (opcional), `depoimento` (opcional).
- **GitHub:** usuário `grprocopio`. Mostrar repos públicos com o topic `portfolio`. Repos privados de clientes: só metadados, nunca código.
- **Vercel:** API com token para listar projetos e domínios.
- **Tokens:** só em variáveis de ambiente (configuradas na Vercel). Nunca no código, nunca no cliente.
- **Valores:** ainda não definido (exatos ou em faixas). Perguntar ao usuário antes de implementar o painel de resultados.
- **Privacidade:** só mostrar o nome do cliente quando `exibir_cliente` for true.

## Qualidade

Estados de carregamento e erro (se uma API falhar, o resto do site continua funcionando), responsivo, acessível (contraste, foco visível, textos alternativos), carregamento rápido mesmo com o 3D.

## Decisões tomadas

<!-- Adicione aqui cada decisão nova, com a data. -->
