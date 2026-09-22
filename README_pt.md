# Flaq SaaS Template (Português do Brasil)

Template SaaS gratuito e de código aberto para criar plataformas de geração de imagens e vídeos por IA com a API da [Flaq.ai](https://flaq.ai). Inclui um criador unificado de imagens e vídeos, geração de vídeos a partir de referências e uma tela infinita de IA com gerenciamento local de projetos.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Os idiomas dos README correspondem a `i18n/languages.ts`: cada idioma da interface tem uma apresentação do projeto.

## Índice

- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Primeiros passos](#primeiros-passos)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Upload de arquivos](#upload-de-arquivos)
  - [Configuração da chave API da Flaq.ai](#configuração-da-chave-api-da-flaqai)
- [Uso](#uso)
  - [Desenvolvimento](#desenvolvimento)
  - [Build](#build)
  - [Verificação e formatação](#verificação-e-formatação)
- [Funções AIGC](#funções-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Programa de Afiliados da Flaq.ai](#programa-de-afiliados-da-flaqai)
- [Internacionalização](#internacionalização)
- [SEO e descoberta por rastreadores de IA](#seo-e-descoberta-por-rastreadores-de-ia)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Implantação](#implantação)
- [Licença](#licença)

## Recursos

- 🎨 **Texto para imagem** — Gere imagens a partir de descrições com modelos avançados de IA
- 🖼️ **Imagem para imagem** — Transforme imagens existentes em variações criativas com estilo consistente
- 🎬 **Texto para vídeo** — Crie vídeos de alta qualidade a partir de descrições simples
- 📹 **Imagem para vídeo** — Anime imagens estáticas para criar vídeos dinâmicos
- 🧩 **AI Media Creator** — Gere imagens e vídeos em um formulário compartilhado com controles específicos de cada modelo
- 🎞️ **Referências para vídeo** — Use imagens, vídeos, áudio, documentos ou links conforme o modelo selecionado
- 🗂️ **AI Canvas** — Conecte nós de mídia e geração em uma tela infinita, salve projetos locais e importe ou exporte arquivos ZIP
- 👗 **Provador virtual** — Experimente roupas virtualmente com IA
- 🌐 **Internacionalização** — 15 idiomas alinhados à Flaq.ai, com rotas por idioma e links alternativos de SEO
- 🚀 **Sem cadastro** — Explore, modifique e hospede o template sem criar uma conta no aplicativo
- 🤝 **Afiliados** — Divulgação responsiva do programa Flaq.ai com textos e links localizados
- 🔒 **Gerenciamento seguro de chaves API** — Armazenamento criptografado das credenciais Flaq.ai no cliente
- ☁️ **Upload de arquivos** — Envie mídia com sua chave API da Flaq ou seu próprio armazenamento Cloudflare R2
- 📱 **Design responsivo** — Interface adaptável com Tailwind CSS e Radix UI
- 🌓 **Modo escuro** — Tema escuro incluído
- ⚡ **Desempenho** — Next.js 16 com suporte ao Turbopack
- 🔍 **Otimização SEO** — Metadados dinâmicos, Open Graph, sitemap e dados estruturados
- 🤖 **Preparado para rastreadores de IA** — `llms.txt` organizado, `llms-full.txt` ampliado e acesso público para rastreadores

## Tecnologias

| Categoria | Tecnologia |
| --------- | ---------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Biblioteca de interface | [React 19](https://react.dev/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Componentes | [Radix UI](https://www.radix-ui.com/) |
| Animações | [Framer Motion](https://www.framer.com/motion/) |
| Formulários | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Gerenciamento de estado | [Zustand](https://zustand.docs.pmnd.rs/) |
| Busca de dados | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Gerenciador de pacotes | [pnpm](https://pnpm.io/) |
| Verificação de código | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Primeiros passos

### Pré-requisitos

- **Node.js 22**, versão indicada em `.nvmrc`
- **pnpm 10.5.2**, fixado no campo `packageManager` de `package.json`
- Uma conta [Flaq.ai](https://flaq.ai/) com uma chave API ativa

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. Instale o pnpm se necessário
npm install -g pnpm@10.5.2

# 3. Instale as dependências
pnpm install

# 4. Copie o modelo de ambiente
cp .env.example .env.local
```

### Variáveis de ambiente

Configure estas variáveis em `.env.local`:

```bash
# URL do site para metadados, sitemap e Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Email de contato exibido no rodapé
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Opcional: armazenamento Cloudflare R2 próprio (credenciais somente no servidor)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Upload de arquivos

Por padrão, os uploads usam a URL da API e o Client Key configurados em **Open API Settings**. Para usar seu próprio armazenamento Cloudflare R2, configure `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` e `R2_BUCKET_NAME` no servidor; depois informe seu domínio público em **Image Hosting (R2)** e salve. Mantenha as credenciais R2 somente no servidor. Verifique a configuração com **Test R2 Connection**.

Quando há um domínio público configurado, os uploads usam primeiro seu armazenamento R2. Apague o domínio e salve para voltar aos uploads da Flaq. Erros do armazenamento próprio são informados sem mudar automaticamente para a Flaq.

Nos uploads da Flaq, o aplicativo solicita URLs por `POST /api/v1/files/presignedUrl` e envia cada arquivo diretamente com `PUT`. Cada requisição aceita até 10 arquivos; seleções maiores são enviadas em lotes sucessivos, por exemplo 10 e 4 para 14 arquivos. Cada lote é enviado assim que recebe suas URLs, que expiram após 60 segundos. As URLs públicas retornadas são usadas nas requisições de geração.

### Configuração da chave API da Flaq.ai

1. Cadastre-se ou entre em [flaq.ai](https://flaq.ai).
2. Abra o painel da sua conta.
3. Gere um **Client Key** na seção de chaves API.
4. Copie o Client Key.
5. No aplicativo, clique na **engrenagem** (⚙️) do cabeçalho para abrir **Open API Settings**.
6. Cole sua chave e clique em **Test Connection**.
7. Salve as configurações.

> **💡 Dica:** “Remember Me” mantém sua chave criptografada no armazenamento local do navegador entre sessões. Deixe essa opção desativada em dispositivos compartilhados ou públicos.

> **🔑 Créditos API:** É necessário ter créditos suficientes para gerar imagens e vídeos. Recarregue o saldo em [flaq.ai](https://flaq.ai) quando precisar.

## Uso

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento com Turbopack para HMR mais rápido
pnpm dev:turbo

# Ou use o comando padrão de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build

```bash
# Compile para produção
pnpm build

# Inicie o servidor de produção
pnpm start
```

### Verificação e formatação

```bash
# Execute o ESLint
pnpm lint

# Corrija automaticamente os problemas de lint
pnpm lint:fix

# Formate o código com Prettier
pnpm prettier

# Verifique os tipos TypeScript
pnpm ts-check
```

## Funções AIGC

O template combina páginas dedicadas de geração, um criador compartilhado e uma tela infinita usando a API da [Flaq.ai](https://flaq.ai).

| Função | Rota | Descrição |
| ------ | ---- | --------- |
| **Texto para imagem** | `/text-to-image/` | Gere imagens a partir de descrições |
| **Imagem para imagem** | `/image-to-image/` | Edite imagens com instruções e imagens de referência |
| **Texto para vídeo** | `/text-to-video/` | Gere vídeos a partir de descrições |
| **Imagem para vídeo** | `/image-to-video/` | Gere vídeos a partir de imagens, com controle do quadro final nos modelos compatíveis |
| **Referências para vídeo** | `/reference-to-video/` | Prepare referências e continue a geração no AI Media Creator |
| **Provador virtual** | `/virtual-try-on/` | Combine a foto de uma pessoa e imagens de roupas para visualizar um conjunto |
| **AI Media Creator** | `/ai-media-creator/` | Gere imagens e vídeos no mesmo espaço e consulte o histórico |
| **AI Canvas** | `/ai-canvas/` | Crie fluxos visuais conectados e gerencie projetos da tela |

As definições dos modelos ficam em `lib/constants/template-models/`, agrupadas por fornecedor e tipo de mídia. Os modelos de imagem incluem, por exemplo, Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 e Seedream 5.0. Os modelos de vídeo incluem Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 e Vidu Q3. As entradas e os parâmetros disponíveis dependem do modelo selecionado; cada formulário usa a configuração correspondente.

O provador virtual tem sua própria seleção: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit e Seedream 4.5 Edit.

### AI Media Creator

Use `/ai-media-creator/` para alternar entre imagens e vídeos, escolher um modelo, adicionar entradas e configurar os parâmetros disponíveis. A geração a partir de referências aceita imagens, vídeos, áudio, documentos e links quando o modelo permite, com menções às referências no editor de instruções.

O status da geração é consultado automaticamente e os resultados aparecem no histórico do criador. Os históricos de imagens e vídeos ficam no armazenamento local do navegador atual.

### AI Canvas

Comece em `/ai-canvas/`, gerencie os projetos salvos em `/ai-canvas/projects/` e abra um projeto em `/ai-canvas/{projectId}/`. O formulário inicial prepara um projeto com as configurações de geração e entradas selecionadas.

- Organize e conecte nós de mídia e geração em uma tela infinita
- Gere imagens e vídeos com a conexão API configurada
- Salve projetos localmente no IndexedDB e reabra-os pelo painel de projetos
- Renomeie, exclua, importe e exporte projetos, incluindo arquivos ZIP com suas mídias

Os projetos pertencem ao navegador atual e à origem do site; não há sincronização por conta. Exporte os projetos para manter uma cópia transferível antes de apagar os dados do navegador ou mudar de dispositivo ou domínio.

## Programa de Afiliados da Flaq.ai

As páginas públicas de apresentação e geração incluem uma promoção localizada do [Programa de Afiliados da Flaq.ai](https://flaq.ai/pt/affiliate-program?utm_source=flaq-saas-template). O link abre a página Flaq.ai no idioma correspondente e inclui `utm_source=flaq-saas-template` para atribuir a origem.

Segundo os termos atuais, você pode ganhar 20% sobre o primeiro pedido pago válido de um usuário indicado e 10% sobre os pedidos pagos válidos seguintes realizados em até 60 dias após o cadastro. A elegibilidade e os pagamentos seguem os termos publicados na página do programa.

## Internacionalização

O template oferece **15 idiomas**: inglês (padrão), japonês, indonésio, italiano, português do Brasil, espanhol, alemão, russo, francês, chinês simplificado, chinês tradicional, coreano, tailandês, vietnamita e árabe.

- As traduções ficam em `messages/`, com um arquivo JSON por idioma.
- O idioma é detectado pelo cabeçalho `Accept-Language` do navegador.
- É possível alterá-lo no rodapé ou na caixa de diálogo de idiomas.
- As URLs usam `/` para inglês e `/{locale}/` para os demais idiomas, por exemplo `/ja/` ou `/zh/`.
- Páginas em árabe usam automaticamente a direção da direita para a esquerda.

Para adicionar idiomas:

1. Adicione o idioma em `i18n/languages.ts`.
2. Crie um arquivo de tradução em `messages/`.
3. Traduza os textos das páginas e `Metadata` seguindo a estrutura de chaves existente.

## SEO e descoberta por rastreadores de IA

As páginas públicas de apresentação e geração usam títulos e descrições localizados, URL canônica absoluta, alternativas `hreflang` para 15 idiomas, metadados Open Graph, cartão do Twitter e diretivas index/follow. O `/sitemap.xml` gerado inclui a página inicial, as funções e as páginas de políticas em cada idioma, com as alternativas correspondentes. URLs de projetos locais individuais da tela não são incluídas.

- `/robots.txt` permite que buscadores e assistentes de IA rastreiem o conteúdo público, bloqueando rotas API e de callback.
- `/llms.txt` fornece um mapa conciso e estruturado do produto, páginas, idiomas, documentação e políticas.
- `/llms-full.txt` amplia o contexto do projeto, funções, configuração, arquitetura e limites de uso.
- JSON-LD identifica o site e o repositório de código aberto sob licença MIT, sem avaliações não verificáveis.

Defina `NEXT_PUBLIC_SITE_URL` com a origem de produção antes da implantação para que as URLs canônicas, do sitemap e dos recursos LLM usem o domínio correto.

## Estrutura do projeto

```text
.
├── app/                     # Páginas Next.js App Router
│   ├── [locale]/           # Rotas internacionalizadas, 15 idiomas
│   │   ├── (with-footer)/  # Páginas com rodapé
│   │   │   ├── (home)/     # Página inicial
│   │   │   └── (ai-features)/ # Páginas das funções AIGC
│   │   └── (without-footer)/ # Entrada AI Canvas, painel de projetos e editor
│   ├── api/                # Rotas API: proxy-image, upload
│   ├── robots.ts           # Geração de robots.txt
│   ├── sitemap.ts          # Geração do sitemap dinâmico
│   ├── llms.txt/           # Mapa resumido do site para IA
│   └── llms-full.txt/      # Contexto ampliado do projeto para IA
├── components/             # Componentes React reutilizáveis
│   ├── infinite-canvas/    # Editor, painel, integrações e persistência local
│   ├── unified-generator/  # Formulário comum de imagem/vídeo e histórico
│   ├── ui/                 # Componentes no estilo shadcn/ui baseados em Radix
│   ├── dialog/             # Diálogos, incluindo configurações de API
│   ├── layout/             # Cabeçalho, rodapé e barra lateral
│   └── ...                 # Componentes específicos de cada função
├── hooks/                  # Hooks React personalizados
├── i18n/                   # Configuração da internacionalização
│   ├── languages.ts        # Idiomas disponíveis
│   ├── request.ts          # Configuração de requisições next-intl
│   └── routing.ts          # Rotas por idioma
├── lib/                    # Bibliotecas de utilitários
│   ├── seo/                # Metadados, llms.txt e utilitários de rastreamento
│   ├── constants/          # Constantes, modelos por fornecedor e navegação
│   ├── utils/              # Funções auxiliares
│   └── env.ts              # Utilitários para variáveis de ambiente
├── messages/               # Uma tradução por idioma
├── network/                # Cliente API e utilitários de rede
│   ├── clientFetch.ts      # Cliente Flaq.ai com autenticação
│   ├── image/              # Chamadas API de geração de imagens
│   ├── video/              # Chamadas API de geração de vídeos
│   ├── local-history.ts    # Histórico de geração local do navegador
│   ├── task-polling.ts     # Consulta compartilhada do status da geração
│   └── upload/             # Cliente de upload de arquivos Flaq
├── public/                 # Arquivos estáticos: imagens, ícones e fontes
├── store/                  # Armazenamentos de estado Zustand
├── next.config.mjs         # Configuração Next.js
├── proxy.ts                # Proxy middleware: i18n e encaminhamento de IP
└── tsconfig.json           # Configuração TypeScript
```

## Implantação

A forma mais simples de implantar o template é pelo [Vercel](https://vercel.com):

[![Implantar com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Envie o repositório para o GitHub.
2. Importe o projeto no Vercel.
3. Defina `NEXT_PUBLIC_SITE_URL` com a origem de produção e configure o email de contato nas configurações do projeto no Vercel.
4. Se usar R2 próprio, adicione as quatro variáveis de servidor `R2_*` e configure o domínio público no aplicativo.
5. Implante!

O aplicativo inclui rotas de servidor para uploads e proxy de imagens, por isso requer um ambiente de servidor Next.js. Para hospedagem própria em Node.js, execute `pnpm build` e depois `pnpm start`. Execute `pnpm ts-check` separadamente antes da implantação, pois a configuração atual do Next.js ignora erros TypeScript durante o build.

## Licença

Este projeto é de código aberto sob a [licença MIT](LICENSE).
