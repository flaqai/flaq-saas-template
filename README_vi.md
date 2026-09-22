# Flaq SaaS Template (Tiếng Việt)

Mẫu SaaS miễn phí và mã nguồn mở để xây dựng nền tảng tạo ảnh, video AI bằng API [Flaq.ai](https://flaq.ai). Bao gồm công cụ tạo ảnh và video hợp nhất, quy trình tạo video từ nội dung tham chiếu và khung vẽ AI vô hạn với tính năng quản lý dự án cục bộ.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Các ngôn ngữ README khớp với `i18n/languages.ts`, nên mỗi ngôn ngữ giao diện đều có phần giới thiệu dự án tương ứng.

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ](#công-nghệ)
- [Bắt đầu](#bắt-đầu)
  - [Yêu cầu](#yêu-cầu)
  - [Cài đặt](#cài-đặt)
  - [Biến môi trường](#biến-môi-trường)
  - [Tải tệp lên](#tải-tệp-lên)
  - [Thiết lập khóa API Flaq.ai](#thiết-lập-khóa-api-flaqai)
- [Sử dụng](#sử-dụng)
  - [Phát triển](#phát-triển)
  - [Bản dựng](#bản-dựng)
  - [Kiểm tra và định dạng](#kiểm-tra-và-định-dạng)
- [Khả năng AIGC](#khả-năng-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Chương trình tiếp thị liên kết Flaq.ai](#chương-trình-tiếp-thị-liên-kết-flaqai)
- [Quốc tế hóa](#quốc-tế-hóa)
- [SEO và khả năng khám phá của trình thu thập AI](#seo-và-khả-năng-khám-phá-của-trình-thu-thập-ai)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Triển khai](#triển-khai)
- [Giấy phép](#giấy-phép)

## Tính năng

- 🎨 **Văn bản thành ảnh** — Tạo ảnh từ lời nhắc bằng các mô hình AI tiên tiến
- 🖼️ **Ảnh thành ảnh** — Biến ảnh hiện có thành các biến thể sáng tạo với phong cách nhất quán
- 🎬 **Văn bản thành video** — Tạo video chất lượng cao từ mô tả văn bản
- 📹 **Ảnh thành video** — Chuyển ảnh tĩnh thành video sinh động
- 🧩 **AI Media Creator** — Tạo ảnh và video bằng biểu mẫu chung với điều khiển theo từng mô hình
- 🎞️ **Video từ nội dung tham chiếu** — Dùng ảnh, video, âm thanh, tài liệu hoặc liên kết tùy khả năng của mô hình
- 🗂️ **AI Canvas** — Kết nối các nút nội dung và tạo nội dung trên khung vẽ vô hạn, lưu dự án cục bộ, nhập và xuất tệp ZIP
- 👗 **Thử đồ ảo** — Trải nghiệm thử trang phục bằng AI
- 🌐 **Quốc tế hóa** — 15 ngôn ngữ đồng bộ với Flaq.ai, hỗ trợ định tuyến theo ngôn ngữ và liên kết SEO thay thế
- 🚀 **Không cần đăng ký ứng dụng** — Khám phá, sửa đổi và tự lưu trữ mẫu mà không cần tạo tài khoản ứng dụng
- 🤝 **Tiếp thị liên kết** — Khối giới thiệu chương trình Flaq.ai thích ứng với màn hình, có nội dung và liên kết theo ngôn ngữ
- 🔒 **Bảo vệ khóa API** — Lưu thông tin xác thực Flaq.ai được mã hóa ở phía máy khách
- ☁️ **Tải tệp lên** — Dùng khóa API Flaq hoặc bộ lưu trữ Cloudflare R2 của bạn
- 📱 **Giao diện thích ứng** — Xây dựng bằng Tailwind CSS và Radix UI
- 🌓 **Chế độ tối** — Giao diện tối có sẵn
- ⚡ **Hiệu năng nhanh** — Next.js 16 hỗ trợ Turbopack
- 🔍 **Tối ưu SEO** — Metadata động, Open Graph, sitemap và dữ liệu có cấu trúc
- 🤖 **Hỗ trợ trình thu thập AI** — `llms.txt`, `llms-full.txt` mở rộng và quyền truy cập nội dung công khai

## Công nghệ

| Hạng mục | Công nghệ |
| --- | --- |
| Khung phát triển | [Next.js 16](https://nextjs.org/) (App Router) |
| Ngôn ngữ | [TypeScript](https://www.typescriptlang.org/) |
| Thư viện giao diện | [React 19](https://react.dev/) |
| Định kiểu | [Tailwind CSS v4](https://tailwindcss.com/) |
| Thư viện thành phần | [Radix UI](https://www.radix-ui.com/) |
| Hiệu ứng chuyển động | [Framer Motion](https://www.framer.com/motion/) |
| Biểu mẫu | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Quản lý trạng thái | [Zustand](https://zustand.docs.pmnd.rs/) |
| Truy xuất dữ liệu | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| Quốc tế hóa | [next-intl](https://next-intl-docs.vercel.app/) |
| Biểu tượng | [Lucide React](https://lucide.dev/) |
| Biểu đồ | [Recharts](https://recharts.org/) |
| Quản lý gói | [pnpm](https://pnpm.io/) |
| Kiểm tra mã | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Bắt đầu

### Yêu cầu

- **Node.js 22**, phiên bản được chỉ định trong `.nvmrc`
- **pnpm 10.5.2**, được cố định trong trường `packageManager` của `package.json`
- Tài khoản [Flaq.ai](https://flaq.ai/vi/) có khóa API hoạt động

### Cài đặt

```bash
# 1. Sao chép kho mã
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template
# 2. Cài pnpm nếu chưa có
npm install -g pnpm@10.5.2
# 3. Cài các gói phụ thuộc
pnpm install
# 4. Sao chép tệp mẫu biến môi trường
cp .env.example .env.local
```

### Biến môi trường

Chỉnh sửa `.env.local` với các biến sau:

```bash
# URL trang web dùng cho metadata, sitemap và Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# Email liên hệ hiển thị ở chân trang
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"
# Tùy chọn: Cloudflare R2 riêng, chỉ lưu thông tin xác thực trên máy chủ
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Tải tệp lên

Mặc định, ứng dụng dùng API URL và Client Key trong **Open API Settings**. Để dùng Cloudflare R2 riêng, đặt `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` và `R2_BUCKET_NAME` trên máy chủ, sau đó nhập tên miền công khai vào **Image Hosting (R2)** trong hộp thoại cài đặt và lưu. Chỉ lưu thông tin xác thực R2 trên máy chủ. Dùng **Test R2 Connection** để kiểm tra cấu hình.

Khi có tên miền công khai, ứng dụng ưu tiên tải lên R2. Xóa tên miền và lưu để quay lại tải lên Flaq. Lỗi của bộ lưu trữ riêng được hiển thị mà không tự chuyển sang Flaq.

Với Flaq, ứng dụng lấy URL tải lên qua `POST /api/v1/files/presignedUrl`, rồi tải trực tiếp từng tệp bằng `PUT`. Mỗi yêu cầu hỗ trợ tối đa 10 tệp; số lượng lớn hơn được chia thành các đợt liên tiếp, chẳng hạn 14 tệp thành 10 và 4. Mỗi đợt được tải ngay sau khi nhận URL vì URL hết hạn sau 60 giây. Các URL công khai trả về được dùng trong yêu cầu tạo nội dung.

### Thiết lập khóa API Flaq.ai

1. Đăng ký hoặc đăng nhập tại [flaq.ai](https://flaq.ai/vi/).
2. Mở bảng điều khiển tài khoản.
3. Tạo Client Key trong mục API Keys.
4. Sao chép Client Key.
5. Nhấn biểu tượng bánh răng (⚙️) ở đầu ứng dụng để mở **Open API Settings**.
6. Dán khóa và nhấn **Test Connection** để kiểm tra.
7. Lưu cài đặt.

> **💡 Mẹo:** bật **Remember Me** để giữ khóa qua các phiên bằng bộ nhớ cục bộ được mã hóa. Trên thiết bị dùng chung hoặc công cộng, không bật tùy chọn này.

> **🔑 Số dư API:** cần có đủ số dư để tạo ảnh và video. Nạp thêm tại [flaq.ai](https://flaq.ai/vi/) khi cần.

## Sử dụng

### Phát triển

```bash
# Khởi động máy chủ phát triển với Turbopack để HMR nhanh hơn
pnpm dev:turbo
# Hoặc dùng lệnh phát triển mặc định
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

### Bản dựng

```bash
# Tạo bản dựng sản xuất
pnpm build
# Khởi động máy chủ sản xuất
pnpm start
```

### Kiểm tra và định dạng

```bash
# Chạy ESLint
pnpm lint
# Tự sửa lỗi lint
pnpm lint:fix
# Định dạng mã bằng Prettier
pnpm prettier
# Kiểm tra kiểu TypeScript
pnpm ts-check
```

## Khả năng AIGC

Mẫu kết hợp các trang tạo nội dung chuyên biệt, công cụ tạo nội dung chung và khung vẽ vô hạn, sử dụng API [Flaq.ai](https://flaq.ai).

| Khả năng | Đường dẫn | Mô tả |
| --- | --- | --- |
| Văn bản thành ảnh | `/text-to-image/` | Tạo ảnh từ lời nhắc văn bản |
| Ảnh thành ảnh | `/image-to-image/` | Chỉnh sửa ảnh bằng lời nhắc và ảnh tham chiếu |
| Văn bản thành video | `/text-to-video/` | Tạo video từ lời nhắc văn bản |
| Ảnh thành video | `/image-to-video/` | Tạo video từ ảnh, có điều khiển khung hình kết thúc với mô hình tương thích |
| Video từ nội dung tham chiếu | `/reference-to-video/` | Chuẩn bị đầu vào tham chiếu rồi tiếp tục tạo trong AI Media Creator |
| Thử đồ ảo | `/virtual-try-on/` | Kết hợp ảnh người và ảnh trang phục để xem trước bộ đồ |
| AI Media Creator | `/ai-media-creator/` | Tạo ảnh, video và xem lịch sử trong cùng không gian làm việc |
| AI Canvas | `/ai-canvas/` | Tạo quy trình trực quan được kết nối và quản lý dự án khung vẽ |

Định nghĩa mô hình nằm trong `lib/constants/template-models/`, được nhóm theo nhà cung cấp và loại nội dung. Các mô hình ảnh gồm Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0 và Seedream 5.0. Các mô hình video gồm Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0 và Vidu Q3. Đầu vào và tham số phụ thuộc vào mô hình được chọn; mỗi biểu mẫu dùng cấu hình tương ứng.

Thử đồ ảo có lựa chọn mô hình riêng: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit và Seedream 4.5 Edit.

### AI Media Creator

Dùng `/ai-media-creator/` để chuyển giữa tạo ảnh và video, chọn mô hình, thêm đầu vào và cấu hình tham số được hỗ trợ. Tạo video từ nội dung tham chiếu hỗ trợ ảnh, video, âm thanh, tài liệu và liên kết khi mô hình cho phép, với khả năng nhắc đến tham chiếu trong trình soạn lời nhắc.

Trạng thái tạo nội dung được kiểm tra tự động; kết quả xuất hiện trong lịch sử. Lịch sử ảnh và video được lưu trong bộ nhớ cục bộ của trình duyệt hiện tại.

### AI Canvas

Bắt đầu tại `/ai-canvas/`, quản lý dự án đã lưu tại `/ai-canvas/projects/` và mở dự án riêng tại `/ai-canvas/{projectId}/`. Biểu mẫu ban đầu chuẩn bị dự án từ cài đặt tạo nội dung và đầu vào đã chọn.

- Sắp xếp và kết nối các nút nội dung và tạo nội dung trên khung vẽ vô hạn
- Tạo ảnh và video qua kết nối API đã cấu hình
- Lưu dự án cục bộ trong IndexedDB và mở lại từ bảng điều khiển dự án
- Đổi tên, xóa, nhập và xuất dự án, bao gồm tệp ZIP chứa nội dung của dự án

Dự án thuộc về trình duyệt và origin trang web hiện tại; không có đồng bộ dự án theo tài khoản. Hãy xuất bản sao có thể di chuyển trước khi xóa dữ liệu trình duyệt hoặc đổi thiết bị hay tên miền.

## Chương trình tiếp thị liên kết Flaq.ai

Các trang giới thiệu và tạo nội dung công khai có khối quảng bá theo ngôn ngữ cho [Chương trình tiếp thị liên kết Flaq.ai](https://flaq.ai/vi/affiliate-program?utm_source=flaq-saas-template). Nút kêu gọi hành động mở trang Flaq.ai đúng ngôn ngữ và có `utm_source=flaq-saas-template` để xác định nguồn truy cập.

Theo điều khoản hiện hành, bạn có thể nhận hoa hồng 20% từ đơn trả phí hợp lệ đầu tiên của người được giới thiệu và 10% từ các đơn trả phí hợp lệ tiếp theo trong vòng 60 ngày sau khi họ đăng ký. Điều kiện tham gia và thanh toán tuân theo quy định trên trang chương trình.

## Quốc tế hóa

Hỗ trợ sẵn **15 ngôn ngữ**: tiếng Anh (mặc định), Nhật, Indonesia, Ý, Bồ Đào Nha Brazil, Tây Ban Nha, Đức, Nga, Pháp, Trung giản thể, Trung phồn thể, Hàn, Thái, Việt và Ả Rập.

- Tệp dịch nằm trong `messages/`, mỗi ngôn ngữ một tệp JSON
- Ngôn ngữ được phát hiện qua header `Accept-Language` của trình duyệt
- Người dùng có thể đổi ngôn ngữ ở chân trang hoặc hộp thoại ngôn ngữ
- Tiếng Anh dùng `/`, các ngôn ngữ khác dùng `/{locale}/`, ví dụ `/ja/` hoặc `/zh/`
- Trang tiếng Ả Rập tự động hiển thị từ phải sang trái

Để thêm ngôn ngữ:

1. Thêm locale vào `i18n/languages.ts`.
2. Tạo tệp dịch trong `messages/`.
3. Thêm nội dung trang và bản dịch `Metadata` theo cấu trúc khóa hiện có.

## SEO và khả năng khám phá của trình thu thập AI

Các trang công khai dùng tiêu đề và mô tả theo ngôn ngữ, URL canonical tuyệt đối, liên kết `hreflang` cho 15 ngôn ngữ, Open Graph, Twitter card và chỉ thị index/follow. `/sitemap.xml` bao gồm trang chủ, các trang tính năng và chính sách ở mọi ngôn ngữ cùng liên kết thay thế tương ứng. URL của từng dự án khung vẽ cục bộ không được đưa vào.

- `/robots.txt` cho phép công cụ tìm kiếm và trợ lý AI thu thập nội dung công khai, đồng thời chặn các đường dẫn API và callback
- `/llms.txt` cung cấp bản đồ ngắn gọn, có cấu trúc về sản phẩm, trang, ngôn ngữ, tài liệu và chính sách
- `/llms-full.txt` cung cấp thêm bối cảnh dự án, khả năng, hướng dẫn thiết lập, kiến trúc và giới hạn sử dụng
- JSON-LD mô tả trang web và kho mã nguồn mở theo giấy phép MIT, không có điểm đánh giá không thể xác minh

Đặt `NEXT_PUBLIC_SITE_URL` thành origin sản xuất trước khi triển khai để URL canonical, sitemap và tài nguyên LLM dùng đúng tên miền.

## Cấu trúc dự án

```text
.
├── app/                     # Các trang Next.js App Router
│   ├── [locale]/            # Định tuyến cho 15 ngôn ngữ
│   │   ├── (with-footer)/   # Các trang có chân trang
│   │   │   ├── (home)/      # Trang giới thiệu
│   │   │   └── (ai-features)/ # Các tính năng AIGC
│   │   └── (without-footer)/ # Trang đầu, bảng dự án và trình chỉnh sửa AI Canvas
│   ├── api/                 # API proxy-image và upload
│   ├── robots.ts            # Tạo robots.txt
│   ├── sitemap.ts           # Tạo sitemap động
│   ├── llms.txt/            # Bản đồ trang ngắn gọn cho AI
│   └── llms-full.txt/       # Bối cảnh dự án mở rộng cho AI
├── components/              # Thành phần React tái sử dụng
│   ├── infinite-canvas/     # Trình chỉnh sửa, bảng dự án, tích hợp và lưu trữ cục bộ
│   ├── unified-generator/   # Biểu mẫu ảnh/video chung và lịch sử
│   ├── ui/                  # Thành phần kiểu shadcn/ui dựa trên Radix
│   ├── dialog/              # Hộp thoại, gồm cài đặt API
│   ├── layout/              # Đầu trang, chân trang và thanh bên
│   └── ...                  # Thành phần theo từng tính năng
├── hooks/                   # Hook React tùy chỉnh
├── i18n/                    # Cấu hình quốc tế hóa
│   ├── languages.ts         # Ngôn ngữ được hỗ trợ
│   ├── request.ts           # Cấu hình yêu cầu next-intl
│   └── routing.ts           # Định tuyến theo ngôn ngữ
├── lib/                     # Thư viện tiện ích
│   ├── seo/                 # Metadata, llms.txt và tiện ích trình thu thập
│   ├── constants/           # Hằng số, định nghĩa mô hình và điều hướng
│   ├── utils/               # Hàm tiện ích
│   └── env.ts               # Tiện ích biến môi trường
├── messages/                # Tệp dịch cho mỗi ngôn ngữ
├── network/                 # Máy khách API và tiện ích mạng
│   ├── clientFetch.ts       # Máy khách API Flaq.ai có xác thực
│   ├── image/               # Lệnh gọi API tạo ảnh
│   ├── video/               # Lệnh gọi API tạo video
│   ├── local-history.ts     # Lịch sử cục bộ trong trình duyệt
│   ├── task-polling.ts      # Kiểm tra trạng thái tạo nội dung dùng chung
│   └── upload/              # Máy khách tải tệp lên Flaq
├── public/                  # Tài nguyên tĩnh: ảnh, biểu tượng, phông chữ
├── store/                   # Kho trạng thái Zustand
├── next.config.mjs          # Cấu hình Next.js
├── proxy.ts                 # Proxy middleware cho i18n và chuyển tiếp IP
└── tsconfig.json            # Cấu hình TypeScript
```

## Triển khai

Cách đơn giản nhất là dùng [Vercel](https://vercel.com):

[![Triển khai với Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Đẩy kho mã lên GitHub.
2. Nhập dự án vào Vercel.
3. Đặt `NEXT_PUBLIC_SITE_URL` thành origin sản xuất và cấu hình email liên hệ trong cài đặt dự án Vercel.
4. Nếu dùng R2 riêng, thêm bốn biến `R2_*` phía máy chủ và cấu hình tên miền công khai trong ứng dụng.
5. Triển khai.

Ứng dụng có các đường dẫn máy chủ cho tải lên và proxy ảnh, nên cần môi trường máy chủ Next.js. Khi tự lưu trữ trên Node.js, chạy `pnpm build` rồi `pnpm start`. Chạy riêng `pnpm ts-check` trước khi triển khai vì cấu hình Next.js hiện tại bỏ qua lỗi TypeScript khi dựng ứng dụng.

## Giấy phép

Dự án được phát hành dưới dạng mã nguồn mở theo [giấy phép MIT](LICENSE).
