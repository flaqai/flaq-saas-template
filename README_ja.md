# Flaq SaaS Template（日本語）

[Flaq.ai](https://flaq.ai) API を使って AI 画像・動画生成サービスを構築できる無料のオープンソース SaaS テンプレートです。画像と動画をまとめて作成するツール、参照素材からの動画生成、ローカルプロジェクト管理に対応した無限 AI キャンバスを備えています。

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> README の言語は `i18n/languages.ts` と一致しており、すべての UI 言語に対応するプロジェクト紹介があります。

## 目次

- [主な機能](#主な機能)
- [技術構成](#技術構成)
- [クイックスタート](#クイックスタート)
  - [必要な環境](#必要な環境)
  - [インストール](#インストール)
  - [環境変数](#環境変数)
  - [ファイルアップロード](#ファイルアップロード)
  - [Flaq.ai API キーの設定](#flaqai-api-キーの設定)
- [使い方](#使い方)
  - [開発](#開発)
  - [ビルド](#ビルド)
  - [コード検査と整形](#コード検査と整形)
- [AIGC 機能](#aigc-機能)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Flaq.ai アフィリエイトプログラム](#flaqai-アフィリエイトプログラム)
- [国際化](#国際化)
- [SEO と AI クローラー向けの情報](#seo-と-ai-クローラー向けの情報)
- [プロジェクト構成](#プロジェクト構成)
- [デプロイ](#デプロイ)
- [ライセンス](#ライセンス)

## 主な機能

- 🎨 **テキストから画像** — 先進的な AI モデルでテキストプロンプトから美しい画像を生成
- 🖼️ **画像から画像** — スタイルを保ちながら既存画像の創造的なバリエーションを作成
- 🎬 **テキストから動画** — 簡単なテキストの説明から高品質な動画を生成
- 📹 **画像から動画** — 静止画を動きのある動画に変換
- 🧩 **AI Media Creator** — 共通フォームで画像と動画を生成し、モデルごとのパラメーターを設定
- 🎞️ **参照素材から動画** — 選択したモデルに応じて画像、動画、音声、文書、リンクを参照素材として使用
- 🗂️ **AI Canvas** — 無限キャンバスでメディアと生成ノードを接続し、プロジェクトのローカル保存や ZIP のインポート・エクスポートが可能
- 👗 **バーチャル試着** — AI を活用した衣服の仮想試着
- 🌐 **国際化** — Flaq.ai と揃えた 15 言語、言語対応ルーティング、SEO 代替リンク
- 🚀 **登録不要** — アプリのアカウントを作らずにテンプレートの閲覧、変更、セルフホストが可能
- 🤝 **アフィリエイト紹介** — 各言語の文面とリンクを備えたレスポンシブな Flaq.ai 紹介セクション
- 🔒 **安全な API キー管理** — Flaq.ai の認証情報をクライアント側で暗号化して保存
- ☁️ **ファイルアップロード** — Flaq API キーまたは独自の Cloudflare R2 ストレージでメディアをアップロード
- 📱 **レスポンシブデザイン** — Tailwind CSS と Radix UI を使用した画面サイズに対応する UI
- 🌓 **ダークモード** — 美しいダークテーマを標準搭載
- ⚡ **高速動作** — Next.js 16 を採用し Turbopack に対応
- 🔍 **SEO 対応** — 動的メタデータ、Open Graph、サイトマップ、構造化データ
- 🤖 **AI クローラー対応** — 要点をまとめた `llms.txt`、詳細な `llms-full.txt`、公開コンテンツへのアクセス

## 技術構成

| 分類 | 技術 |
| ---- | ---- |
| フレームワーク | [Next.js 16](https://nextjs.org/) (App Router) |
| 言語 | [TypeScript](https://www.typescriptlang.org/) |
| UI ライブラリ | [React 19](https://react.dev/) |
| スタイル | [Tailwind CSS v4](https://tailwindcss.com/) |
| コンポーネント | [Radix UI](https://www.radix-ui.com/) |
| アニメーション | [Framer Motion](https://www.framer.com/motion/) |
| フォーム | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| 状態管理 | [Zustand](https://zustand.docs.pmnd.rs/) |
| データ取得 | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| 国際化 | [next-intl](https://next-intl-docs.vercel.app/) |
| アイコン | [Lucide React](https://lucide.dev/) |
| グラフ | [Recharts](https://recharts.org/) |
| パッケージ管理 | [pnpm](https://pnpm.io/) |
| コード検査 | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## クイックスタート

### 必要な環境

- **Node.js 22**（`.nvmrc` で指定されたバージョン）
- **pnpm 10.5.2**（`package.json` の `packageManager` で固定）
- 有効な API キーを持つ [Flaq.ai](https://flaq.ai/) アカウント

### インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. pnpm が未導入の場合はインストール
npm install -g pnpm@10.5.2

# 3. 依存パッケージをインストール
pnpm install

# 4. 環境変数のテンプレートをコピー
cp .env.example .env.local
```

### 環境変数

`.env.local` を編集して次の変数を設定します。

```bash
# サイトの URL（メタデータ、サイトマップ、Open Graph 用）
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# フッターに表示する連絡先メールアドレス
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# 任意：独自の Cloudflare R2 ストレージ（認証情報はサーバー側のみ）
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### ファイルアップロード

標準では **Open API Settings** に設定した API URL と Client Key を使ってアップロードします。独自の Cloudflare R2 を使う場合は、サーバー側で `R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_BUCKET_NAME` を設定し、設定ダイアログの **Image Hosting (R2)** に公開ドメインを入力して保存してください。R2 の認証情報はサーバー側だけに保存します。**Test R2 Connection** で設定を確認できます。

公開ドメインが設定されている場合、アップロードには独自の R2 を優先します。ドメインを消して保存すると Flaq アップロードに戻ります。独自ストレージのエラー時にはエラーを表示し、Flaq に切り替えません。

Flaq アップロードでは `POST /api/v1/files/presignedUrl` でアップロード URL を取得し、各ファイルを `PUT` で直接送信します。1 回のリクエストで最大 10 ファイルに対応し、それ以上は順番に分割します。たとえば 14 ファイルは 10 と 4 の 2 回です。URL は 60 秒で失効するため、各バッチは URL 取得後すぐにアップロードします。返された公開 URL を生成リクエストに使用します。

### Flaq.ai API キーの設定

1. [flaq.ai](https://flaq.ai) で**登録またはログイン**
2. アカウントのダッシュボードを**開く**
3. API Keys セクションで **Client Key を生成**
4. Client Key を**コピー**
5. アプリのヘッダーにある**歯車アイコン**（⚙️）から **Open API Settings** を開く
6. Client Key を**貼り付け**、**Test Connection** で接続を確認
7. 設定を**保存**

> **💡 ヒント**：「Remember Me」を有効にすると、API キーを暗号化したローカルストレージに保存し、次回も利用できます。共有端末や公共の端末では、安全のためこの設定を無効にしてください。

> **🔑 API クレジット**：画像や動画の生成には十分な API クレジットが必要です。必要に応じて [flaq.ai](https://flaq.ai) で残高を追加してください。

## 使い方

### 開発

```bash
# 開発サーバーを起動（Turbopack でホットリロードを高速化）
pnpm dev:turbo

# または標準の開発コマンドを使用
pnpm dev
```

ブラウザーで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
# 本番用ビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

### コード検査と整形

```bash
# ESLint を実行
pnpm lint

# 検査で見つかった問題を自動修正
pnpm lint:fix

# Prettier でコードを整形
pnpm prettier

# TypeScript の型チェック
pnpm ts-check
```

## AIGC 機能

[Flaq.ai](https://flaq.ai) API により、個別の生成ページ、共通の作成ツール、無限キャンバスを提供します。

| 機能 | ルート | 説明 |
| ---- | ---- | ---- |
| **テキストから画像** | `/text-to-image/` | テキストプロンプトから画像を生成 |
| **画像から画像** | `/image-to-image/` | プロンプトと参照画像を使って画像を編集 |
| **テキストから動画** | `/text-to-video/` | テキストプロンプトから動画を生成 |
| **画像から動画** | `/image-to-video/` | 画像から動画を生成し、対応モデルでは終了フレームを指定 |
| **参照素材から動画** | `/reference-to-video/` | 参照入力を準備し、AI Media Creator で生成を続行 |
| **バーチャル試着** | `/virtual-try-on/` | 人物写真と衣服画像を組み合わせて着用イメージを確認 |
| **AI Media Creator** | `/ai-media-creator/` | 同じ作業画面で画像と動画を生成し、生成履歴を閲覧 |
| **AI Canvas** | `/ai-canvas/` | 接続された視覚的ワークフローの作成とキャンバスプロジェクトの管理 |

モデル定義は `lib/constants/template-models/` にあり、提供元とメディアの種類で分類されています。画像モデルの例は Nano Banana Pro、Nano Banana 2、GPT Image 2、ChatGPT Images 2.5、Qwen Image 3.0、Seedream 5.0 です。動画モデルの例は Kling 3.0、Veo 3.1、Wan 2.7、Seedance 2.0、Vidu Q3 です。利用できる入力とパラメーターは選択モデルにより異なり、各フォームは対応するモデル設定を使用します。

バーチャル試着には独立したモデル選択があり、GPT Image 2 Edit、Nano Banana Pro Edit、Nano Banana 2 Edit、Seedream 5.0 Edit、Seedream 4.5 Edit を利用できます。

### AI Media Creator

`/ai-media-creator/` で画像・動画生成を切り替え、モデルの選択、入力の追加、対応パラメーターの設定ができます。参照素材からの動画生成では、モデルに応じて画像、動画、音声、文書、リンクに対応し、プロンプトエディター内で参照素材を指定できます。

生成状態は自動でポーリングされ、結果は作成ツールの履歴に表示されます。画像・動画の履歴は現在のブラウザーのローカルストレージに保存されます。

### AI Canvas

`/ai-canvas/` から開始し、`/ai-canvas/projects/` で保存済みプロジェクトを管理し、`/ai-canvas/{projectId}/` で個別プロジェクトを開きます。入口のフォームは選択した生成設定と入力からプロジェクトを準備します。

- 無限キャンバス上でメディアと生成ノードを配置・接続
- 設定済みの API 接続で画像や動画を生成
- IndexedDB にプロジェクトをローカル保存し、ダッシュボードから再度開く
- 名前変更、削除、インポート、エクスポートに対応し、プロジェクトのメディアを含む ZIP も利用可能

プロジェクトは現在のブラウザーとサイトのオリジンに属し、アカウントを使った同期はありません。ブラウザーデータの消去や別の端末・ドメインへの移行前に、プロジェクトをエクスポートして持ち運べるコピーを保存してください。

## Flaq.ai アフィリエイトプログラム

公開ランディングページと生成ページには、各言語の [Flaq.ai アフィリエイトプログラム](https://flaq.ai/ja/affiliate-program?utm_source=flaq-saas-template) の紹介があります。ボタンは対応する言語の Flaq.ai ページを開き、流入元の識別用に `utm_source=flaq-saas-template` を含みます。

紹介ユーザーの最初の有効な有料注文で 20%、登録後 60 日以内の以降の有効な有料注文で 10% のコミッションを獲得できます。資格・支払い条件はリンク先の最新規約が適用されます。

## 国際化

標準で **15 言語**に対応しています。英語（既定）、日本語、インドネシア語、イタリア語、ブラジルポルトガル語、スペイン語、ドイツ語、ロシア語、フランス語、簡体字中国語、繁体字中国語、韓国語、タイ語、ベトナム語、アラビア語です。

- 翻訳は `messages/` にあり、言語ごとに JSON ファイルを使用
- ブラウザーの `Accept-Language` ヘッダーから言語を自動検出
- フッターまたは言語ダイアログから手動で言語を切り替え可能
- 英語は `/`、その他の言語は `/{locale}/` を使用（例：`/ja/`、`/zh/`）
- アラビア語ページは自動で右から左への文書方向を使用

言語の追加手順：

1. `i18n/languages.ts` に言語を追加
2. `messages/` に翻訳ファイルを作成
3. 既存のキー構造に従ってページ文面と `Metadata` の翻訳を追加

## SEO と AI クローラー向けの情報

公開ランディングページと生成ページには、各言語のタイトルと説明、絶対 canonical URL、15 言語の `hreflang`、Open Graph、Twitter カード、index/follow 指示があります。生成される `/sitemap.xml` は、全言語のホームページ、機能ページ、ポリシーページと対応する代替言語リンクを含みます。個別のローカルキャンバスプロジェクトの URL は含みません。

- `/robots.txt` は公開コンテンツに対する検索エンジンと AI アシスタントのクロールを許可し、API とコールバックのルートをブロック
- `/llms.txt` は製品、ページ、言語、ドキュメント、ポリシーへの簡潔な構造化ナビゲーションを提供
- `/llms-full.txt` はプロジェクトの背景、機能、設定手順、構成、利用範囲を詳しく説明
- JSON-LD は検証できない評価を含めず、サイトと MIT ライセンスのオープンソースリポジトリを識別

デプロイ前に `NEXT_PUBLIC_SITE_URL` を本番サイトのオリジンに設定し、canonical、サイトマップ、LLM リソースの URL に正しいドメインが使われるようにしてください。

## プロジェクト構成

```
.
├── app/                     # Next.js App Router ページ
│   ├── [locale]/           # 国際化ルート（15 言語対応）
│   │   ├── (with-footer)/  # フッター付きレイアウト
│   │   │   ├── (home)/     # ランディングページ
│   │   │   └── (ai-features)/ # AIGC 機能ページ
│   │   └── (without-footer)/ # AI Canvas 入口、一覧、エディター
│   ├── api/                # API ルート（画像プロキシ、アップロード）
│   ├── robots.ts           # Robots.txt の生成
│   ├── sitemap.ts          # 動的サイトマップの生成
│   ├── llms.txt/           # AI 向けの簡潔なサイト案内
│   └── llms-full.txt/      # AI 向けの詳細なプロジェクト情報
├── components/             # 再利用可能な React コンポーネント
│   ├── infinite-canvas/    # キャンバス、一覧、連携、ローカル保存
│   ├── unified-generator/  # 共通の画像・動画フォームと生成履歴
│   ├── ui/                 # Radix ベースの shadcn/ui 形式のコンポーネント
│   ├── dialog/             # ダイアログ（API 設定など）
│   ├── layout/             # ヘッダー、フッター、サイドバー
│   └── ...                 # 機能別コンポーネント
├── hooks/                  # カスタム React Hooks
├── i18n/                   # 国際化設定
│   ├── languages.ts        # 対応言語の定義
│   ├── request.ts          # next-intl リクエスト設定
│   └── routing.ts          # 言語ルーティング設定
├── lib/                    # ユーティリティライブラリ
│   ├── seo/                # メタデータ、llms.txt、クローラー用処理
│   ├── constants/          # 定数、提供元別モデル定義、ナビゲーション
│   ├── utils/              # ユーティリティ関数
│   └── env.ts              # 環境変数の補助関数
├── messages/               # 各言語の翻訳ファイル
├── network/                # API クライアントとネットワーク処理
│   ├── clientFetch.ts      # 認証付き Flaq.ai API クライアント
│   ├── image/              # 画像生成 API 呼び出し
│   ├── video/              # 動画生成 API 呼び出し
│   ├── local-history.ts    # ブラウザー内の生成履歴
│   ├── task-polling.ts     # 共通の生成状態ポーリング
│   └── upload/             # Flaq ファイルアップロード
├── public/                 # 静的ファイル（画像、アイコン、フォント）
├── store/                  # Zustand 状態ストア
├── next.config.mjs         # Next.js 設定
├── proxy.ts                # ミドルウェアプロキシ（国際化と IP 転送）
└── tsconfig.json           # TypeScript 設定
```

## デプロイ

最も簡単な方法は [Vercel](https://vercel.com) へのデプロイです。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. リポジトリを GitHub にプッシュ
2. Vercel にプロジェクトをインポート
3. Vercel の設定で `NEXT_PUBLIC_SITE_URL` を本番オリジンに設定し、連絡先メールアドレスを指定
4. 独自 R2 を使う場合、サーバー側の 4 つの `R2_*` 変数を追加し、アプリ内で公開ドメインを設定
5. デプロイを実行

アップロードと画像プロキシにサーバールートを使うため、Next.js のサーバー実行環境が必要です。Node.js でセルフホストする場合は `pnpm build` の後に `pnpm start` を実行してください。現在の Next.js 設定はビルド時に TypeScript のエラーを無視するため、デプロイ前に `pnpm ts-check` を別途実行してください。

## ライセンス

本プロジェクトは [MIT License](LICENSE) で公開されています。
