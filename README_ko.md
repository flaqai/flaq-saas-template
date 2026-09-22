# Flaq SaaS Template (한국어)

[Flaq.ai](https://flaq.ai) API로 AI 이미지 및 동영상 생성 플랫폼을 구축할 수 있는 무료 오픈 소스 SaaS 템플릿입니다. 통합 이미지·동영상 제작 도구, 참조 자료 기반 동영상 생성, 로컬 프로젝트 관리가 가능한 무한 AI 캔버스를 제공합니다.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> README 언어 목록은 `i18n/languages.ts`와 일치하므로 모든 UI 언어에 해당하는 프로젝트 소개가 있습니다.

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
  - [필수 환경](#필수-환경)
  - [설치](#설치)
  - [환경 변수](#환경-변수)
  - [파일 업로드](#파일-업로드)
  - [Flaq.ai API 키 설정](#flaqai-api-키-설정)
- [사용 방법](#사용-방법)
  - [개발](#개발)
  - [빌드](#빌드)
  - [코드 검사 및 서식 정리](#코드-검사-및-서식-정리)
- [AIGC 기능](#aigc-기능)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Flaq.ai 제휴 프로그램](#flaqai-제휴-프로그램)
- [국제화](#국제화)
- [SEO 및 AI 크롤러 탐색](#seo-및-ai-크롤러-탐색)
- [프로젝트 구조](#프로젝트-구조)
- [배포](#배포)
- [라이선스](#라이선스)

## 주요 기능

- 🎨 **텍스트로 이미지 생성** — 최신 AI 모델로 텍스트 프롬프트에서 멋진 이미지 생성
- 🖼️ **이미지로 이미지 생성** — 일관된 스타일을 유지하며 기존 이미지의 창의적인 변형 제작
- 🎬 **텍스트로 동영상 생성** — 간단한 텍스트 설명으로 고품질 동영상 제작
- 📹 **이미지로 동영상 생성** — 정지 이미지를 움직이는 동영상으로 변환
- 🧩 **AI Media Creator** — 공통 양식에서 이미지와 동영상을 생성하고 모델별 매개변수 설정
- 🎞️ **참조 자료로 동영상 생성** — 선택한 모델에 따라 이미지, 동영상, 오디오, 문서, 링크를 참조 자료로 사용
- 🗂️ **AI Canvas** — 무한 캔버스에서 미디어와 생성 노드를 연결하고 로컬 프로젝트 저장 및 ZIP 가져오기·내보내기 지원
- 👗 **가상 피팅** — AI 기반 가상 의류 착용 경험
- 🌐 **국제화** — Flaq.ai와 동일한 15개 언어, 언어별 라우팅 및 SEO 대체 링크
- 🚀 **가입 불필요** — 앱 계정 없이 템플릿 탐색, 수정, 자체 호스팅 가능
- 🤝 **제휴 홍보** — 번역된 문구와 언어별 링크를 제공하는 반응형 Flaq.ai 제휴 안내
- 🔒 **안전한 API 키 관리** — Flaq.ai 인증 정보를 클라이언트에서 암호화하여 저장
- ☁️ **파일 업로드** — Flaq API 키 또는 자체 Cloudflare R2 스토리지로 미디어 업로드
- 📱 **반응형 디자인** — Tailwind CSS와 Radix UI로 제작한 반응형 UI
- 🌓 **다크 모드** — 기본 제공되는 세련된 다크 테마
- ⚡ **빠른 성능** — Next.js 16 기반, Turbopack 지원
- 🔍 **SEO 최적화** — 동적 메타데이터, Open Graph, 사이트맵, 구조화된 데이터
- 🤖 **AI 크롤러 지원** — 요약된 `llms.txt`, 상세한 `llms-full.txt`, 공개 콘텐츠 접근 지원

## 기술 스택

| 분류 | 기술 |
| ---- | ---- |
| 프레임워크 | [Next.js 16](https://nextjs.org/) (App Router) |
| 언어 | [TypeScript](https://www.typescriptlang.org/) |
| UI 라이브러리 | [React 19](https://react.dev/) |
| 스타일 | [Tailwind CSS v4](https://tailwindcss.com/) |
| 컴포넌트 라이브러리 | [Radix UI](https://www.radix-ui.com/) |
| 애니메이션 | [Framer Motion](https://www.framer.com/motion/) |
| 양식 | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| 상태 관리 | [Zustand](https://zustand.docs.pmnd.rs/) |
| 데이터 조회 | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| 국제화 | [next-intl](https://next-intl-docs.vercel.app/) |
| 아이콘 | [Lucide React](https://lucide.dev/) |
| 차트 | [Recharts](https://recharts.org/) |
| 패키지 관리자 | [pnpm](https://pnpm.io/) |
| 코드 검사 | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## 시작하기

### 필수 환경

- **Node.js 22** (`.nvmrc`에 지정된 버전)
- **pnpm 10.5.2** (`package.json`의 `packageManager` 필드에 고정된 버전)
- 유효한 API 키가 있는 [Flaq.ai](https://flaq.ai/) 계정

### 설치

```bash
# 1. 저장소 복제
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template

# 2. pnpm이 없다면 설치
npm install -g pnpm@10.5.2

# 3. 의존성 설치
pnpm install

# 4. 환경 변수 템플릿 복사
cp .env.example .env.local
```

### 환경 변수

`.env.local`을 편집하여 다음 변수를 설정하세요.

```bash
# 사이트 URL (메타데이터, 사이트맵, Open Graph에 사용)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 푸터에 표시할 연락처 이메일
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"

# 선택 사항: 자체 Cloudflare R2 스토리지 (인증 정보는 서버에만 저장)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### 파일 업로드

기본적으로 **Open API Settings**에 설정된 API URL과 Client Key를 사용합니다. 자체 Cloudflare R2를 사용하려면 서버에 `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`을 설정한 후 설정 창의 **Image Hosting (R2)**에 공개 도메인을 입력하고 저장하세요. R2 인증 정보는 서버에만 보관해야 합니다. **Test R2 Connection**으로 스토리지 설정을 확인할 수 있습니다.

공개 도메인이 설정되면 자체 R2를 우선 사용합니다. 도메인을 지우고 저장하면 Flaq 업로드로 돌아갑니다. 자체 스토리지에서 오류가 발생하면 오류를 표시하며 Flaq 업로드로 전환하지 않습니다.

Flaq 업로드는 `POST /api/v1/files/presignedUrl`로 업로드 URL을 요청하고 각 파일을 `PUT`으로 직접 업로드합니다. 요청당 최대 10개 파일을 지원하며 그 이상은 순서대로 나누어 처리합니다. 예를 들어 14개는 10개와 4개로 나눕니다. URL은 60초 후 만료되므로 각 묶음은 URL을 받은 즉시 업로드합니다. 응답으로 받은 공개 URL을 생성 요청에 사용합니다.

### Flaq.ai API 키 설정

1. [flaq.ai](https://flaq.ai)에서 **가입 또는 로그인**
2. 계정 대시보드로 **이동**
3. API Keys에서 **Client Key 생성**
4. Client Key **복사**
5. 앱 헤더의 **톱니바퀴 아이콘** (⚙️)을 눌러 **Open API Settings** 열기
6. Client Key를 **붙여넣고** **Test Connection**으로 연결 확인
7. 설정 **저장**

> **💡 팁**: “Remember Me”를 켜면 암호화된 로컬 스토리지에 API 키를 저장하여 다음 세션에서도 사용할 수 있습니다. 공용 기기에서는 안전을 위해 이 옵션을 선택하지 마세요.

> **🔑 API 크레딧**: 이미지와 동영상을 생성하려면 충분한 API 크레딧이 필요합니다. 필요한 경우 [flaq.ai](https://flaq.ai)에서 충전하세요.

## 사용 방법

### 개발

```bash
# 개발 서버 시작 (Turbopack으로 핫 리로드 가속)
pnpm dev:turbo

# 또는 기본 개발 명령 사용
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

### 코드 검사 및 서식 정리

```bash
# ESLint 실행
pnpm lint

# 검사 문제 자동 수정
pnpm lint:fix

# Prettier로 코드 서식 정리
pnpm prettier

# TypeScript 타입 검사
pnpm ts-check
```

## AIGC 기능

[Flaq.ai](https://flaq.ai) API를 기반으로 개별 생성 페이지, 공통 제작 도구, 무한 캔버스를 함께 제공합니다.

| 기능 | 경로 | 설명 |
| ---- | ---- | ---- |
| **텍스트로 이미지 생성** | `/text-to-image/` | 텍스트 프롬프트로 이미지 생성 |
| **이미지로 이미지 생성** | `/image-to-image/` | 프롬프트와 참조 이미지로 이미지 편집 |
| **텍스트로 동영상 생성** | `/text-to-video/` | 텍스트 프롬프트로 동영상 생성 |
| **이미지로 동영상 생성** | `/image-to-video/` | 이미지로 동영상 생성, 지원 모델에서 마지막 프레임 설정 가능 |
| **참조 자료로 동영상 생성** | `/reference-to-video/` | 참조 입력을 준비한 뒤 AI Media Creator에서 생성 계속 |
| **가상 피팅** | `/virtual-try-on/` | 인물 사진과 의류 이미지를 조합하여 착용 모습 미리 보기 |
| **AI Media Creator** | `/ai-media-creator/` | 한 작업 공간에서 이미지·동영상 생성 및 생성 기록 조회 |
| **AI Canvas** | `/ai-canvas/` | 연결된 시각적 작업 흐름 제작 및 캔버스 프로젝트 관리 |

모델 정의는 `lib/constants/template-models/`에 있으며 제공업체와 미디어 유형별로 나뉩니다. 이미지 모델에는 Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0, Seedream 5.0 등이 있습니다. 동영상 모델에는 Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0, Vidu Q3 등이 있습니다. 사용 가능한 입력과 매개변수는 선택한 모델에 따라 달라지며 각 양식은 해당 모델 설정을 사용합니다.

가상 피팅은 별도로 GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit, Seedream 4.5 Edit를 선택할 수 있습니다.

### AI Media Creator

`/ai-media-creator/`에서 이미지·동영상 생성을 전환하고 모델 선택, 입력 추가, 지원 매개변수 설정을 할 수 있습니다. 참조 자료 기반 동영상 생성은 모델에 따라 이미지, 동영상, 오디오, 문서, 링크를 지원하며 프롬프트 편집기에서 참조 자료를 지정할 수 있습니다.

생성 상태는 자동으로 폴링하며 결과는 제작 도구의 기록에 표시됩니다. 이미지·동영상 기록은 현재 브라우저의 로컬 스토리지에 저장됩니다.

### AI Canvas

`/ai-canvas/`에서 시작하고 `/ai-canvas/projects/`에서 저장된 프로젝트를 관리하며 `/ai-canvas/{projectId}/`에서 개별 프로젝트를 엽니다. 캔버스 시작 양식은 선택한 생성 설정과 입력으로 프로젝트를 준비합니다.

- 무한 캔버스에서 미디어와 생성 노드를 배치하고 연결
- 설정된 API 연결로 이미지와 동영상 생성
- IndexedDB에 프로젝트를 로컬로 저장하고 프로젝트 대시보드에서 다시 열기
- 프로젝트 이름 변경, 삭제, 가져오기 및 내보내기 지원. 프로젝트 미디어가 포함된 ZIP 파일도 지원

프로젝트는 현재 브라우저와 사이트 오리진에 속하며 계정 기반 동기화는 제공하지 않습니다. 브라우저 데이터를 지우거나 다른 기기·도메인으로 이동하기 전에 프로젝트를 내보내 이동 가능한 사본을 보관하세요.

## Flaq.ai 제휴 프로그램

공개 랜딩 페이지와 생성 페이지에는 번역된 [Flaq.ai 제휴 프로그램](https://flaq.ai/ko/affiliate-program?utm_source=flaq-saas-template) 안내가 포함됩니다. 버튼은 해당 언어의 Flaq.ai 페이지를 열며 유입 경로 추적을 위한 `utm_source=flaq-saas-template`을 포함합니다.

추천 사용자의 첫 유효 유료 주문에서 20%, 가입 후 60일 이내의 후속 유효 유료 주문에서 10%의 커미션을 받을 수 있습니다. 자격 및 지급 기준은 프로그램 페이지의 최신 약관을 따릅니다.

## 국제화

기본으로 **15개 언어**를 지원합니다. 영어(기본), 일본어, 인도네시아어, 이탈리아어, 브라질 포르투갈어, 스페인어, 독일어, 러시아어, 프랑스어, 중국어 간체, 중국어 번체, 한국어, 태국어, 베트남어, 아랍어입니다.

- 번역 파일은 `messages/`에 있으며 언어마다 JSON 파일 하나를 사용
- 브라우저의 `Accept-Language` 헤더로 언어 자동 감지
- 푸터 또는 언어 대화 상자에서 수동 전환 가능
- 영어는 `/`, 다른 언어는 `/{locale}/` 사용 (예: `/ja/`, `/zh/`)
- 아랍어 페이지는 자동으로 오른쪽에서 왼쪽 방향 사용

언어 추가 방법:

1. `i18n/languages.ts`에 언어 추가
2. `messages/`에 새 번역 파일 생성
3. 기존 키 구조에 맞춰 해당 언어의 페이지 문구 및 `Metadata` 번역 추가

## SEO 및 AI 크롤러 탐색

공개 랜딩 페이지와 생성 페이지는 번역된 제목·설명, 절대 canonical URL, 15개 언어의 `hreflang`, Open Graph, Twitter 카드, index/follow 지시문을 사용합니다. 생성된 `/sitemap.xml`은 모든 언어의 홈페이지, 기능 경로, 정책 페이지와 해당 언어 대체 링크를 포함합니다. 개별 로컬 캔버스 프로젝트 URL은 포함하지 않습니다.

- `/robots.txt`는 검색 엔진과 AI 도우미의 공개 콘텐츠 크롤링을 허용하며 API와 콜백 경로는 차단
- `/llms.txt`는 제품, 페이지, 언어, 문서, 정책을 간결한 구조로 안내
- `/llms-full.txt`는 상세한 프로젝트 배경, 기능, 설정 방법, 구조, 사용 범위를 제공
- JSON-LD는 검증할 수 없는 평점 없이 웹사이트와 MIT 라이선스의 오픈 소스 저장소를 식별

배포 전에 `NEXT_PUBLIC_SITE_URL`을 프로덕션 오리진으로 설정하여 canonical, 사이트맵, LLM 리소스 URL이 올바른 도메인을 사용하도록 하세요.

## 프로젝트 구조

```
.
├── app/                     # Next.js App Router 페이지
│   ├── [locale]/           # 국제화 경로 (15개 언어)
│   │   ├── (with-footer)/  # 푸터 포함 레이아웃
│   │   │   ├── (home)/     # 랜딩 페이지
│   │   │   └── (ai-features)/ # AIGC 기능 페이지
│   │   └── (without-footer)/ # AI Canvas 시작, 대시보드, 편집기
│   ├── api/                # API 경로 (이미지 프록시, 업로드)
│   ├── robots.ts           # Robots.txt 생성
│   ├── sitemap.ts          # 동적 사이트맵 생성
│   ├── llms.txt/           # AI용 간결한 사이트 안내
│   └── llms-full.txt/      # AI용 상세 프로젝트 정보
├── components/             # 재사용 가능한 React 컴포넌트
│   ├── infinite-canvas/    # 캔버스 편집기, 대시보드, 통합, 로컬 저장
│   ├── unified-generator/  # 공통 이미지·동영상 양식 및 생성 기록
│   ├── ui/                 # Radix 기반 shadcn/ui 스타일 컴포넌트
│   ├── dialog/             # 대화 상자 (API 설정 등)
│   ├── layout/             # 헤더, 푸터, 사이드바
│   └── ...                 # 기능별 컴포넌트
├── hooks/                  # 사용자 정의 React Hooks
├── i18n/                   # 국제화 설정
│   ├── languages.ts        # 지원 언어 정의
│   ├── request.ts          # next-intl 요청 설정
│   └── routing.ts          # 언어 라우팅 설정
├── lib/                    # 유틸리티 라이브러리
│   ├── seo/                # 메타데이터, llms.txt, 크롤러 도우미
│   ├── constants/          # 앱 상수, 제공업체 모델 정의, 탐색 메뉴
│   ├── utils/              # 유틸리티 함수
│   └── env.ts              # 환경 변수 도우미
├── messages/               # 언어별 번역 파일
├── network/                # API 클라이언트 및 네트워크 도구
│   ├── clientFetch.ts      # 인증 기능이 있는 Flaq.ai API 클라이언트
│   ├── image/              # 이미지 생성 API 호출
│   ├── video/              # 동영상 생성 API 호출
│   ├── local-history.ts    # 브라우저 로컬 생성 기록
│   ├── task-polling.ts     # 공통 생성 상태 폴링
│   └── upload/             # Flaq 파일 업로드 클라이언트
├── public/                 # 정적 자산 (이미지, 아이콘, 글꼴)
├── store/                  # Zustand 상태 저장소
├── next.config.mjs         # Next.js 설정
├── proxy.ts                # 미들웨어 프록시 (국제화 및 IP 전달)
└── tsconfig.json           # TypeScript 설정
```

## 배포

가장 간단한 방법은 [Vercel](https://vercel.com)을 통한 배포입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. 저장소를 GitHub에 푸시
2. Vercel에서 프로젝트 가져오기
3. Vercel 프로젝트 설정에서 `NEXT_PUBLIC_SITE_URL`을 프로덕션 오리진으로 설정하고 연락처 이메일 지정
4. 자체 R2 사용 시 서버 측 `R2_*` 변수 4개를 추가하고 앱에서 공개 도메인 설정
5. 배포

업로드와 이미지 프록시에 서버 경로를 사용하므로 Next.js 서버 런타임이 필요합니다. Node.js로 자체 호스팅할 때는 `pnpm build` 후 `pnpm start`를 실행하세요. 현재 Next.js 설정은 빌드 중 TypeScript 오류 검사를 건너뛰므로 배포 전에 `pnpm ts-check`를 별도로 실행하세요.

## 라이선스

이 프로젝트는 [MIT License](LICENSE)로 공개됩니다.
