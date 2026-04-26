# Flaq SaaS Template

Free and open-source SaaS template for building AI-powered image and video generation platforms using
[Flaq.ai](https://flaq.ai) API. Start your AIGC business instantly.

---

**中文版本请参阅：[中文说明](./README_zh.md)**

---

## Table of Contents

- [Flaq SaaS Template](#flaq-saas-template)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Cloudflare R2 Storage Setup](#cloudflare-r2-storage-setup)
    - [Flaq.ai API Key Setup](#flaqai-api-key-setup)
  - [Usage](#usage)
    - [Development](#development)
    - [Build](#build)
    - [Lint \& Format](#lint--format)
  - [AIGC Capabilities](#aigc-capabilities)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Project Structure](#project-structure)
  - [Deployment](#deployment)
  - [License](#license)

## Features

- 🎨 **Text-to-Image** — Generate stunning images from text prompts using state-of-the-art AI models
- 🖼️ **Image-to-Image** — Transform existing images into creative variations with consistent style
- 🎬 **Text-to-Video** — Create high-quality videos from simple text descriptions
- 📹 **Image-to-Video** — Animate static images into dynamic video content
- 👗 **Virtual Try-On** — AI-powered virtual clothing try-on experience
- 🌐 **Internationalization** — Built-in support for English and Simplified Chinese (中文)
- 🔒 **Secure API Key Management** — Encrypted client-side storage for your Flaq.ai credentials
- ☁️ **Cloudflare R2 Storage** — Built-in image hosting with Cloudflare's global CDN
- 📱 **Responsive Design** — Fully responsive UI built with Tailwind CSS and Radix UI
- 🌓 **Dark Mode** — Beautiful dark-themed UI out of the box
- ⚡ **Fast Performance** — Powered by Next.js 16 with Turbopack support
- 🔍 **SEO Optimized** — Dynamic metadata, Open Graph, sitemap, and structured data

## Tech Stack

| Category          | Technology                                                                |
| ----------------- | ------------------------------------------------------------------------- |
| Framework         | [Next.js 16](https://nextjs.org/) (App Router)                            |
| Language          | [TypeScript](https://www.typescriptlang.org/)                             |
| UI Library        | [React 19](https://react.dev/)                                            |
| Styling           | [Tailwind CSS v4](https://tailwindcss.com/)                               |
| Component Library | [Radix UI](https://www.radix-ui.com/)                                     |
| Animations        | [Framer Motion](https://www.framer.com/motion/)                           |
| Forms             | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| State Management  | [Zustand](https://zustand.docs.pmnd.rs/)                                  |
| Data Fetching     | [SWR](https://swr.vercel.app/)                                            |
| i18n              | [next-intl](https://next-intl-docs.vercel.app/)                           |
| Icons             | [Lucide React](https://lucide.dev/)                                       |
| Charts            | [Recharts](https://recharts.org/)                                         |
| Package Manager   | [pnpm](https://pnpm.io/)                                                  |
| Linting           | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)          |

## Getting Started

### Prerequisites

- **Node.js** >= 18.x (check `.nvmrc` for the recommended version)
- **pnpm** >= 10.x (the project uses `packageManager` field in `package.json`)
- A [Flaq.ai](https://flaq.ai/) account with an active API key
- A [Cloudflare](https://cloudflare.com) account (for R2 image storage)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/flaq-saas-template.git
cd flaq-saas-template

# 2. Install pnpm if you haven't already
npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Copy the environment template
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` and configure the following variables:

```bash
# Your site URL (used for metadata, sitemap, and Open Graph)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Contact email displayed in the footer
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Cloudflare R2 Storage Configuration (server-side only)
# Get these from Cloudflare Dashboard > R2 > Manage R2 API Tokens
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
```

> **⚠️ Important**: Never expose `R2_SECRET_ACCESS_KEY` to the client. The R2 credentials are server-side only.

### Cloudflare R2 Storage Setup

This template uses Cloudflare R2 for storing user-uploaded images and generated assets. Follow these steps:

1. **Log in** to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Navigate** to **R2** in the sidebar
3. **Create a bucket** (e.g., `flaq-ai-saas`)
4. **Generate API Tokens**:
   - Go to **Manage R2 API Tokens**
   - Create a new API token with **Object Read & Write** permissions
   - Save the **Access Key ID** and **Secret Access Key** securely
5. **Configure Public Access**:
   - In your R2 bucket settings, enable **Public Access** via a custom domain or `r2.dev` subdomain
   - Note down the **Public Domain** URL (e.g., `https://your-bucket.your-account.r2.cloudflarestorage.com`)
6. **Set environment variables** in `.env.local` (see above)
7. **Configure the public domain** in the app's **Open API Settings** dialog (gear icon in the header)

After setup, use the **Test R2 Connection** button in the settings dialog to verify your configuration.

### Flaq.ai API Key Setup

1. **Register/Sign in** at [flaq.ai](https://flaq.ai)
2. **Navigate** to your account dashboard
3. **Generate a Client Key** from the API Keys section
4. **Copy** your Client Key
5. **Open** the app and click the **gear icon** (⚙️) in the header to open the **Open API Settings** dialog
6. **Paste** your Client Key and click **Test Connection** to verify
7. **Save** the settings

> **💡 Tip**: Enable "Remember Me" to securely persist your API key across sessions. The key is stored using encrypted
> local storage. For shared or public devices, leave this option unchecked for maximum security.

> **🔑 API Credits**: You need sufficient API credits to generate images and videos. Top up your balance at
> [flaq.ai](https://flaq.ai) if needed.

## Usage

### Development

```bash
# Start the development server (with Turbopack for faster HMR)
pnpm dev:turbo

# Or start without Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Production build
pnpm build

# Build with bundle analysis
pnpm build:analyze

# Start production server
pnpm start
```

### Lint & Format

```bash
# Run ESLint
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format code with Prettier
pnpm prettier

# TypeScript type checking
pnpm ts-check
```

## AIGC Capabilities

This template comes with five fully functional AI generation tools, all powered by [Flaq.ai](https://flaq.ai) API:

| Capability         | Description                                                                               | Supported Models                                                             |
| ------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Text-to-Image**  | Generate images from natural language prompts                                             | Nano Banana Pro, Seedream 5.0, GPT Image 2, Qwen Image 2.0, Grok Imagine     |
| **Image-to-Image** | Transform or enhance existing images with AI, maintaining style and composition           | Nano Banana Pro Edit, Seedream 5.0 Edit, GPT Image 2 Edit, Grok Imagine Edit |
| **Text-to-Video**  | Create videos from text descriptions with advanced motion synthesis                       | Veo 3.1, Wan 2.7, Kling 3.0, Seedance 2.0, Vidu Q3                           |
| **Image-to-Video** | Animate static images into dynamic videos                                                 | Veo 3.1, Wan 2.7, Kling 3.0, Seedance 2.0, Vidu Q3                           |
| **Virtual Try-On** | AI-powered virtual clothing try-on — upload a garment and a model photo to see the result | GPT Image 2 Edit, Nano Banana Pro Edit                                       |

Each tool includes:

- Pre-configured form with model selection and parameter controls
- Real-time generation status polling
- Result gallery with download and share options
- History of previously generated assets

## Internationalization (i18n)

This template supports **English** (default) and **Simplified Chinese (中文)** out of the box.

- Translation files are located in the `messages/` directory (`en.json`, `zh.json`)
- Locale is auto-detected from the browser's `Accept-Language` header
- Users can manually switch languages via the footer or the language dialog
- URL structure: `/` for English, `/zh/` for Chinese

To add more languages:

1. Add the locale to `i18n/languages.ts`
2. Create a new translation file in `messages/`
3. Add any new language-specific metadata in the layout files

## Project Structure

```
.
├── app/                     # Next.js App Router pages
│   ├── [locale]/           # Internationalized routes (en, zh)
│   │   ├── (with-footer)/  # Pages with footer layout
│   │   │   ├── (home)/     # Landing page
│   │   │   └── (ai-features)/ # AIGC feature pages
│   │   └── (without-footer)/ # Full-screen pages (e.g., +page)
│   ├── api/                # API routes (proxy-image, upload)
│   ├── robots.ts           # Robots.txt generation
│   └── sitemap.ts          # Dynamic sitemap generation
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui-style components (Radix-based)
│   ├── dialog/             # Dialog components (API settings, etc.)
│   ├── layout/             # Layout components (header, footer, sidebar)
│   └── ...                 # Feature-specific components
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization configuration
│   ├── languages.ts        # Supported locales definition
│   ├── request.ts          # next-intl request configuration
│   └── routing.ts          # Locale routing configuration
├── lib/                    # Utility libraries
│   ├── constants/          # App constants, model configs, navigation
│   ├── utils/              # Utility functions
│   └── env.ts              # Environment variable helpers
├── messages/               # Translation files (en.json, zh.json)
├── network/                # API client and network utilities
│   ├── clientFetch.ts      # Flaq.ai API client with auth
│   ├── image/              # Image generation API calls
│   ├── video/              # Video generation API calls
│   └── upload/             # R2 upload client
├── public/                 # Static assets (images, icons, fonts)
├── store/                  # Zustand state stores
├── next.config.mjs         # Next.js configuration
├── proxy.ts                # Middleware proxy (i18n + IP forwarding)
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Deployment

The easiest way to deploy this template is via [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/flaq-saas-template)

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add all environment variables (`R2_*`, `NEXT_PUBLIC_*`) in Vercel's project settings
4. Deploy!

> The template also works on any platform that supports Next.js (Netlify, Cloudflare Pages, Docker, etc.).

## License

This project is open-source under the [MIT License](LICENSE).
