# Flaq SaaS Template (Français)

Modèle SaaS gratuit et open source pour créer des plateformes de génération d'images et de vidéos par IA avec l'API [Flaq.ai](https://flaq.ai). Il comprend un créateur commun pour les images et les vidéos, la génération vidéo à partir de références et un canevas IA infini avec gestion locale des projets.

**README :** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Les langues des README correspondent à `i18n/languages.ts` : chaque langue de l'interface dispose de sa présentation du projet.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Premiers pas](#premiers-pas)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Variables d’environnement](#variables-denvironnement)
  - [Envoi de fichiers](#envoi-de-fichiers)
  - [Configuration de la clé API Flaq.ai](#configuration-de-la-clé-api-flaqai)
- [Utilisation](#utilisation)
  - [Développement](#développement)
  - [Compilation](#compilation)
  - [Vérification et formatage](#vérification-et-formatage)
- [Fonctions AIGC](#fonctions-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Programme d’affiliation Flaq.ai](#programme-daffiliation-flaqai)
- [Internationalisation](#internationalisation)
- [SEO et découverte par les robots IA](#seo-et-découverte-par-les-robots-ia)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Licence](#licence)

## Fonctionnalités

- 🎨 **Texte vers image** — Créez des images à partir de descriptions avec des modèles IA de pointe
- 🖼️ **Image vers image** — Transformez vos images en variations créatives au style cohérent
- 🎬 **Texte vers vidéo** — Créez des vidéos de qualité à partir de descriptions simples
- 📹 **Image vers vidéo** — Animez des images fixes pour produire des vidéos dynamiques
- 🧩 **AI Media Creator** — Générez images et vidéos dans un formulaire commun avec des réglages propres à chaque modèle
- 🎞️ **Références vers vidéo** — Utilisez des images, vidéos, fichiers audio, documents ou liens selon le modèle choisi
- 🗂️ **AI Canvas** — Reliez des nœuds de médias et de génération sur un canevas infini, enregistrez vos projets localement et importez ou exportez des archives ZIP
- 👗 **Essayage virtuel** — Essayez virtuellement des vêtements grâce à l'IA
- 🌐 **Internationalisation** — 15 langues alignées sur Flaq.ai, avec routage multilingue et liens SEO alternatifs
- 🚀 **Sans inscription** — Explorez, modifiez et hébergez le modèle sans créer de compte dans l'application
- 🤝 **Affiliation** — Encart responsive pour le programme Flaq.ai, avec textes et liens localisés
- 🔒 **Gestion sécurisée des clés API** — Stockage chiffré des identifiants Flaq.ai côté client
- ☁️ **Envoi de fichiers** — Importez des médias avec votre clé API Flaq ou votre propre stockage Cloudflare R2
- 📱 **Interface responsive** — Interface adaptable conçue avec Tailwind CSS et Radix UI
- 🌓 **Mode sombre** — Thème sombre disponible dès le départ
- ⚡ **Performances** — Next.js 16 avec prise en charge de Turbopack
- 🔍 **Optimisation SEO** — Métadonnées dynamiques, Open Graph, sitemap et données structurées
- 🤖 **Accès des robots IA** — Fichier `llms.txt` organisé, `llms-full.txt` détaillé et accès public aux robots

## Technologies

| Catégorie | Technologie |
| --------- | ----------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Langage | [TypeScript](https://www.typescriptlang.org/) |
| Bibliothèque UI | [React 19](https://react.dev/) |
| Styles | [Tailwind CSS v4](https://tailwindcss.com/) |
| Composants | [Radix UI](https://www.radix-ui.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Formulaires | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Gestion d'état | [Zustand](https://zustand.docs.pmnd.rs/) |
| Récupération des données | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Icônes | [Lucide React](https://lucide.dev/) |
| Graphiques | [Recharts](https://recharts.org/) |
| Gestionnaire de paquets | [pnpm](https://pnpm.io/) |
| Vérification du code | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Premiers pas

### Prérequis

- **Node.js 22**, version indiquée dans `.nvmrc`
- **pnpm 10.5.2**, fixé dans le champ `packageManager` de `package.json`
- Un compte [Flaq.ai](https://flaq.ai/) avec une clé API active

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. Installer pnpm si nécessaire
npm install -g pnpm@10.5.2

# 3. Installer les dépendances
pnpm install

# 4. Copier le modèle de configuration
cp .env.example .env.local
```

### Variables d’environnement

Configurez les variables suivantes dans `.env.local` :

```bash
# URL du site pour les métadonnées, le sitemap et Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Adresse de contact affichée dans le pied de page
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Facultatif : stockage Cloudflare R2 personnel (identifiants côté serveur uniquement)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Envoi de fichiers

Par défaut, les envois utilisent l'URL API et le Client Key configurés dans **Open API Settings**. Pour votre propre stockage Cloudflare R2, définissez `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` et `R2_BUCKET_NAME` sur le serveur, puis renseignez votre domaine public dans **Image Hosting (R2)** et enregistrez. Conservez les identifiants R2 uniquement sur le serveur. Vérifiez la configuration avec **Test R2 Connection**.

Lorsqu'un domaine public est configuré, les envois utilisent d'abord votre stockage R2. Effacez ce domaine et enregistrez pour revenir aux envois Flaq. Les erreurs du stockage personnalisé sont signalées sans basculer vers Flaq.

Pour les envois Flaq, l'application demande des URL via `POST /api/v1/files/presignedUrl`, puis envoie chaque fichier directement avec `PUT`. Chaque requête accepte jusqu'à 10 fichiers ; les sélections plus importantes sont envoyées par lots successifs, par exemple 10 puis 4 pour 14 fichiers. Chaque lot est envoyé dès réception de ses URL, qui expirent après 60 secondes. Les URL publiques retournées servent aux requêtes de génération.

### Configuration de la clé API Flaq.ai

1. Inscrivez-vous ou connectez-vous sur [flaq.ai](https://flaq.ai).
2. Ouvrez le tableau de bord de votre compte.
3. Générez un **Client Key** dans la section des clés API.
4. Copiez votre Client Key.
5. Dans l'application, cliquez sur l'**engrenage** (⚙️) de l'en-tête pour ouvrir **Open API Settings**.
6. Collez votre clé et cliquez sur **Test Connection**.
7. Enregistrez les réglages.

> **💡 Conseil :** « Remember Me » conserve votre clé entre les sessions dans le stockage local chiffré du navigateur. Laissez cette option désactivée sur les appareils partagés ou publics.

> **🔑 Crédits API :** Un solde suffisant est nécessaire pour générer des images et des vidéos. Rechargez-le sur [flaq.ai](https://flaq.ai) si nécessaire.

## Utilisation

### Développement

```bash
# Serveur de développement avec Turbopack pour un HMR plus rapide
pnpm dev:turbo

# Ou commande de développement par défaut
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Compilation

```bash
# Compilation pour la production
pnpm build

# Démarrage du serveur de production
pnpm start
```

### Vérification et formatage

```bash
# Exécuter ESLint
pnpm lint

# Corriger automatiquement les problèmes de lint
pnpm lint:fix

# Formater le code avec Prettier
pnpm prettier

# Vérifier les types TypeScript
pnpm ts-check
```

## Fonctions AIGC

Le modèle associe des pages de génération dédiées, un créateur commun et un canevas infini, grâce à l'API [Flaq.ai](https://flaq.ai).

| Fonction | Route | Description |
| -------- | ----- | ----------- |
| **Texte vers image** | `/text-to-image/` | Générer des images à partir de descriptions |
| **Image vers image** | `/image-to-image/` | Modifier des images avec des instructions et des images de référence |
| **Texte vers vidéo** | `/text-to-video/` | Générer des vidéos à partir de descriptions |
| **Image vers vidéo** | `/image-to-video/` | Générer des vidéos à partir d'images, avec réglage de l'image finale pour les modèles compatibles |
| **Références vers vidéo** | `/reference-to-video/` | Préparer les références puis poursuivre dans AI Media Creator |
| **Essayage virtuel** | `/virtual-try-on/` | Combiner la photo d'une personne et des images de vêtements pour prévisualiser une tenue |
| **AI Media Creator** | `/ai-media-creator/` | Générer images et vidéos dans le même espace et consulter l'historique |
| **AI Canvas** | `/ai-canvas/` | Créer des parcours visuels connectés et gérer les projets du canevas |

Les définitions de modèles se trouvent dans `lib/constants/template-models/`, regroupées par fournisseur et type de média. Les modèles image comprennent notamment Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 et Seedream 5.0. Les modèles vidéo comprennent Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 et Vidu Q3. Les entrées et paramètres disponibles dépendent du modèle sélectionné ; chaque formulaire utilise sa configuration correspondante.

L'essayage virtuel propose sa propre sélection : GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit et Seedream 4.5 Edit.

### AI Media Creator

Dans `/ai-media-creator/`, passez entre génération d'images et de vidéos, choisissez un modèle, ajoutez des entrées et configurez les paramètres pris en charge. La génération à partir de références accepte images, vidéos, audio, documents et liens selon le modèle, avec des mentions de références dans l'éditeur d'instructions.

L'état de génération est interrogé automatiquement et les résultats apparaissent dans l'historique du créateur. Les historiques image et vidéo sont conservés dans le stockage local du navigateur courant.

### AI Canvas

Commencez dans `/ai-canvas/`, gérez les projets enregistrés dans `/ai-canvas/projects/` et ouvrez un projet dans `/ai-canvas/{projectId}/`. Le formulaire d'entrée prépare un projet à partir de vos réglages de génération et de vos données d'entrée.

- Organisez et reliez des nœuds de médias et de génération sur un canevas infini
- Générez images et vidéos avec la connexion API configurée
- Enregistrez les projets localement dans IndexedDB et rouvrez-les depuis le tableau de bord
- Renommez, supprimez, importez et exportez les projets, y compris sous forme d'archives ZIP contenant leurs médias

Les projets sont propres au navigateur courant et à l'origine du site ; aucune synchronisation par compte n'est prévue. Exportez-les pour conserver une copie transférable avant d'effacer les données du navigateur ou de changer d'appareil ou de domaine.

## Programme d’affiliation Flaq.ai

Les pages publiques de présentation et de génération comportent une promotion localisée du [programme d'affiliation Flaq.ai](https://flaq.ai/fr/affiliate-program?utm_source=flaq-saas-template). Le lien ouvre la page Flaq.ai dans la langue correspondante et inclut `utm_source=flaq-saas-template` pour identifier la source.

Selon les conditions actuelles, vous pouvez gagner 20 % sur la première commande payée valide d'un utilisateur recommandé, puis 10 % sur ses commandes payées valides suivantes dans les 60 jours après son inscription. L'éligibilité et les paiements dépendent des conditions publiées sur la page du programme.

## Internationalisation

Le modèle prend en charge **15 langues** : anglais (par défaut), japonais, indonésien, italien, portugais du Brésil, espagnol, allemand, russe, français, chinois simplifié, chinois traditionnel, coréen, thaï, vietnamien et arabe.

- Les traductions se trouvent dans `messages/`, avec un fichier JSON par langue.
- La langue est détectée via l'en-tête `Accept-Language` du navigateur.
- Elle peut être modifiée dans le pied de page ou dans la boîte de dialogue des langues.
- Les URL utilisent `/` pour l'anglais et `/{locale}/` pour les autres langues, par exemple `/ja/` ou `/zh/`.
- Les pages arabes utilisent automatiquement le sens de lecture de droite à gauche.

Pour ajouter une langue :

1. Ajoutez-la dans `i18n/languages.ts`.
2. Créez sa traduction dans `messages/`.
3. Traduisez les textes des pages et `Metadata` selon la structure de clés existante.

## SEO et découverte par les robots IA

Les pages publiques de présentation et de génération utilisent des titres et descriptions localisés, une URL canonique absolue, des variantes `hreflang` pour 15 langues, les métadonnées Open Graph, une carte Twitter et les directives index/follow. Le fichier `/sitemap.xml` généré inclut l'accueil, les fonctionnalités et les pages de politiques dans chaque langue avec leurs variantes. Les URL des projets locaux individuels du canevas en sont exclues.

- `/robots.txt` autorise les moteurs de recherche et assistants IA à explorer le contenu public et bloque les routes API et de rappel.
- `/llms.txt` décrit de façon concise le produit, les pages, les langues, la documentation et les politiques.
- `/llms-full.txt` détaille le contexte du projet, ses fonctions, sa configuration, son architecture et ses limites d'utilisation.
- JSON-LD identifie le site et le dépôt open source sous licence MIT, sans évaluations invérifiables.

Avant le déploiement, définissez `NEXT_PUBLIC_SITE_URL` sur l'origine de production afin que les URL canoniques, du sitemap et des ressources LLM utilisent le bon domaine.

## Structure du projet

```text
.
├── app/                     # Pages Next.js App Router
│   ├── [locale]/           # Routes internationalisées, 15 langues
│   │   ├── (with-footer)/  # Pages avec pied de page
│   │   │   ├── (home)/     # Page d'accueil
│   │   │   └── (ai-features)/ # Pages des fonctions AIGC
│   │   └── (without-footer)/ # Accueil AI Canvas, tableau de bord et éditeur
│   ├── api/                # Routes API : proxy-image, upload
│   ├── robots.ts           # Génération de robots.txt
│   ├── sitemap.ts          # Génération du sitemap dynamique
│   ├── llms.txt/           # Carte concise du site pour l'IA
│   └── llms-full.txt/      # Contexte détaillé du projet pour l'IA
├── components/             # Composants React réutilisables
│   ├── infinite-canvas/    # Éditeur, tableau de bord, intégrations et stockage local
│   ├── unified-generator/  # Formulaire image/vidéo commun et historique
│   ├── ui/                 # Composants de style shadcn/ui basés sur Radix
│   ├── dialog/             # Dialogues, notamment les réglages API
│   ├── layout/             # En-tête, pied de page et barre latérale
│   └── ...                 # Composants propres aux fonctionnalités
├── hooks/                  # Hooks React personnalisés
├── i18n/                   # Configuration de l'internationalisation
│   ├── languages.ts        # Langues prises en charge
│   ├── request.ts          # Configuration des requêtes next-intl
│   └── routing.ts          # Routage des langues
├── lib/                    # Bibliothèques utilitaires
│   ├── seo/                # Métadonnées, llms.txt et outils pour les robots
│   ├── constants/          # Constantes, modèles par fournisseur et navigation
│   ├── utils/              # Fonctions utilitaires
│   └── env.ts              # Outils pour les variables d'environnement
├── messages/               # Une traduction par langue
├── network/                # Client API et outils réseau
│   ├── clientFetch.ts      # Client API Flaq.ai avec authentification
│   ├── image/              # Appels API de génération d'images
│   ├── video/              # Appels API de génération de vidéos
│   ├── local-history.ts    # Historique local des générations
│   ├── task-polling.ts     # Interrogation commune de l'état des générations
│   └── upload/             # Client d'envoi de fichiers Flaq
├── public/                 # Fichiers statiques : images, icônes et polices
├── store/                  # États Zustand
├── next.config.mjs         # Configuration Next.js
├── proxy.ts                # Proxy middleware : i18n et transmission d'IP
└── tsconfig.json           # Configuration TypeScript
```

## Déploiement

La solution la plus simple est [Vercel](https://vercel.com) :

[![Déployer sur Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Envoyez le dépôt sur GitHub.
2. Importez le projet dans Vercel.
3. Définissez `NEXT_PUBLIC_SITE_URL` sur l'origine de production et configurez l'adresse de contact dans les réglages du projet Vercel.
4. Pour votre propre stockage R2, ajoutez les quatre variables serveur `R2_*` et configurez le domaine public dans l'application.
5. Déployez !

L'application possède des routes serveur pour les envois et le proxy d'images ; elle nécessite donc un environnement serveur Next.js. Pour un hébergement Node.js autonome, exécutez `pnpm build` puis `pnpm start`. Lancez séparément `pnpm ts-check` avant le déploiement, car la configuration Next.js actuelle ignore les erreurs TypeScript pendant la compilation.

## Licence

Ce projet est open source sous [licence MIT](LICENSE).
