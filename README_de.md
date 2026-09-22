# Flaq SaaS Template (Deutsch)

Kostenlose Open-Source-SaaS-Vorlage zum Aufbau von Plattformen für KI-Bild- und Videogenerierung mit der [Flaq.ai](https://flaq.ai) API. Enthält einen gemeinsamen Bild- und Video-Creator, Abläufe zur Generierung aus Referenzen und eine unendliche KI-Leinwand mit lokaler Projektverwaltung.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Die README-Sprachen entsprechen `i18n/languages.ts`; für jede Oberflächensprache gibt es eine Projektvorstellung.

## Inhaltsverzeichnis

- [Funktionen](#funktionen)
- [Technologien](#technologien)
- [Erste Schritte](#erste-schritte)
  - [Voraussetzungen](#voraussetzungen)
  - [Installation](#installation)
  - [Umgebungsvariablen](#umgebungsvariablen)
  - [Datei-Uploads](#datei-uploads)
  - [Flaq.ai-API-Schlüssel einrichten](#flaqai-api-schlüssel-einrichten)
- [Verwendung](#verwendung)
  - [Entwicklung](#entwicklung)
  - [Build](#build)
  - [Linting und Formatierung](#linting-und-formatierung)
- [AIGC-Funktionen](#aigc-funktionen)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Flaq.ai-Partnerprogramm](#flaqai-partnerprogramm)
- [Internationalisierung](#internationalisierung)
- [SEO und Auffindbarkeit für KI-Crawler](#seo-und-auffindbarkeit-für-ki-crawler)
- [Projektstruktur](#projektstruktur)
- [Bereitstellung](#bereitstellung)
- [Lizenz](#lizenz)

## Funktionen

- 🎨 **Text-zu-Bild** — Bilder aus Textbeschreibungen mit modernen KI-Modellen generieren
- 🖼️ **Bild-zu-Bild** — Vorhandene Bilder in kreative Varianten mit konsistentem Stil verwandeln
- 🎬 **Text-zu-Video** — Hochwertige Videos aus einfachen Textbeschreibungen erstellen
- 📹 **Bild-zu-Video** — Statische Bilder in dynamische Videos verwandeln
- 🧩 **AI Media Creator** — Bilder und Videos über ein gemeinsames Formular mit modellspezifischen Einstellungen generieren
- 🎞️ **Referenz-zu-Video** — Je nach Modell Bilder, Videos, Audio, Dokumente oder Links als Referenzen verwenden
- 🗂️ **AI Canvas** — Medien- und Generierungsknoten auf einer unendlichen Leinwand verbinden, Projekte lokal speichern und ZIP-Archive importieren oder exportieren
- 👗 **Virtuelle Anprobe** — Kleidung mithilfe von KI virtuell anprobieren
- 🌐 **Internationalisierung** — 15 mit Flaq.ai abgestimmte Sprachen mit sprachabhängigen Routen und alternativen SEO-Links
- 🚀 **Keine Registrierung erforderlich** — Die Vorlage ohne App-Konto erkunden, anpassen und selbst hosten
- 🤝 **Partnerprogramm** — Responsiver Hinweis auf das Flaq.ai-Partnerprogramm mit übersetzten Texten und Zielseiten
- 🔒 **Sichere API-Schlüsselverwaltung** — Verschlüsselte clientseitige Speicherung der Flaq.ai-Zugangsdaten
- ☁️ **Datei-Uploads** — Medien über den Flaq-API-Schlüssel oder eigenen Cloudflare-R2-Speicher hochladen
- 📱 **Responsives Design** — Anpassungsfähige Oberfläche mit Tailwind CSS und Radix UI
- 🌓 **Dark Mode** — Dunkles Design ab Werk
- ⚡ **Hohe Geschwindigkeit** — Next.js 16 mit Turbopack-Unterstützung
- 🔍 **SEO-Optimierung** — Dynamische Metadaten, Open Graph, Sitemap und strukturierte Daten
- 🤖 **Für KI-Crawler vorbereitet** — Kuratiertes `llms.txt`, ausführliches `llms-full.txt` und öffentlicher Crawler-Zugriff

## Technologien

| Kategorie | Technologie |
| --------- | ----------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Sprache | [TypeScript](https://www.typescriptlang.org/) |
| UI-Bibliothek | [React 19](https://react.dev/) |
| Gestaltung | [Tailwind CSS v4](https://tailwindcss.com/) |
| Komponenten | [Radix UI](https://www.radix-ui.com/) |
| Animationen | [Framer Motion](https://www.framer.com/motion/) |
| Formulare | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Zustandsverwaltung | [Zustand](https://zustand.docs.pmnd.rs/) |
| Datenabruf | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Symbole | [Lucide React](https://lucide.dev/) |
| Diagramme | [Recharts](https://recharts.org/) |
| Paketmanager | [pnpm](https://pnpm.io/) |
| Codeprüfung | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Erste Schritte

### Voraussetzungen

- **Node.js 22** gemäß `.nvmrc`
- **pnpm 10.5.2**, im Feld `packageManager` von `package.json` festgelegt
- Ein [Flaq.ai](https://flaq.ai/)-Konto mit aktivem API-Schlüssel

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. pnpm installieren, falls noch nicht vorhanden
npm install -g pnpm@10.5.2

# 3. Abhängigkeiten installieren
pnpm install

# 4. Vorlage für Umgebungsvariablen kopieren
cp .env.example .env.local
```

### Umgebungsvariablen

Konfiguriere folgende Variablen in `.env.local`:

```bash
# Website-URL für Metadaten, Sitemap und Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Kontaktadresse im Footer
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# Optional: eigener Cloudflare-R2-Speicher (Zugangsdaten ausschließlich serverseitig)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Datei-Uploads

Standardmäßig verwenden Uploads die API-URL und den Client Key aus den **Open API Settings**. Für eigenen Cloudflare-R2-Speicher setze `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` und `R2_BUCKET_NAME` auf dem Server. Trage dann die öffentliche Domain unter **Image Hosting (R2)** im Einstellungsdialog ein und speichere. R2-Zugangsdaten bleiben ausschließlich auf dem Server. Prüfe die Konfiguration mit **Test R2 Connection**.

Wenn eine öffentliche Domain konfiguriert ist, verwenden Uploads zuerst deinen R2-Speicher. Entferne die Domain und speichere, um wieder Flaq-Uploads zu verwenden. Fehler des eigenen Speichers werden angezeigt, ohne automatisch zu Flaq-Uploads zu wechseln.

Für Flaq-Uploads fordert die App Upload-URLs über `POST /api/v1/files/presignedUrl` an und lädt jede Datei direkt per `PUT` hoch. Eine Anfrage unterstützt bis zu 10 Dateien; größere Auswahlen werden nacheinander in Gruppen hochgeladen, etwa 14 Dateien in Gruppen von 10 und 4. Jede Gruppe wird unmittelbar nach Erhalt der URLs hochgeladen, da diese nach 60 Sekunden ablaufen. Die zurückgegebenen öffentlichen URLs werden für Generierungsanfragen verwendet.

### Flaq.ai-API-Schlüssel einrichten

1. Bei [flaq.ai](https://flaq.ai) registrieren oder anmelden.
2. Das Konto-Dashboard öffnen.
3. Im Bereich für API-Schlüssel einen **Client Key erstellen**.
4. Den Client Key kopieren.
5. In der App das **Zahnradsymbol** (⚙️) im Kopfbereich anklicken, um **Open API Settings** zu öffnen.
6. Den Client Key einfügen und die Verbindung mit **Test Connection** prüfen.
7. Die Einstellungen speichern.

> **💡 Tipp:** „Remember Me“ speichert den API-Schlüssel verschlüsselt im lokalen Browserspeicher über Sitzungen hinweg. Auf gemeinsam genutzten oder öffentlichen Geräten sollte diese Option deaktiviert bleiben.

> **🔑 API-Guthaben:** Für Bilder und Videos ist ausreichend API-Guthaben erforderlich. Lade dein Guthaben bei Bedarf auf [flaq.ai](https://flaq.ai) auf.

## Verwendung

### Entwicklung

```bash
# Entwicklungsserver mit Turbopack für schnelleres HMR starten
pnpm dev:turbo

# Alternativ den Standardbefehl verwenden
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Build

```bash
# Produktions-Build erstellen
pnpm build

# Produktionsserver starten
pnpm start
```

### Linting und Formatierung

```bash
# ESLint ausführen
pnpm lint

# Lint-Probleme automatisch beheben
pnpm lint:fix

# Code mit Prettier formatieren
pnpm prettier

# TypeScript-Typprüfung
pnpm ts-check
```

## AIGC-Funktionen

Die Vorlage verbindet eigene Generierungsseiten mit einem gemeinsamen Creator und einer unendlichen Leinwand auf Basis der [Flaq.ai](https://flaq.ai) API.

| Funktion | Route | Beschreibung |
| -------- | ----- | ------------ |
| **Text-zu-Bild** | `/text-to-image/` | Bilder aus Textbeschreibungen generieren |
| **Bild-zu-Bild** | `/image-to-image/` | Bilder mit Prompts und Referenzbildern bearbeiten |
| **Text-zu-Video** | `/text-to-video/` | Videos aus Textbeschreibungen generieren |
| **Bild-zu-Video** | `/image-to-video/` | Videos aus Bildern generieren, bei kompatiblen Modellen mit Steuerung des Endbilds |
| **Referenz-zu-Video** | `/reference-to-video/` | Referenzen vorbereiten und die Generierung im AI Media Creator fortsetzen |
| **Virtuelle Anprobe** | `/virtual-try-on/` | Personenfoto und Kleidungsbilder für eine Outfit-Vorschau kombinieren |
| **AI Media Creator** | `/ai-media-creator/` | Bilder und Videos in einem Arbeitsbereich generieren und den Verlauf durchsuchen |
| **AI Canvas** | `/ai-canvas/` | Verbundene visuelle Abläufe erstellen und Leinwandprojekte verwalten |

Modelldefinitionen liegen unter `lib/constants/template-models/`, gruppiert nach Anbieter und Medientyp. Bildmodelle sind beispielsweise Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 und Seedream 5.0. Videomodelle sind beispielsweise Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 und Vidu Q3. Verfügbare Eingaben und Parameter hängen vom gewählten Modell ab; jedes Formular verwendet die entsprechende Modellkonfiguration.

Die virtuelle Anprobe hat eine eigene Modellauswahl: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit und Seedream 4.5 Edit.

### AI Media Creator

Unter `/ai-media-creator/` kannst du zwischen Bild- und Videogenerierung wechseln, ein Modell auswählen, Eingaben hinzufügen und unterstützte Parameter einstellen. Referenz-zu-Video unterstützt je nach Modell Bilder, Videos, Audio, Dokumente und Links sowie Referenzverweise im Prompt-Editor.

Der Generierungsstatus wird automatisch abgefragt; Ergebnisse erscheinen im Creator-Verlauf. Der Bild- und Videoverlauf wird im lokalen Speicher des aktuellen Browsers gespeichert.

### AI Canvas

Starte unter `/ai-canvas/`, verwalte gespeicherte Projekte unter `/ai-canvas/projects/` und öffne einzelne Projekte unter `/ai-canvas/{projectId}/`. Das Einstiegsformular bereitet ein Projekt aus deinen Generierungseinstellungen und Eingaben vor.

- Medien- und Generierungsknoten auf einer unendlichen Leinwand anordnen und verbinden
- Bilder und Videos über die konfigurierte API-Verbindung generieren
- Projekte lokal in IndexedDB speichern und über das Projekt-Dashboard erneut öffnen
- Projekte umbenennen, löschen, importieren und exportieren, einschließlich ZIP-Archiven mit Projektmedien

Projekte gehören zum aktuellen Browser und Website-Ursprung; eine kontobasierte Synchronisierung gibt es nicht. Exportiere Projekte als übertragbare Kopie, bevor du Browserdaten löschst oder zu einem anderen Gerät oder einer anderen Domain wechselst.

## Flaq.ai-Partnerprogramm

Öffentliche Einstiegs- und Generierungsseiten enthalten einen übersetzten Hinweis auf das [Flaq.ai-Partnerprogramm](https://flaq.ai/de/affiliate-program?utm_source=flaq-saas-template). Der Aktionslink öffnet die passende Flaq.ai-Sprachseite und enthält `utm_source=flaq-saas-template` zur Herkunftszuordnung.

Nach den aktuellen Programmbedingungen erhältst du 20 % Provision auf die erste gültige bezahlte Bestellung eines geworbenen Nutzers und 10 % auf weitere gültige bezahlte Bestellungen innerhalb von 60 Tagen nach der Registrierung. Für Teilnahme und Auszahlung gelten die Bedingungen auf der verlinkten Programmseite.

## Internationalisierung

Die Vorlage unterstützt **15 Sprachen**: Englisch (Standard), Japanisch, Indonesisch, Italienisch, brasilianisches Portugiesisch, Spanisch, Deutsch, Russisch, Französisch, vereinfachtes Chinesisch, traditionelles Chinesisch, Koreanisch, Thai, Vietnamesisch und Arabisch.

- Übersetzungen liegen in `messages/`, eine JSON-Datei pro Sprache.
- Die Sprache wird automatisch über den Browser-Header `Accept-Language` erkannt.
- Nutzer können die Sprache im Footer oder im Sprachdialog ändern.
- URL-Struktur: `/` für Englisch und `/{locale}/` für andere Sprachen, etwa `/ja/` oder `/zh/`.
- Arabische Seiten verwenden automatisch die Schreibrichtung von rechts nach links.

Weitere Sprachen hinzufügen:

1. Die Sprache in `i18n/languages.ts` ergänzen.
2. Eine Übersetzungsdatei in `messages/` erstellen.
3. Seitentexte und `Metadata` anhand der bestehenden Schlüsselstruktur übersetzen.

## SEO und Auffindbarkeit für KI-Crawler

Öffentliche Einstiegs- und Generierungsseiten verwenden übersetzte Titel und Beschreibungen, absolute kanonische URLs, `hreflang`-Alternativen für 15 Sprachen, Open-Graph-Metadaten, eine Twitter Card sowie Index/Follow-Anweisungen. Die generierte `/sitemap.xml` enthält die Startseite, Funktionsseiten und Richtlinienseiten in allen Sprachen mit passenden Sprachalternativen. Einzelne lokale Leinwandprojekte sind nicht enthalten.

- `/robots.txt` erlaubt Suchmaschinen und KI-Assistenten den Zugriff auf öffentliche Inhalte und sperrt API- und Callback-Routen.
- `/llms.txt` bietet eine kompakte, strukturierte Übersicht über Produkt, Seiten, Sprachen, Dokumentation und Richtlinien.
- `/llms-full.txt` enthält ausführliche Informationen zu Projekt, Funktionen, Einrichtung, Architektur und Nutzungsgrenzen.
- JSON-LD beschreibt die Website und das MIT-lizenzierte Open-Source-Repository ohne nicht überprüfbare Bewertungen.

Setze `NEXT_PUBLIC_SITE_URL` vor der Bereitstellung auf den Produktionsursprung, damit kanonische URLs, Sitemap und LLM-Ressourcen die richtige Domain verwenden.

## Projektstruktur

```text
.
├── app/                     # Next.js-App-Router-Seiten
│   ├── [locale]/           # Internationalisierte Routen für 15 Sprachen
│   │   ├── (with-footer)/  # Seiten mit Footer
│   │   │   ├── (home)/     # Startseite
│   │   │   └── (ai-features)/ # AIGC-Funktionsseiten
│   │   └── (without-footer)/ # AI-Canvas-Einstieg, Projektübersicht und Editor
│   ├── api/                # API-Routen (proxy-image, upload)
│   ├── robots.ts           # Erzeugung von robots.txt
│   ├── sitemap.ts          # Dynamische Sitemap
│   ├── llms.txt/           # Kompakte KI-lesbare Seitenübersicht
│   └── llms-full.txt/      # Ausführlicher KI-lesbarer Projektkontext
├── components/             # Wiederverwendbare React-Komponenten
│   ├── infinite-canvas/    # Leinwandeditor, Übersicht, Integrationen und lokale Speicherung
│   ├── unified-generator/  # Gemeinsames Bild-/Videoformular und Creator-Verlauf
│   ├── ui/                 # Komponenten im shadcn/ui-Stil auf Radix-Basis
│   ├── dialog/             # Dialoge, z. B. API-Einstellungen
│   ├── layout/             # Layout: Kopfbereich, Footer und Seitenleiste
│   └── ...                 # Funktionsspezifische Komponenten
├── hooks/                  # Eigene React-Hooks
├── i18n/                   # Internationalisierung
│   ├── languages.ts        # Unterstützte Sprachen
│   ├── request.ts          # next-intl-Anfragekonfiguration
│   └── routing.ts          # Sprachabhängiges Routing
├── lib/                    # Hilfsbibliotheken
│   ├── seo/                # Metadaten, llms.txt und Crawler-Hilfen
│   ├── constants/          # Konstanten, Anbietermodelle und Navigation
│   ├── utils/              # Hilfsfunktionen
│   └── env.ts              # Hilfen für Umgebungsvariablen
├── messages/               # Eine Übersetzungsdatei je Sprache
├── network/                # API-Client und Netzwerkhilfen
│   ├── clientFetch.ts      # Flaq.ai-API-Client mit Authentifizierung
│   ├── image/              # API-Aufrufe zur Bildgenerierung
│   ├── video/              # API-Aufrufe zur Videogenerierung
│   ├── local-history.ts    # Lokaler Generierungsverlauf im Browser
│   ├── task-polling.ts     # Gemeinsame Statusabfrage für Generierungen
│   └── upload/             # Flaq-Datei-Upload-Client
├── public/                 # Statische Dateien: Bilder, Symbole und Schriften
├── store/                  # Zustand-Stores
├── next.config.mjs         # Next.js-Konfiguration
├── proxy.ts                # Middleware-Proxy für i18n und IP-Weiterleitung
└── tsconfig.json           # TypeScript-Konfiguration
```

## Bereitstellung

Am einfachsten lässt sich die Vorlage über [Vercel](https://vercel.com) bereitstellen:

[![Mit Vercel bereitstellen](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Repository auf GitHub hochladen.
2. Projekt in Vercel importieren.
3. `NEXT_PUBLIC_SITE_URL` auf den Produktionsursprung setzen und die Kontaktadresse in den Vercel-Projekteinstellungen konfigurieren.
4. Bei eigenem R2-Speicher die vier serverseitigen `R2_*`-Variablen ergänzen und die öffentliche Domain in der App konfigurieren.
5. Bereitstellen!

Die App enthält Serverrouten für Uploads und den Bild-Proxy und benötigt daher eine Next.js-Serverlaufzeit. Für selbst gehostetes Node.js führe `pnpm build` und danach `pnpm start` aus. Führe vor der Bereitstellung zusätzlich `pnpm ts-check` aus, da die aktuelle Next.js-Konfiguration TypeScript-Fehler beim Build überspringt.

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) als Open Source verfügbar.
