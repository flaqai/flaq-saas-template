# Flaq SaaS Template（繁體中文）

免費開源的 SaaS 範本，透過 [Flaq.ai](https://flaq.ai) API 建立 AI 圖像與影片生成平台。提供統一的圖像與影片創作工具、參考素材生成影片流程，以及支援本機專案管理的無限 AI 畫布。

**README：** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> README 的語言集合與 `i18n/languages.ts` 保持一致，每種介面語言都有對應的專案介紹。

## 目錄

- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [快速開始](#快速開始)
  - [環境需求](#環境需求)
  - [安裝步驟](#安裝步驟)
  - [環境變數](#環境變數)
  - [檔案上傳](#檔案上傳)
  - [Flaq.ai API 金鑰設定](#flaqai-api-金鑰設定)
- [使用方式](#使用方式)
  - [開發](#開發)
  - [建置](#建置)
  - [程式碼檢查與格式化](#程式碼檢查與格式化)
- [AIGC 功能](#aigc-功能)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Flaq.ai 聯盟行銷計畫](#flaqai-聯盟行銷計畫)
- [國際化](#國際化)
- [SEO 與 AI 爬蟲探索](#seo-與-ai-爬蟲探索)
- [專案結構](#專案結構)
- [部署](#部署)
- [授權](#授權)

## 功能特色

- 🎨 **文生圖** — 使用先進的 AI 模型，透過文字提示生成精美圖像
- 🖼️ **圖生圖** — 將現有圖像轉換為創意變化，保持風格一致
- 🎬 **文生影片** — 從簡單的文字描述建立高品質影片
- 📹 **圖生影片** — 將靜態圖像轉換成動態影片
- 🧩 **AI Media Creator** — 使用共用表單生成圖像與影片，並依模型設定參數
- 🎞️ **參考素材生成影片** — 依所選模型使用圖像、影片、音訊、文件或連結作為參考
- 🗂️ **AI Canvas** — 在無限畫布連接媒體與生成節點、儲存本機專案，並匯入或匯出 ZIP 封存檔
- 👗 **虛擬試衣** — AI 驅動的虛擬服裝試穿體驗
- 🌐 **國際化** — 與 Flaq.ai 對齊的 15 種語言、語言路由及 SEO 替代連結
- 🚀 **無需註冊** — 無需建立應用程式帳號，即可探索、修改和自行部署範本
- 🤝 **聯盟推廣** — 響應式 Flaq.ai 聯盟推薦區塊，提供在地化文案和連結
- 🔒 **安全金鑰管理** — 以加密的用戶端儲存保護 Flaq.ai 憑證
- ☁️ **檔案上傳** — 使用 Flaq API 金鑰或自有 Cloudflare R2 儲存空間上傳媒體
- 📱 **響應式設計** — 使用 Tailwind CSS 和 Radix UI 建立完整的響應式介面
- 🌓 **深色模式** — 內建精美的深色主題介面
- ⚡ **快速效能** — 採用 Next.js 16，支援 Turbopack
- 🔍 **SEO 最佳化** — 動態中繼資料、Open Graph、網站地圖與結構化資料
- 🤖 **支援 AI 爬蟲** — 提供精簡的 `llms.txt`、完整的 `llms-full.txt` 及公開內容存取

## 技術架構

| 類別 | 技術 |
| ---- | ---- |
| 框架 | [Next.js 16](https://nextjs.org/) (App Router) |
| 語言 | [TypeScript](https://www.typescriptlang.org/) |
| UI 函式庫 | [React 19](https://react.dev/) |
| 樣式 | [Tailwind CSS v4](https://tailwindcss.com/) |
| 元件函式庫 | [Radix UI](https://www.radix-ui.com/) |
| 動畫 | [Framer Motion](https://www.framer.com/motion/) |
| 表單 | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| 狀態管理 | [Zustand](https://zustand.docs.pmnd.rs/) |
| 資料擷取 | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| 國際化 | [next-intl](https://next-intl-docs.vercel.app/) |
| 圖示 | [Lucide React](https://lucide.dev/) |
| 圖表 | [Recharts](https://recharts.org/) |
| 套件管理 | [pnpm](https://pnpm.io/) |
| 程式碼檢查 | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## 快速開始

### 環境需求

- **Node.js 22**（`.nvmrc` 指定的版本）
- **pnpm 10.5.2**（由 `package.json` 的 `packageManager` 欄位固定）
- 一個 [Flaq.ai](https://flaq.ai/) 帳號及有效的 API 金鑰

### 安裝步驟

```bash
# 1. 複製儲存庫
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. 安裝 pnpm（若尚未安裝）
npm install -g pnpm@10.5.2

# 3. 安裝相依套件
pnpm install

# 4. 複製環境變數範本
cp .env.example .env.local
```

### 環境變數

編輯 `.env.local` 並設定以下變數：

```bash
# 網站 URL（用於中繼資料、網站地圖和 Open Graph）
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 頁尾顯示的聯絡信箱
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# 選用：自有 Cloudflare R2 儲存空間（憑證僅保存在伺服器端）
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### 檔案上傳

檔案上傳預設使用 **Open API Settings** 中設定的 API 網址與 Client Key。如需使用自有 Cloudflare R2，請在伺服器端設定 `R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY` 和 `R2_BUCKET_NAME`，再於設定對話框的 **Image Hosting (R2)** 中輸入公開網域並儲存。R2 憑證僅可保存在伺服器端。使用 **Test R2 Connection** 檢查儲存設定。

設定公開網域後，上傳會優先使用自有 R2。清除網域並儲存後，會恢復 Flaq 上傳。自訂儲存發生錯誤時會顯示錯誤，不會切換至 Flaq 上傳。

使用 Flaq 上傳時，應用程式會透過 `POST /api/v1/files/presignedUrl` 取得上傳網址，再透過 `PUT` 直接上傳各檔案。每次請求最多支援 10 個檔案，超過時依序分批處理，例如 14 個檔案分成 10 個和 4 個兩批。網址有效期限為 60 秒，每批取得網址後立即上傳。生成請求使用回傳的公開網址。

### Flaq.ai API 金鑰設定

1. 在 [flaq.ai](https://flaq.ai) **註冊或登入**
2. **進入**帳號控制台
3. 在 API Keys 區域**產生 Client Key**
4. **複製** Client Key
5. **開啟**應用程式，點擊頁首的**齒輪圖示**（⚙️）以開啟 **Open API Settings**
6. **貼上** Client Key，點擊 **Test Connection** 驗證連線
7. **儲存**設定

> **💡 提示**：啟用「Remember Me」可跨工作階段安全保存 API 金鑰。金鑰會以加密的本機儲存方式保存。在共用或公共裝置上，請勿勾選此選項。

> **🔑 API 額度**：生成圖像與影片需要足夠的 API 額度。如需儲值，請前往 [flaq.ai](https://flaq.ai)。

## 使用方式

### 開發

```bash
# 啟動開發伺服器（使用 Turbopack 加速熱更新）
pnpm dev:turbo

# 或使用預設開發命令
pnpm dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。

### 建置

```bash
# 正式環境建置
pnpm build

# 啟動正式環境伺服器
pnpm start
```

### 程式碼檢查與格式化

```bash
# 執行 ESLint
pnpm lint

# 自動修正檢查問題
pnpm lint:fix

# 使用 Prettier 格式化程式碼
pnpm prettier

# TypeScript 型別檢查
pnpm ts-check
```

## AIGC 功能

本範本透過 [Flaq.ai](https://flaq.ai) API，整合獨立生成頁面、共用創作工具與無限畫布。

| 功能 | 路由 | 說明 |
| ---- | ---- | ---- |
| **文生圖** | `/text-to-image/` | 透過文字提示生成圖像 |
| **圖生圖** | `/image-to-image/` | 使用提示與參考圖像編輯圖片 |
| **文生影片** | `/text-to-video/` | 透過文字提示生成影片 |
| **圖生影片** | `/image-to-video/` | 從圖像生成影片，相容模型支援結尾影格控制 |
| **參考素材生成影片** | `/reference-to-video/` | 準備參考輸入，並在 AI Media Creator 中繼續生成 |
| **虛擬試衣** | `/virtual-try-on/` | 結合人物照片和服裝圖像，預覽穿搭效果 |
| **AI Media Creator** | `/ai-media-creator/` | 在同一工作區生成圖像與影片，並瀏覽生成歷史 |
| **AI Canvas** | `/ai-canvas/` | 建立互相連接的視覺化工作流程並管理畫布專案 |

模型定義位於 `lib/constants/template-models/`，依供應商與媒體類型分組。圖像模型範例包括 Nano Banana Pro、Nano Banana 2、GPT Image 2、ChatGPT Images 2.5、Qwen Image 3.0 和 Seedream 5.0。影片模型範例包括 Kling 3.0、Veo 3.1、Wan 2.7、Seedance 2.0 和 Vidu Q3。可用輸入與參數取決於所選模型，各表單使用對應的模型設定。

虛擬試衣有獨立的模型選項：GPT Image 2 Edit、Nano Banana Pro Edit、Nano Banana 2 Edit、Seedream 5.0 Edit 和 Seedream 4.5 Edit。

### AI Media Creator

在 `/ai-media-creator/` 切換圖像與影片生成、選擇模型、新增輸入，並設定模型支援的參數。參考素材生成影片依模型支援圖像、影片、音訊、文件和連結，並可在提示編輯器中引用參考素材。

生成狀態會自動輪詢，結果顯示在創作工具的歷史記錄中。圖像與影片歷史保存在目前瀏覽器的本機儲存空間。

### AI Canvas

從 `/ai-canvas/` 開始，在 `/ai-canvas/projects/` 管理已儲存的專案，並透過 `/ai-canvas/{projectId}/` 開啟個別專案。畫布入口表單依所選生成設定與輸入準備專案。

- 在無限畫布排列並連接媒體與生成節點
- 使用已設定的 API 連線生成圖像與影片
- 將專案保存在本機 IndexedDB，並從專案面板重新開啟
- 重新命名、刪除、匯入和匯出專案，包括包含專案媒體的 ZIP 封存檔

專案屬於目前瀏覽器及網站來源，不提供以帳號為基礎的專案同步。清除瀏覽器資料或移轉至其他裝置、網域前，請先匯出專案以保留可攜式副本。

## Flaq.ai 聯盟行銷計畫

公開登陸頁面和生成頁面提供在地化的 [Flaq.ai 聯盟行銷計畫](https://flaq.ai/tw/affiliate-program?utm_source=flaq-saas-template) 推廣區塊。按鈕會開啟對應語言的 Flaq.ai 頁面，並包含 `utm_source=flaq-saas-template` 以追蹤來源。

推薦使用者的首筆有效付費訂單可獲得 20% 傭金，註冊後 60 天內的後續有效付費訂單可獲得 10% 傭金。參加資格與結算方式以計畫頁面的最新條款為準。

## 國際化

本範本預設支援 **15 種語言**：英文（預設）、日文、印尼文、義大利文、巴西葡萄牙文、西班牙文、德文、俄文、法文、簡體中文、繁體中文、韓文、泰文、越南文及阿拉伯文。

- 翻譯檔案位於 `messages/`，每種語言對應一個 JSON 檔案
- 依瀏覽器的 `Accept-Language` 標頭自動偵測語言
- 使用者可透過頁尾或語言對話框手動切換語言
- URL 結構：英文使用 `/`，其他語言使用 `/{locale}/`，例如 `/ja/` 或 `/zh/`
- 阿拉伯文頁面自動使用由右至左的文件方向

新增語言：

1. 在 `i18n/languages.ts` 新增語言
2. 在 `messages/` 建立新的翻譯檔案
3. 依現有 key 結構新增該語言的頁面文案和 `Metadata` 翻譯

## SEO 與 AI 爬蟲探索

公開登陸頁面和生成頁面具有在地化標題與描述、絕對 canonical URL、15 種語言的 `hreflang` 替代連結、Open Graph、Twitter 卡片及 index/follow 指令。產生的 `/sitemap.xml` 包含所有語言的首頁、功能路由和政策頁面，並提供對應語言的替代連結。個別本機畫布專案的 URL 不會列入。

- `/robots.txt` 允許搜尋引擎和 AI 助手擷取公開內容，同時封鎖 API 和回呼路由
- `/llms.txt` 提供產品、頁面、語言、文件與政策的精簡結構化導覽
- `/llms-full.txt` 提供完整的專案背景、功能、設定步驟、架構和使用界限
- JSON-LD 描述網站與採用 MIT 授權的開源儲存庫，不包含無法驗證的評分

部署前將 `NEXT_PUBLIC_SITE_URL` 設為正式環境的網站來源，確保 canonical、網站地圖與 LLM 資源 URL 使用正確網域。

## 專案結構

```
.
├── app/                     # Next.js App Router 頁面
│   ├── [locale]/           # 國際化路由（15 種語言）
│   │   ├── (with-footer)/  # 含頁尾版面的頁面
│   │   │   ├── (home)/     # 登陸頁面
│   │   │   └── (ai-features)/ # AIGC 功能頁面
│   │   └── (without-footer)/ # AI Canvas 入口、專案面板和編輯器
│   ├── api/                # API 路由（圖片代理、上傳）
│   ├── robots.ts           # Robots.txt 產生
│   ├── sitemap.ts          # 動態網站地圖產生
│   ├── llms.txt/           # 精簡的 AI 可讀網站導覽
│   └── llms-full.txt/      # 完整的 AI 可讀專案背景
├── components/             # 可重複使用的 React 元件
│   ├── infinite-canvas/    # 畫布編輯器、面板、整合和本機持久化
│   ├── unified-generator/  # 共用圖像/影片表單與創作歷史
│   ├── ui/                 # shadcn/ui 風格元件（以 Radix 為基礎）
│   ├── dialog/             # 對話框元件（API 設定等）
│   ├── layout/             # 版面元件（頁首、頁尾、側邊欄）
│   └── ...                 # 各功能專用元件
├── hooks/                  # 自訂 React Hooks
├── i18n/                   # 國際化設定
│   ├── languages.ts        # 支援的語言定義
│   ├── request.ts          # next-intl 請求設定
│   └── routing.ts          # 語言路由設定
├── lib/                    # 工具函式庫
│   ├── seo/                # 中繼資料、llms.txt 與爬蟲輔助工具
│   ├── constants/          # 應用程式常數、供應商模型定義、導覽
│   ├── utils/              # 工具函式
│   └── env.ts              # 環境變數輔助函式
├── messages/               # 各語言的翻譯檔案
├── network/                # API 用戶端與網路工具
│   ├── clientFetch.ts      # 含驗證的 Flaq.ai API 用戶端
│   ├── image/              # 圖像生成 API 呼叫
│   ├── video/              # 影片生成 API 呼叫
│   ├── local-history.ts    # 瀏覽器本機生成歷史
│   ├── task-polling.ts     # 共用生成狀態輪詢
│   └── upload/             # Flaq 檔案上傳用戶端
├── public/                 # 靜態資源（圖像、圖示、字型）
├── store/                  # Zustand 狀態儲存
├── next.config.mjs         # Next.js 設定
├── proxy.ts                # 中介軟體代理（國際化與 IP 轉送）
└── tsconfig.json           # TypeScript 設定
```

## 部署

建議透過 [Vercel](https://vercel.com) 部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. 將儲存庫推送至 GitHub
2. 在 Vercel 匯入專案
3. 在 Vercel 專案設定中將 `NEXT_PUBLIC_SITE_URL` 設為正式環境的網站來源，並設定聯絡信箱
4. 如使用自有 R2，新增四個伺服器端 `R2_*` 變數，並在應用程式設定公開網域
5. 部署！

應用程式包含上傳與圖片代理的伺服器路由，因此部署需要 Next.js 伺服器執行環境。自行部署 Node.js 時，先執行 `pnpm build`，再執行 `pnpm start`。由於目前 Next.js 設定在建置時略過 TypeScript 錯誤檢查，部署前請另外執行 `pnpm ts-check`。

## 授權

本專案採用 [MIT License](LICENSE) 開源授權。
