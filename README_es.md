# Flaq SaaS Template (Español)

Plantilla SaaS gratuita y de código abierto para crear plataformas de generación de imágenes y vídeo con IA mediante la API de [Flaq.ai](https://flaq.ai). Incluye un creador unificado de imágenes y vídeos, generación de vídeo a partir de referencias y un lienzo de IA infinito con gestión local de proyectos.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Los idiomas de los README corresponden a `i18n/languages.ts`: cada idioma de la interfaz tiene una presentación del proyecto.

## Índice

- [Funciones](#funciones)
- [Tecnologías](#tecnologías)
- [Primeros pasos](#primeros-pasos)
  - [Requisitos](#requisitos)
  - [Instalación](#instalación)
  - [Variables de entorno](#variables-de-entorno)
  - [Carga de archivos](#carga-de-archivos)
  - [Configuración de la clave API de Flaq.ai](#configuración-de-la-clave-api-de-flaqai)
- [Uso](#uso)
  - [Desarrollo](#desarrollo)
  - [Compilación](#compilación)
  - [Revisión y formato](#revisión-y-formato)
- [Funciones AIGC](#funciones-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Programa de afiliados de Flaq.ai](#programa-de-afiliados-de-flaqai)
- [Internacionalización](#internacionalización)
- [SEO y descubrimiento por rastreadores de IA](#seo-y-descubrimiento-por-rastreadores-de-ia)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

## Funciones

- 🎨 **Texto a imagen** — Genera imágenes a partir de descripciones con modelos de IA avanzados
- 🖼️ **Imagen a imagen** — Transforma imágenes existentes en variaciones creativas con un estilo coherente
- 🎬 **Texto a vídeo** — Crea vídeos de alta calidad a partir de descripciones sencillas
- 📹 **Imagen a vídeo** — Anima imágenes estáticas para crear vídeos dinámicos
- 🧩 **AI Media Creator** — Genera imágenes y vídeos desde un formulario compartido con controles específicos del modelo
- 🎞️ **Referencias a vídeo** — Utiliza imágenes, vídeos, audio, documentos o enlaces según el modelo seleccionado
- 🗂️ **AI Canvas** — Conecta nodos de medios y generación en un lienzo infinito, guarda proyectos locales e importa o exporta archivos ZIP
- 👗 **Prueba virtual de ropa** — Prueba prendas de forma virtual con IA
- 🌐 **Internacionalización** — 15 idiomas alineados con Flaq.ai, con rutas por idioma y enlaces SEO alternativos
- 🚀 **Sin registro** — Explora, modifica y aloja la plantilla sin crear una cuenta en la aplicación
- 🤝 **Afiliación** — Promoción adaptable del programa de Flaq.ai con textos y enlaces localizados
- 🔒 **Gestión segura de claves API** — Almacenamiento cifrado de las credenciales Flaq.ai en el cliente
- ☁️ **Carga de archivos** — Sube medios con tu clave API de Flaq o tu propio almacenamiento Cloudflare R2
- 📱 **Diseño adaptable** — Interfaz responsive con Tailwind CSS y Radix UI
- 🌓 **Modo oscuro** — Tema oscuro incluido
- ⚡ **Rendimiento** — Next.js 16 con soporte para Turbopack
- 🔍 **Optimización SEO** — Metadatos dinámicos, Open Graph, sitemap y datos estructurados
- 🤖 **Preparada para rastreadores de IA** — `llms.txt` organizado, `llms-full.txt` ampliado y acceso público para rastreadores

## Tecnologías

| Categoría | Tecnología |
| --------- | ---------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) |
| Biblioteca de interfaz | [React 19](https://react.dev/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Componentes | [Radix UI](https://www.radix-ui.com/) |
| Animaciones | [Framer Motion](https://www.framer.com/motion/) |
| Formularios | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Gestión de estado | [Zustand](https://zustand.docs.pmnd.rs/) |
| Obtención de datos | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Iconos | [Lucide React](https://lucide.dev/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Gestor de paquetes | [pnpm](https://pnpm.io/) |
| Revisión de código | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Primeros pasos

### Requisitos

- **Node.js 22**, versión indicada en `.nvmrc`
- **pnpm 10.5.2**, fijado en el campo `packageManager` de `package.json`
- Una cuenta de [Flaq.ai](https://flaq.ai/) con una clave API activa

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. Instala pnpm si aún no lo tienes
npm install -g pnpm@10.5.2

# 3. Instala las dependencias
pnpm install

# 4. Copia la plantilla de entorno
cp .env.example .env.local
```

### Variables de entorno

Configura estas variables en `.env.local`:

```bash
# URL del sitio para metadatos, sitemap y Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Correo de contacto del pie de página
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Opcional: almacenamiento Cloudflare R2 propio (credenciales solo en el servidor)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Carga de archivos

Por defecto, las cargas utilizan la URL de la API y el Client Key configurados en **Open API Settings**. Para usar tu propio almacenamiento Cloudflare R2, configura `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` y `R2_BUCKET_NAME` en el servidor; después introduce el dominio público en **Image Hosting (R2)** y guarda. Conserva las credenciales R2 únicamente en el servidor. Comprueba la configuración con **Test R2 Connection**.

Cuando hay un dominio público configurado, las cargas utilizan primero tu almacenamiento R2. Borra el dominio y guarda para volver a las cargas de Flaq. Los errores del almacenamiento propio se muestran sin cambiar automáticamente a Flaq.

Para las cargas de Flaq, la aplicación solicita URL mediante `POST /api/v1/files/presignedUrl` y sube cada archivo directamente con `PUT`. Cada petición admite hasta 10 archivos; las selecciones mayores se envían en lotes sucesivos, por ejemplo 10 y 4 para 14 archivos. Cada lote se carga inmediatamente tras recibir sus URL, que caducan a los 60 segundos. Las URL públicas obtenidas se utilizan en las peticiones de generación.

### Configuración de la clave API de Flaq.ai

1. Regístrate o inicia sesión en [flaq.ai](https://flaq.ai).
2. Abre el panel de tu cuenta.
3. Genera un **Client Key** en la sección de claves API.
4. Copia tu Client Key.
5. En la aplicación, pulsa el **engranaje** (⚙️) de la cabecera para abrir **Open API Settings**.
6. Pega la clave y pulsa **Test Connection**.
7. Guarda los ajustes.

> **💡 Consejo:** «Remember Me» conserva la clave cifrada en el almacenamiento local del navegador entre sesiones. Mantén esta opción desactivada en dispositivos compartidos o públicos.

> **🔑 Créditos API:** Necesitas suficientes créditos para generar imágenes y vídeos. Recarga tu saldo en [flaq.ai](https://flaq.ai) cuando sea necesario.

## Uso

### Desarrollo

```bash
# Inicia el servidor de desarrollo con Turbopack para un HMR más rápido
pnpm dev:turbo

# O usa el comando de desarrollo predeterminado
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Compilación

```bash
# Compila para producción
pnpm build

# Inicia el servidor de producción
pnpm start
```

### Revisión y formato

```bash
# Ejecuta ESLint
pnpm lint

# Corrige automáticamente los problemas de lint
pnpm lint:fix

# Formatea el código con Prettier
pnpm prettier

# Comprueba los tipos de TypeScript
pnpm ts-check
```

## Funciones AIGC

La plantilla combina páginas de generación dedicadas, un creador compartido y un lienzo infinito mediante la API de [Flaq.ai](https://flaq.ai).

| Función | Ruta | Descripción |
| ------- | ---- | ----------- |
| **Texto a imagen** | `/text-to-image/` | Genera imágenes a partir de descripciones |
| **Imagen a imagen** | `/image-to-image/` | Edita imágenes mediante instrucciones e imágenes de referencia |
| **Texto a vídeo** | `/text-to-video/` | Genera vídeos a partir de descripciones |
| **Imagen a vídeo** | `/image-to-video/` | Genera vídeos desde imágenes, con control del fotograma final en modelos compatibles |
| **Referencias a vídeo** | `/reference-to-video/` | Prepara las referencias y continúa la generación en AI Media Creator |
| **Prueba virtual de ropa** | `/virtual-try-on/` | Combina una foto de una persona con imágenes de prendas para visualizar un conjunto |
| **AI Media Creator** | `/ai-media-creator/` | Genera imágenes y vídeos en un mismo espacio y consulta el historial |
| **AI Canvas** | `/ai-canvas/` | Crea flujos visuales conectados y gestiona proyectos del lienzo |

Las definiciones de modelos están en `lib/constants/template-models/`, agrupadas por proveedor y tipo de medio. Entre los modelos de imagen están Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 y Seedream 5.0. Entre los modelos de vídeo están Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 y Vidu Q3. Las entradas y los parámetros disponibles dependen del modelo seleccionado; cada formulario usa su configuración correspondiente.

La prueba virtual de ropa tiene su propia selección: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit y Seedream 4.5 Edit.

### AI Media Creator

Usa `/ai-media-creator/` para alternar entre imágenes y vídeos, elegir un modelo, añadir entradas y configurar los parámetros compatibles. La generación desde referencias admite imágenes, vídeos, audio, documentos y enlaces cuando el modelo lo permite, con menciones a las referencias en el editor de instrucciones.

El estado de generación se consulta automáticamente y los resultados aparecen en el historial del creador. El historial de imágenes y vídeos se guarda en el almacenamiento local del navegador actual.

### AI Canvas

Empieza en `/ai-canvas/`, gestiona los proyectos guardados en `/ai-canvas/projects/` y abre un proyecto en `/ai-canvas/{projectId}/`. El formulario de entrada prepara un proyecto con los ajustes de generación y las entradas seleccionadas.

- Organiza y conecta nodos de medios y generación en un lienzo infinito
- Genera imágenes y vídeos con la conexión API configurada
- Guarda proyectos localmente en IndexedDB y vuelve a abrirlos desde el panel de proyectos
- Renombra, elimina, importa y exporta proyectos, incluidos archivos ZIP con sus medios

Los proyectos pertenecen al navegador actual y al origen del sitio; no existe sincronización mediante cuentas. Exporta los proyectos para conservar una copia transferible antes de borrar los datos del navegador o cambiar de dispositivo o dominio.

## Programa de afiliados de Flaq.ai

Las páginas públicas de presentación y generación incluyen una promoción localizada del [Programa de afiliados de Flaq.ai](https://flaq.ai/es/affiliate-program?utm_source=flaq-saas-template). El enlace abre la página de Flaq.ai en el idioma correspondiente e incluye `utm_source=flaq-saas-template` para atribuir el origen.

Según las condiciones actuales, puedes ganar un 20% por el primer pedido válido de pago de un usuario referido y un 10% por sus siguientes pedidos válidos de pago durante los 60 días posteriores al registro. La elegibilidad y los pagos se rigen por los términos publicados en la página del programa.

## Internacionalización

La plantilla admite **15 idiomas**: inglés (predeterminado), japonés, indonesio, italiano, portugués de Brasil, español, alemán, ruso, francés, chino simplificado, chino tradicional, coreano, tailandés, vietnamita y árabe.

- Las traducciones están en `messages/`, un archivo JSON por idioma.
- El idioma se detecta mediante la cabecera `Accept-Language` del navegador.
- Puede cambiarse desde el pie de página o el diálogo de idiomas.
- Las URL usan `/` para inglés y `/{locale}/` para otros idiomas, por ejemplo `/ja/` o `/zh/`.
- Las páginas en árabe usan automáticamente la dirección de derecha a izquierda.

Para añadir idiomas:

1. Añade el idioma a `i18n/languages.ts`.
2. Crea un archivo de traducción en `messages/`.
3. Traduce los textos de las páginas y `Metadata` con la estructura de claves existente.

## SEO y descubrimiento por rastreadores de IA

Las páginas públicas de presentación y generación usan títulos y descripciones localizados, una URL canónica absoluta, alternativas `hreflang` en 15 idiomas, metadatos Open Graph, una tarjeta de Twitter y directivas index/follow. El `/sitemap.xml` generado incluye la página de inicio, las funciones y las políticas en cada idioma con sus alternativas. No incluye URL de proyectos locales individuales del lienzo.

- `/robots.txt` permite rastrear contenido público a buscadores y asistentes de IA, y bloquea las rutas API y de callback.
- `/llms.txt` presenta un mapa estructurado y conciso del producto, las páginas, los idiomas, la documentación y las políticas.
- `/llms-full.txt` amplía el contexto del proyecto, las funciones, la configuración, la arquitectura y los límites de uso.
- JSON-LD identifica el sitio y el repositorio de código abierto bajo MIT sin valoraciones no verificables.

Configura `NEXT_PUBLIC_SITE_URL` con el origen de producción antes de desplegar para que las URL canónicas, del sitemap y de los recursos LLM utilicen el dominio correcto.

## Estructura del proyecto

```text
.
├── app/                     # Páginas de Next.js App Router
│   ├── [locale]/           # Rutas internacionalizadas, 15 idiomas
│   │   ├── (with-footer)/  # Páginas con pie de página
│   │   │   ├── (home)/     # Página de inicio
│   │   │   └── (ai-features)/ # Páginas de funciones AIGC
│   │   └── (without-footer)/ # Inicio de AI Canvas, panel de proyectos y editor
│   ├── api/                # Rutas API: proxy-image, upload
│   ├── robots.ts           # Generación de robots.txt
│   ├── sitemap.ts          # Generación del sitemap dinámico
│   ├── llms.txt/           # Mapa conciso del sitio para IA
│   └── llms-full.txt/      # Contexto ampliado del proyecto para IA
├── components/             # Componentes React reutilizables
│   ├── infinite-canvas/    # Editor, panel, integraciones y persistencia local
│   ├── unified-generator/  # Formulario común de imagen/vídeo e historial
│   ├── ui/                 # Componentes de estilo shadcn/ui basados en Radix
│   ├── dialog/             # Diálogos, incluidos los ajustes de API
│   ├── layout/             # Cabecera, pie de página y barra lateral
│   └── ...                 # Componentes específicos de cada función
├── hooks/                  # Hooks React personalizados
├── i18n/                   # Configuración de internacionalización
│   ├── languages.ts        # Idiomas compatibles
│   ├── request.ts          # Configuración de solicitudes next-intl
│   └── routing.ts          # Rutas por idioma
├── lib/                    # Bibliotecas de utilidades
│   ├── seo/                # Metadatos, llms.txt y utilidades de rastreo
│   ├── constants/          # Constantes, modelos por proveedor y navegación
│   ├── utils/              # Funciones auxiliares
│   └── env.ts              # Utilidades para variables de entorno
├── messages/               # Un archivo de traducción por idioma
├── network/                # Cliente API y utilidades de red
│   ├── clientFetch.ts      # Cliente Flaq.ai con autenticación
│   ├── image/              # Llamadas API de generación de imágenes
│   ├── video/              # Llamadas API de generación de vídeos
│   ├── local-history.ts    # Historial de generación local del navegador
│   ├── task-polling.ts     # Consulta compartida del estado de generación
│   └── upload/             # Cliente de carga de archivos de Flaq
├── public/                 # Archivos estáticos: imágenes, iconos y fuentes
├── store/                  # Almacenes de estado Zustand
├── next.config.mjs         # Configuración Next.js
├── proxy.ts                # Proxy middleware: i18n y reenvío de IP
└── tsconfig.json           # Configuración TypeScript
```

## Despliegue

La forma más sencilla de desplegar la plantilla es con [Vercel](https://vercel.com):

[![Desplegar con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura `NEXT_PUBLIC_SITE_URL` con el origen de producción y el correo de contacto en los ajustes del proyecto en Vercel.
4. Si usas R2 propio, añade las cuatro variables de servidor `R2_*` y configura el dominio público en la aplicación.
5. ¡Despliega!

La aplicación incluye rutas de servidor para cargas y proxy de imágenes, por lo que necesita un entorno de servidor Next.js. Para alojarla en Node.js, ejecuta `pnpm build` y después `pnpm start`. Ejecuta `pnpm ts-check` por separado antes del despliegue, ya que la configuración actual de Next.js omite los errores TypeScript durante la compilación.

## Licencia

Este proyecto es de código abierto bajo la [licencia MIT](LICENSE).
