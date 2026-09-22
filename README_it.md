# Flaq SaaS Template (Italiano)

Template SaaS gratuito e open source per creare piattaforme di generazione di immagini e video AI con l'API di [Flaq.ai](https://flaq.ai). Include un ambiente unificato per creare immagini e video, flussi video basati su riferimenti e una tela AI infinita con gestione locale dei progetti.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Le lingue dei README corrispondono a `i18n/languages.ts`: ogni lingua dell'interfaccia dispone di una presentazione del progetto.

## Indice

- [Funzionalità](#funzionalità)
- [Tecnologie](#tecnologie)
- [Primi passi](#primi-passi)
  - [Prerequisiti](#prerequisiti)
  - [Installazione](#installazione)
  - [Variabili di ambiente](#variabili-di-ambiente)
  - [Caricamento dei file](#caricamento-dei-file)
  - [Configurazione della chiave API Flaq.ai](#configurazione-della-chiave-api-flaqai)
- [Utilizzo](#utilizzo)
  - [Sviluppo](#sviluppo)
  - [Build](#build)
  - [Controllo e formattazione](#controllo-e-formattazione)
- [Funzioni AIGC](#funzioni-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Programma di affiliazione Flaq.ai](#programma-di-affiliazione-flaqai)
- [Internazionalizzazione](#internazionalizzazione)
- [SEO e individuazione da parte dei crawler AI](#seo-e-individuazione-da-parte-dei-crawler-ai)
- [Struttura del progetto](#struttura-del-progetto)
- [Distribuzione](#distribuzione)
- [Licenza](#licenza)

## Funzionalità

- 🎨 **Testo-immagine** — Genera immagini da descrizioni testuali con modelli AI avanzati
- 🖼️ **Immagine-immagine** — Trasforma immagini esistenti in varianti creative con uno stile coerente
- 🎬 **Testo-video** — Crea video di alta qualità da semplici descrizioni
- 📹 **Immagine-video** — Anima immagini statiche per creare video dinamici
- 🧩 **AI Media Creator** — Genera immagini e video con un modulo condiviso e controlli specifici per modello
- 🎞️ **Riferimenti-video** — Usa immagini, video, audio, documenti o link di riferimento in base al modello scelto
- 🗂️ **AI Canvas** — Collega nodi multimediali e di generazione su una tela infinita, salva progetti locali e importa o esporta archivi ZIP
- 👗 **Prova virtuale di abiti** — Prova virtualmente i vestiti con l'AI
- 🌐 **Internazionalizzazione** — 15 lingue allineate a Flaq.ai, con routing multilingue e link SEO alternativi
- 🚀 **Nessuna registrazione richiesta** — Esplora, modifica e ospita il template senza creare un account nell'app
- 🤝 **Affiliazione** — Promozione responsive del programma Flaq.ai con testi e link localizzati
- 🔒 **Gestione sicura delle chiavi API** — Memorizzazione cifrata delle credenziali Flaq.ai lato client
- ☁️ **Caricamento dei file** — Carica contenuti multimediali con la chiave API Flaq o il tuo spazio Cloudflare R2
- 📱 **Design responsive** — Interfaccia adattabile realizzata con Tailwind CSS e Radix UI
- 🌓 **Modalità scura** — Tema scuro già disponibile
- ⚡ **Prestazioni** — Next.js 16 con supporto per Turbopack
- 🔍 **Ottimizzazione SEO** — Metadati dinamici, Open Graph, sitemap e dati strutturati
- 🤖 **Supporto ai crawler AI** — `llms.txt` curato, `llms-full.txt` esteso e accesso pubblico per i crawler

## Tecnologie

| Categoria | Tecnologia |
| --------- | ---------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Linguaggio | [TypeScript](https://www.typescriptlang.org/) |
| Libreria UI | [React 19](https://react.dev/) |
| Stili | [Tailwind CSS v4](https://tailwindcss.com/) |
| Componenti | [Radix UI](https://www.radix-ui.com/) |
| Animazioni | [Framer Motion](https://www.framer.com/motion/) |
| Moduli | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Gestione dello stato | [Zustand](https://zustand.docs.pmnd.rs/) |
| Recupero dei dati | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Icone | [Lucide React](https://lucide.dev/) |
| Grafici | [Recharts](https://recharts.org/) |
| Gestore dei pacchetti | [pnpm](https://pnpm.io/) |
| Controllo del codice | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Primi passi

### Prerequisiti

- **Node.js 22**, versione indicata in `.nvmrc`
- **pnpm 10.5.2**, fissato nel campo `packageManager` di `package.json`
- Un account [Flaq.ai](https://flaq.ai/) con una chiave API attiva

### Installazione

```bash
# 1. Clona il repository
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. Installa pnpm se non è già disponibile
npm install -g pnpm@10.5.2

# 3. Installa le dipendenze
pnpm install

# 4. Copia il modello delle variabili di ambiente
cp .env.example .env.local
```

### Variabili di ambiente

Configura le seguenti variabili in `.env.local`:

```bash
# URL del sito per metadati, sitemap e Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Email di contatto nel piè di pagina
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Facoltativo: spazio Cloudflare R2 personale (credenziali solo lato server)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Caricamento dei file

Per impostazione predefinita, i caricamenti usano l'URL API e il Client Key configurati in **Open API Settings**. Per usare il tuo spazio Cloudflare R2, imposta `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` e `R2_BUCKET_NAME` sul server, poi inserisci il dominio pubblico in **Image Hosting (R2)** e salva. Conserva le credenziali R2 esclusivamente sul server. Verifica la configurazione con **Test R2 Connection**.

Quando è configurato un dominio pubblico, i caricamenti usano prima il tuo spazio R2. Cancella il dominio e salva per tornare ai caricamenti Flaq. Gli errori dello spazio personalizzato vengono segnalati senza passare automaticamente a Flaq.

Per i caricamenti Flaq, l'app richiede gli URL tramite `POST /api/v1/files/presignedUrl` e carica ogni file direttamente con `PUT`. Ogni richiesta supporta fino a 10 file; le selezioni più grandi vengono caricate in gruppi successivi, ad esempio 10 e 4 per 14 file. Ogni gruppo viene caricato subito dopo aver ricevuto gli URL, che scadono dopo 60 secondi. Gli URL pubblici restituiti vengono usati nelle richieste di generazione.

### Configurazione della chiave API Flaq.ai

1. Registrati o accedi su [flaq.ai](https://flaq.ai).
2. Apri la dashboard del tuo account.
3. Genera un **Client Key** nella sezione delle chiavi API.
4. Copia il Client Key.
5. Nell'app, fai clic sull'**ingranaggio** (⚙️) nell'intestazione per aprire **Open API Settings**.
6. Incolla la chiave e fai clic su **Test Connection**.
7. Salva le impostazioni.

> **💡 Suggerimento:** «Remember Me» conserva la chiave cifrata nella memoria locale del browser tra le sessioni. Lascia l'opzione disattivata sui dispositivi condivisi o pubblici.

> **🔑 Crediti API:** Per generare immagini e video servono crediti sufficienti. Ricarica il saldo su [flaq.ai](https://flaq.ai) quando necessario.

## Utilizzo

### Sviluppo

```bash
# Avvia il server di sviluppo con Turbopack per un HMR più rapido
pnpm dev:turbo

# Oppure usa il comando di sviluppo predefinito
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Build

```bash
# Build di produzione
pnpm build

# Avvio del server di produzione
pnpm start
```

### Controllo e formattazione

```bash
# Esegui ESLint
pnpm lint

# Correggi automaticamente i problemi di lint
pnpm lint:fix

# Formatta il codice con Prettier
pnpm prettier

# Verifica i tipi TypeScript
pnpm ts-check
```

## Funzioni AIGC

Il template combina pagine di generazione dedicate, un ambiente di creazione condiviso e una tela infinita grazie all'API di [Flaq.ai](https://flaq.ai).

| Funzione | Percorso | Descrizione |
| -------- | -------- | ----------- |
| **Testo-immagine** | `/text-to-image/` | Genera immagini da descrizioni testuali |
| **Immagine-immagine** | `/image-to-image/` | Modifica immagini usando prompt e immagini di riferimento |
| **Testo-video** | `/text-to-video/` | Genera video da descrizioni testuali |
| **Immagine-video** | `/image-to-video/` | Genera video da immagini, con controllo del fotogramma finale nei modelli compatibili |
| **Riferimenti-video** | `/reference-to-video/` | Prepara i riferimenti e prosegui la generazione in AI Media Creator |
| **Prova virtuale di abiti** | `/virtual-try-on/` | Combina la foto di una persona e immagini di vestiti per visualizzare un abbinamento |
| **AI Media Creator** | `/ai-media-creator/` | Genera immagini e video nello stesso spazio e consulta la cronologia |
| **AI Canvas** | `/ai-canvas/` | Crea flussi visivi collegati e gestisci i progetti della tela |

Le definizioni dei modelli si trovano in `lib/constants/template-models/`, raggruppate per fornitore e tipo di contenuto. Tra i modelli per immagini figurano Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 e Seedream 5.0. Tra i modelli video figurano Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 e Vidu Q3. Input e parametri disponibili dipendono dal modello scelto; ogni modulo usa la configurazione corrispondente.

La prova virtuale offre una selezione dedicata: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit e Seedream 4.5 Edit.

### AI Media Creator

Usa `/ai-media-creator/` per passare tra immagini e video, scegliere un modello, aggiungere input e configurare i parametri supportati. La generazione video da riferimenti supporta immagini, video, audio, documenti e link quando consentiti dal modello, con menzioni dei riferimenti nell'editor del prompt.

Lo stato della generazione viene controllato automaticamente e i risultati compaiono nella cronologia del creatore. Le cronologie di immagini e video sono salvate nella memoria locale del browser corrente.

### AI Canvas

Inizia da `/ai-canvas/`, gestisci i progetti salvati in `/ai-canvas/projects/` e apri un singolo progetto in `/ai-canvas/{projectId}/`. Il modulo iniziale prepara un progetto a partire dalle impostazioni di generazione e dagli input selezionati.

- Disponi e collega nodi multimediali e di generazione su una tela infinita
- Genera immagini e video tramite la connessione API configurata
- Salva i progetti localmente in IndexedDB e riaprili dalla dashboard
- Rinomina, elimina, importa ed esporta progetti, inclusi archivi ZIP con i relativi file multimediali

I progetti appartengono al browser corrente e all'origine del sito; non esiste sincronizzazione tramite account. Esporta i progetti per conservarne una copia trasferibile prima di cancellare i dati del browser o passare a un altro dispositivo o dominio.

## Programma di affiliazione Flaq.ai

Le pagine pubbliche di presentazione e generazione includono una promozione localizzata del [Programma di affiliazione Flaq.ai](https://flaq.ai/it/affiliate-program?utm_source=flaq-saas-template). Il collegamento apre la pagina Flaq.ai nella lingua corrispondente e include `utm_source=flaq-saas-template` per attribuire la provenienza.

Secondo le condizioni attuali, puoi guadagnare il 20% sul primo ordine valido a pagamento di un utente segnalato e il 10% sui successivi ordini validi a pagamento effettuati entro 60 giorni dalla registrazione. Idoneità e pagamenti seguono i termini pubblicati sulla pagina del programma.

## Internazionalizzazione

Il template supporta **15 lingue**: inglese (predefinito), giapponese, indonesiano, italiano, portoghese brasiliano, spagnolo, tedesco, russo, francese, cinese semplificato, cinese tradizionale, coreano, thailandese, vietnamita e arabo.

- Le traduzioni sono in `messages/`, un file JSON per lingua.
- La lingua viene rilevata dall'intestazione `Accept-Language` del browser.
- È possibile cambiarla dal piè di pagina o dalla finestra delle lingue.
- Le URL usano `/` per l'inglese e `/{locale}/` per le altre lingue, ad esempio `/ja/` o `/zh/`.
- Le pagine arabe usano automaticamente la direzione da destra a sinistra.

Per aggiungere una lingua:

1. Aggiungila a `i18n/languages.ts`.
2. Crea il file di traduzione in `messages/`.
3. Traduci i testi delle pagine e `Metadata` seguendo la struttura delle chiavi esistente.

## SEO e individuazione da parte dei crawler AI

Le pagine pubbliche di presentazione e generazione usano titoli e descrizioni localizzati, una URL canonica assoluta, alternative `hreflang` in 15 lingue, metadati Open Graph, una scheda Twitter e direttive index/follow. Il file `/sitemap.xml` generato include la home, le funzionalità e le pagine delle informative in ogni lingua con le relative alternative. Non include le URL dei singoli progetti locali della tela.

- `/robots.txt` consente a motori di ricerca e assistenti AI di esplorare i contenuti pubblici, bloccando le rotte API e di callback.
- `/llms.txt` fornisce una mappa concisa e strutturata di prodotto, pagine, lingue, documentazione e informative.
- `/llms-full.txt` approfondisce contesto del progetto, funzioni, configurazione, architettura e limiti di utilizzo.
- JSON-LD identifica il sito e il repository open source con licenza MIT senza valutazioni non verificabili.

Imposta `NEXT_PUBLIC_SITE_URL` sull'origine di produzione prima della distribuzione, così che le URL canoniche, della sitemap e delle risorse LLM usino il dominio corretto.

## Struttura del progetto

```text
.
├── app/                     # Pagine Next.js App Router
│   ├── [locale]/           # Rotte internazionalizzate, 15 lingue
│   │   ├── (with-footer)/  # Pagine con piè di pagina
│   │   │   ├── (home)/     # Pagina iniziale
│   │   │   └── (ai-features)/ # Pagine delle funzionalità AIGC
│   │   └── (without-footer)/ # Ingresso AI Canvas, dashboard ed editor
│   ├── api/                # Rotte API: proxy-image, upload
│   ├── robots.ts           # Generazione di robots.txt
│   ├── sitemap.ts          # Generazione della sitemap dinamica
│   ├── llms.txt/           # Mappa sintetica del sito per AI
│   └── llms-full.txt/      # Contesto esteso del progetto per AI
├── components/             # Componenti React riutilizzabili
│   ├── infinite-canvas/    # Editor, dashboard, integrazioni e persistenza locale
│   ├── unified-generator/  # Modulo condiviso per immagini/video e cronologia
│   ├── ui/                 # Componenti in stile shadcn/ui basati su Radix
│   ├── dialog/             # Finestre di dialogo, incluse impostazioni API
│   ├── layout/             # Intestazione, piè di pagina e barra laterale
│   └── ...                 # Componenti specifici delle funzionalità
├── hooks/                  # Hook React personalizzati
├── i18n/                   # Configurazione dell'internazionalizzazione
│   ├── languages.ts        # Lingue supportate
│   ├── request.ts          # Configurazione delle richieste next-intl
│   └── routing.ts          # Routing delle lingue
├── lib/                    # Librerie di utilità
│   ├── seo/                # Metadati, llms.txt e utilità per crawler
│   ├── constants/          # Costanti, modelli per fornitore e navigazione
│   ├── utils/              # Funzioni di utilità
│   └── env.ts              # Utilità per variabili di ambiente
├── messages/               # Una traduzione per ogni lingua
├── network/                # Client API e utilità di rete
│   ├── clientFetch.ts      # Client Flaq.ai con autenticazione
│   ├── image/              # Chiamate API per generazione immagini
│   ├── video/              # Chiamate API per generazione video
│   ├── local-history.ts    # Cronologia locale delle generazioni
│   ├── task-polling.ts     # Controllo condiviso dello stato di generazione
│   └── upload/             # Client per caricamento file Flaq
├── public/                 # File statici: immagini, icone e font
├── store/                  # Store di stato Zustand
├── next.config.mjs         # Configurazione Next.js
├── proxy.ts                # Proxy middleware: i18n e inoltro IP
└── tsconfig.json           # Configurazione TypeScript
```

## Distribuzione

Il modo più semplice per distribuire il template è [Vercel](https://vercel.com):

[![Distribuisci con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Carica il repository su GitHub.
2. Importa il progetto in Vercel.
3. Imposta `NEXT_PUBLIC_SITE_URL` sull'origine di produzione e configura l'email di contatto nelle impostazioni del progetto Vercel.
4. Se usi uno spazio R2 personale, aggiungi le quattro variabili server `R2_*` e configura il dominio pubblico nell'app.
5. Distribuisci!

L'app include rotte server per caricamenti e proxy delle immagini, quindi richiede un ambiente server Next.js. Per ospitarla autonomamente su Node.js, esegui `pnpm build` seguito da `pnpm start`. Esegui separatamente `pnpm ts-check` prima della distribuzione, perché l'attuale configurazione Next.js ignora gli errori TypeScript durante la build.

## Licenza

Il progetto è open source con [licenza MIT](LICENSE).
