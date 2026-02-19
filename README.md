<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Gemini_AI-Function_Calling-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

<h1 align="center">⚡ InsightNode</h1>

<p align="center">
  <strong>AI-Powered Database Dashboard Builder</strong><br/>
  Veritabanınıza bağlanın, doğal dilde soru sorun, saniyeler içinde interaktif grafikler elde edin.
</p>

<p align="center">
  <em>Connect your database → Ask in natural language → Get beautiful, interactive charts — powered by Google Gemini.</em>
</p>

---

## 📖 İçindekiler / Table of Contents

- [Sistem Nedir?](#-sistem-nedir--what-is-insightnode)
- [Ne İşe Yarar?](#-ne-i̇şe-yarar--what-does-it-do)
- [Özellikler](#-özellikler--features)
- [Mimari ve Sistem Yapısı](#-mimari-ve-sistem-yapısı--architecture)
- [Veri Akış Diyagramı](#-veri-akış-diyagramı--data-flow)
- [Teknoloji Yığını](#-teknoloji-yığını--tech-stack)
- [Proje Yapısı](#-proje-yapısı--project-structure)
- [AI Pipeline Detayları](#-ai-pipeline-detayları)
- [Veritabanı Adapter Sistemi](#-veritabanı-adapter-sistemi)
- [Güvenlik Katmanı](#-güvenlik-katmanı--security-layer)
- [API Referansı](#-api-referansı--api-reference)
- [Kimlik Doğrulama](#-kimlik-doğrulama--authentication)
- [Uluslararasılaştırma (i18n)](#-uluslararasılaştırma-i18n)
- [Tema Sistemi](#-tema-sistemi--theming)
- [localStorage Kalıcılık Katmanı](#-localstorage-kalıcılık-katmanı)
- [Grafik Tipleri](#-grafik-tipleri--chart-types)
- [Dışa Aktarma Sistemi](#-dışa-aktarma-sistemi--export)
- [Test Altyapısı](#-test-altyapısı--testing)
- [Akıllı Öneri Sistemi](#-akıllı-öneri-sistemi--smart-suggestions)
- [Streaming Mekanizması](#-streaming-mekanizması)
- [Lisans](#-lisans)

---

## 🧠 Sistem Nedir? / What is InsightNode?

**InsightNode**, kullanıcıların teknik SQL/MongoDB bilgisi gerektirmeden veritabanlarını sorgulamalarına olanak sağlayan, yapay zeka destekli bir dashboard oluşturucu (dashboard builder) uygulamasıdır.

Kullanıcı doğal dilde bir soru sorar (örneğin _"Aylara göre satış trendini göster"_), sistem:

1. **Google Gemini AI** ile soruyu veritabanı sorgusuna (SQL veya MongoDB aggregation) çevirir
2. Sorguyu **güvenlik katmanından** geçirir (SQL injection koruması)
3. Sorguyu **gerçek veritabanında** çalıştırır
4. Sonuçları tekrar Gemini AI'ya göndererek **en uygun grafik tipini** otomatik seçtirir
5. **İnteraktif, güzel bir grafik** olarak kullanıcıya sunar

Tüm bu işlem tek bir metin kutusuna yazılan bir cümle ile, saniyeler içinde gerçekleşir.

### Temel Felsefe

| Prensip | Açıklama |
|---------|----------|
| **Sıfır SQL Bilgisi** | Kullanıcı sadece doğal dilde soru sorar |
| **Gizlilik Odaklı AI** | Gemini'ye yalnızca sütun adları + 3 örnek satır gönderilir; tüm veri sunucuda kalır |
| **Güvenlik Öncelikli** | Her AI-üretimi sorgu, çalıştırılmadan önce çok katmanlı sanitizasyondan geçer |
| **Çoklu Veritabanı** | PostgreSQL, MySQL ve MongoDB tek bir arayüzden desteklenir |
| **Gerçek Zamanlı** | Streaming (NDJSON) ile her pipeline adımı anlık takip edilir |

---

## 🎯 Ne İşe Yarar? / What Does It Do?

InsightNode şu senaryolarda kullanılır:

- **İş Analitiği**: Satış, gelir, müşteri veritabanlarını analiz edin — SQL yazmadan
- **Hızlı Veri Keşfi**: Yeni bir veritabanına bağlanıp "bu tabloda neler var?" diye sorun
- **Raporlama**: Toplantılar için hızlıca grafik oluşturun, PNG/CSV/JSON olarak dışa aktarın
- **Eğitim**: SQL öğrenmek isteyen kişiler için — soruyu yazın, oluşturulan SQL'i inceleyin
- **Multi-Turn Analiz**: "Şimdi bunu aylara göre göster", "Sadece 2024'ü filtrele" gibi takip soruları sorun

---

## ✨ Özellikler / Features

### 🤖 AI-Powered Query Engine
- Doğal dilde soru → SQL/MongoDB sorgusu dönüşümü
- Google Gemini `gemini-3-flash-preview` modeli
- **Function Calling** modu ile yapılandırılmış çıktı garantisi
- Multi-turn konuşma desteği (son 10 mesaj kontekst olarak gönderilir)

### 📊 7 Grafik Tipi
- **Bar Chart**: Karşılaştırmalar için
- **Line Chart**: Zaman serisi trendleri
- **Area Chart**: Kümülatif veriler
- **Pie Chart**: Oransal dağılımlar (donut tarzı)
- **Scatter Plot**: Korelasyon analizi
- **KPI Card**: Tek değer göstergesi (değişim yüzdesi + mini sparkline)
- **Data Table**: Sıralanabilir, sayfalanabilir veri tablosu

### 🗄️ Çoklu Veritabanı Desteği
- **PostgreSQL** (pg driver)
- **MySQL** (mysql2 driver)
- **MongoDB** (native driver — URI veya manual bağlantı)

### 📡 Streaming Pipeline
- NDJSON üzerinden gerçek zamanlı ilerleme göstergesi
- 4 adım: Generating → Validating → Executing → Charting
- Her adım animasyonlu progress bar'da gösterilir

### 🔒 Güvenlik
- SQL injection koruması (17 yasaklı anahtar kelime, INTO OUTFILE/DUMPFILE engelleme)
- MongoDB operation whitelist (sadece read-only operasyonlar)
- MySQL nested comment saldırısı tespiti
- Prompt sanitizasyonu (2000 karakter limiti)
- Sorgu uzunluk limiti (10.000 karakter)
- Şifre korumalı erişim (opsiyonel)

### 🌍 Çift Dil Desteği (i18n)
- İngilizce (EN) ve Türkçe (TR)
- Tüm arayüz metinleri, AI yönergeleri ve placeholder'lar dahil
- Tek tıkla dil değiştirme

### 🎨 Tema Sistemi
- **Dark Mode** (varsayılan) — Vercel/Linear ilhamlı
- **Light Mode** — Tam CSS değişken seti
- **System Mode** — İşletim sistemi tercihini takip eder
- localStorage ile kalıcılık

### 💾 Bağlantı Kaydetme
- Veritabanı bağlantıları localStorage'a kaydedilir
- Şifreler base64 ile maskelenir
- Sayfa yenilendiğinde aktif bağlantı otomatik geri yüklenir
- Header dropdown'dan kayıtlı bağlantılara hızlı erişim

### 📤 Dışa Aktarma
- **PNG** — html2canvas ile 2x çözünürlük
- **CSV** — BOM destekli UTF-8 (Excel uyumlu)
- **JSON** — Pretty-printed

### 💡 Akıllı Öneriler
- Bağlantı sonrası AI, şemanıza özgü 6 soru önerir
- Tıkla-çalıştır öneri chip'leri
- Fallback: Dile göre varsayılan öneriler

### 🔐 Kimlik Doğrulama
- `ADMIN_PASSWORD` env değişkeni ile aktifleşir
- httpOnly cookie tabanlı oturum (7 gün)
- Next.js Edge middleware koruması
- Ayarlanmadığında auth tamamen devre dışı

### 🧪 Test Altyapısı
- Vitest ile 61 test
- Query sanitizer güvenlik testleri (38 test case)
- Validator testleri (17+ test case)
- Path alias desteği

---

## 🏗 Mimari ve Sistem Yapısı / Architecture

InsightNode, **katmanlı mimari** (layered architecture) prensibini izler. Her katman tek bir sorumluluk taşır:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  React 19 Components (Client)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Header   │ │ CommandIn│ │ChartCard │ │EmptyState │  │
│  │  Modal    │ │ Progress │ │DynChart  │ │  Login    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                    CONTEXT LAYER                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │LanguageCtx   │ │  ThemeCtx    │ │  Providers   │    │
│  │ (i18n EN/TR) │ │ (dark/light) │ │  (compose)   │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────┤
│                    API LAYER (Server)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │/api/query│ │/api/conn │ │/api/sugg │ │ /api/auth │  │
│  │(stream)  │ │(test+sch)│ │(AI sug.) │ │ (login)   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                         │
│  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐  │
│  │ QueryGenerator │ │ChartFormatter  │ │SuggestionGen│  │
│  │ (Text→SQL)     │ │(Data→ChartCfg) │ │(Schema→Tips)│  │
│  └────────────────┘ └────────────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    AI LAYER                              │
│  ┌────────────────┐ ┌──────────────────────────────┐    │
│  │ GeminiClient   │ │ FunctionDeclarations (3 tool)│    │
│  │ (singleton)    │ │ execute_query / render_chart  │    │
│  │                │ │ suggest_queries               │    │
│  └────────────────┘ └──────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│                  SECURITY LAYER                          │
│  ┌────────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │QuerySanitizer  │ │ Validators  │ │  Middleware     │  │
│  │(SQL/Mongo)     │ │ (form+prompt│ │  (auth guard)  │  │
│  └────────────────┘ └─────────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                  DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           DatabaseAdapter (Interface)             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │PostgreSQL│  │  MySQL   │  │   MongoDB    │   │   │
│  │  │ (pg)     │  │ (mysql2) │  │ (native)     │   │   │
│  │  └──────────┘  └──────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                  STORAGE LAYER (Client)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │Connections│ │ChatHistory│ │Dashboards│                │
│  │(localStorage│(localStorage│(localStorage             │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

### Tasarım Kalıpları (Design Patterns)

| Kalıp | Uygulama |
|-------|----------|
| **Adapter Pattern** | `DatabaseAdapter` interface + 3 concrete implementation (PG, MySQL, MongoDB) + factory function |
| **Function Calling (Structured Output)** | Gemini AI, `FunctionCallingConfigMode.ANY` ile her zaman yapılandırılmış JSON döner |
| **Streaming (NDJSON)** | `ReadableStream` server-side, `ReadableStreamDefaultReader` client-side |
| **Context Pattern** | Theme + Language React Context'leri cascading provider'lar ile |
| **Barrel Exports** | Her modül `index.ts` ile re-export |
| **Privacy-Preserving AI** | Chart formatter yalnızca sütun adları + 3 örnek satır gönderir — tam veri seti asla AI'ya gitmez |
| **Security-First** | AI çıktısı → Sanitizer → Veritabanı sıralaması ile hiçbir AI-üretimi sorgu doğrudan çalışmaz |
| **Composition over Inheritance** | Radix UI primitives → shadcn wrappers → domain components → page assembly |

---

## 🔄 Veri Akış Diyagramı / Data Flow

```
Kullanıcı: "Aylık satış toplamlarını göster"
        │
        ▼
┌─ CommandInput ─────────────────────────────┐
│  onSubmit(prompt)                          │
│  → page.tsx handleQuerySubmit()            │
│  → chatHistory'ye "user" mesajı ekle       │
│  → POST /api/query { streaming: true }     │
└────────────────────┬───────────────────────┘
                     │
    ═══════════════ SERVER ═══════════════
                     │
                     ▼
┌─ /api/query (ReadableStream) ──────────────┐
│                                            │
│  ① NDJSON: {"step":"generating"}           │
│     sanitizePrompt(prompt)                 │
│     createDatabaseAdapter(connection)      │
│     adapter.connect()                      │
│     adapter.getSchema()                    │
│     generateQuery(prompt, schema,          │
│       dbType, locale, conversationHistory) │
│       └─→ Gemini AI (Function Calling)     │
│           Tool: execute_database_query     │
│           ← { query_string, query_type }   │
│                                            │
│  ② NDJSON: {"step":"validating"}           │
│     sanitizeSQLQuery(query_string)         │
│     • 10.000 karakter limiti               │
│     • Yorum satırları temizleme            │
│     • 17 yasaklı anahtar kelime kontrolü   │
│     • INTO OUTFILE/DUMPFILE engelleme      │
│     • MySQL nested comment tespiti         │
│     • SELECT/WITH ile başlama zorunluluğu  │
│                                            │
│  ③ NDJSON: {"step":"executing"}            │
│     adapter.executeQuery(sanitizedQuery)   │
│     ← { rows[], columns[], rowCount, ms } │
│                                            │
│  ④ NDJSON: {"step":"charting"}             │
│     formatChart(rows, columns, prompt)     │
│       └─→ Gemini AI (Function Calling)     │
│           Input: sütun adları + 3 satır    │
│           Tool: render_chart               │
│           ← { chart_type, title, colors }  │
│                                            │
│  ⑤ NDJSON: {"step":"done","data":{...}}    │
│     adapter.disconnect()                   │
│     controller.close()                     │
└────────────────────┬───────────────────────┘
                     │
    ═══════════════ CLIENT ═══════════════
                     │
                     ▼
┌─ page.tsx (Stream Reader) ─────────────────┐
│  reader.read() → NDJSON satırları parse    │
│  Her "step" → QueryProgress animasyon      │
│  "done" → charts[] state'e prepend         │
│  chatHistory'ye "assistant" mesajı ekle     │
│  Toast bildirimi göster                    │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌─ ChartCard → DynamicChart ─────────────────┐
│  chartType'a göre dispatch:                │
│  bar → <BarChart>    pie → <PieChart>      │
│  line → <LineChart>  scatter → <Scatter>   │
│  area → <AreaChart>  kpi → KPI bileşeni    │
│                      table → DataTable     │
│                                            │
│  + Export toolbar (PNG/CSV/JSON)           │
│  + SQL sorgu görüntüleme                   │
│  + Silme butonu                            │
└────────────────────────────────────────────┘
```

---

## 🛠 Teknoloji Yığını / Tech Stack

### Runtime Dependencies

| Paket | Versiyon | Rol |
|-------|----------|-----|
| `next` | `^16.0.0` | React meta-framework (App Router, API routes, middleware) |
| `react` | `^19.0.0` | UI kütüphanesi |
| `react-dom` | `^19.0.0` | React DOM renderer |
| `@google/genai` | `^1.41.0` | Google Gemini AI SDK (Function Calling) |
| `recharts` | `^3.7.0` | Grafik kütüphanesi (Bar, Line, Area, Pie, Scatter) |
| `framer-motion` | `^12.34.0` | Animasyon kütüphanesi |
| `pg` | `^8.13.0` | PostgreSQL client driver |
| `mysql2` | `^3.12.0` | MySQL client driver (promise-based) |
| `mongodb` | `^6.12.0` | MongoDB native driver |
| `sonner` | `^2.0.0` | Toast bildirimleri |
| `class-variance-authority` | `^0.7.1` | Variant tabanlı bileşen stillendirme |
| `clsx` | `^2.1.1` | Koşullu CSS class birleştirme |
| `tailwind-merge` | `^3.0.0` | Tailwind class çakışma çözümleyici |
| `lucide-react` | `^0.474.0` | İkon seti (200+ ikon) |
| `@radix-ui/*` | Çeşitli | Erişilebilir UI primitifleri (Dialog, Tabs, Label, Select) |
| `html2canvas` | `^1.4.1` | DOM → Canvas çevirici (PNG export) |

### Dev Dependencies

| Paket | Versiyon | Rol |
|-------|----------|-----|
| `typescript` | `^5.7.0` | Tip sistemi |
| `tailwindcss` | `^4.0.0` | Utility-first CSS framework (v4) |
| `@tailwindcss/postcss` | `^4.0.0` | Tailwind v4 PostCSS entegrasyonu |
| `vitest` | `^3.2.0` | Test runner |
| `eslint` | `^9.0.0` | Linter (flat config) |
| `eslint-config-next` | `^16.0.0` | Next.js ESLint kuralları |

---

## 📁 Proje Yapısı / Project Structure

```
InsightNode/
├── .env.local                          # Ortam değişkenleri (GEMINI_API_KEY, ADMIN_PASSWORD)
├── .gitignore                          # Git ignore kuralları
├── package.json                        # Bağımlılıklar ve script'ler
├── tsconfig.json                       # TypeScript yapılandırması (@/* alias)
├── next.config.mjs                     # Next.js yapılandırması
├── vitest.config.ts                    # Vitest test runner yapılandırması
├── eslint.config.mjs                   # ESLint flat config
├── postcss.config.mjs                  # PostCSS + Tailwind v4
├── README.md                           # Bu dosya
├── SERVER.md                           # Kurulum ve çalıştırma kılavuzu
│
└── src/
    ├── middleware.ts                    # Auth middleware (Edge runtime)
    │
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout (<html>, <body>, Providers, Toaster)
    │   ├── providers.tsx               # ThemeProvider → LanguageProvider composition
    │   ├── globals.css                 # Tailwind v4 + dark/light CSS değişkenleri
    │   ├── page.tsx                    # ⭐ Ana dashboard sayfası (state orchestrator)
    │   ├── login/
    │   │   └── page.tsx                # Şifre giriş sayfası
    │   └── api/
    │       ├── auth/route.ts           # POST: login, DELETE: logout
    │       ├── connections/route.ts    # POST: test & connect + şema çıkarma
    │       ├── query/route.ts          # POST: tam AI pipeline (streaming/standard)
    │       ├── schema/route.ts         # POST: sadece şema çıkarma
    │       └── suggestions/route.ts   # POST: AI öneri üretme
    │
    ├── components/
    │   ├── charts/
    │   │   ├── chart-card.tsx          # Grafik kartı (metadata + export + silme)
    │   │   └── dynamic-chart.tsx       # 7-tip grafik renderer (Recharts + custom)
    │   ├── dashboard/
    │   │   ├── header.tsx              # Üst bar (bağlantı, tema, dil, logout)
    │   │   ├── command-input.tsx       # Doğal dil sorgu giriş alanı + öneri chip'leri
    │   │   ├── empty-state.tsx         # Boş durum ekranı + AI önerileri
    │   │   ├── connection-modal.tsx    # Veritabanı bağlantı dialog'u (3 DB tipi)
    │   │   └── query-progress.tsx      # 4-adım pipeline progress göstergesi
    │   └── ui/                         # shadcn/Radix UI primitifleri
    │       ├── badge.tsx               # Badge bileşeni (6 variant)
    │       ├── button.tsx              # Button bileşeni (6 variant, 4 size)
    │       ├── dialog.tsx              # Dialog bileşeni (Radix)
    │       ├── input.tsx               # Input bileşeni
    │       ├── label.tsx               # Label bileşeni (Radix)
    │       └── tabs.tsx                # Tabs bileşeni (Radix)
    │
    ├── lib/
    │   ├── utils.ts                    # cn() — clsx + tailwind-merge
    │   ├── ai/
    │   │   ├── gemini-client.ts        # Gemini AI singleton + generateWithTools()
    │   │   └── function-declarations.ts # 3 Function Declaration (query, chart, suggest)
    │   ├── db/
    │   │   ├── index.ts                # createDatabaseAdapter() factory
    │   │   ├── postgres.ts             # PostgresAdapter (pg.Pool)
    │   │   ├── mysql.ts                # MySQLAdapter (mysql2/promise)
    │   │   └── mongodb-client.ts       # MongoDBAdapter (MongoClient)
    │   ├── i18n/
    │   │   ├── index.ts                # Barrel export
    │   │   ├── translations.ts         # Translations interface + EN/TR nesneleri (80+ key)
    │   │   └── language-context.tsx     # LanguageProvider + useLanguage() hook
    │   ├── theme/
    │   │   ├── index.ts                # Barrel export
    │   │   └── theme-context.tsx        # ThemeProvider + useTheme() hook
    │   └── storage/
    │       ├── index.ts                # Barrel export
    │       ├── connections.ts          # Bağlantı CRUD (localStorage)
    │       ├── chat-history.ts         # Konuşma geçmişi (max 20 mesaj)
    │       └── dashboard.ts            # Dashboard kaydetme/yükleme
    │
    ├── services/
    │   ├── query-generator.ts          # AI Adım 1: Text → SQL/MongoDB sorgusu
    │   ├── chart-formatter.ts          # AI Adım 2: Data → ChartConfig
    │   └── suggestion-generator.ts     # AI: Şema → Akıllı soru önerileri
    │
    ├── types/
    │   ├── api.ts                      # ApiResponse<T>, ConversationMessage
    │   ├── chart.ts                    # ChartType, ChartConfig, DashboardQueryResponse
    │   └── database.ts                 # DatabaseAdapter interface, tüm DB tipleri
    │
    └── utils/
        ├── query-sanitizer.ts          # SQL/MongoDB sorgu güvenlik sanitizasyonu
        ├── validators.ts               # Form doğrulama + prompt sanitizasyonu
        ├── export.ts                   # PNG/CSV/JSON dışa aktarma
        └── __tests__/
            ├── query-sanitizer.test.ts # 38 güvenlik test case'i
            └── validators.test.ts      # 17+ doğrulama test case'i
```

---

## 🤖 AI Pipeline Detayları

InsightNode, Google Gemini'nin **Function Calling** özelliğini kullanır. Bu, AI'nın serbest metin yerine her zaman yapılandırılmış JSON döndürmesini garanti eder.

### Model
```
gemini-3-flash-preview
```

### Function Calling Modu
```typescript
toolConfig: {
    functionCallingConfig: {
        mode: FunctionCallingConfigMode.ANY  // Zorunlu function call
    }
}
```

### Adım 1: Doğal Dil → Veritabanı Sorgusu

**Service**: `src/services/query-generator.ts`

```
Kullanıcı sorusu + Veritabanı şeması + Konuşma geçmişi
                    │
                    ▼
            Gemini AI API
        Tool: execute_database_query
                    │
                    ▼
    { query_string, query_type, explanation }
```

**Prompt yapısı:**
- Sistem rolü: "Expert {PostgreSQL/MySQL/MongoDB} database analyst"
- Tam şema açıklaması (tablo adları, sütun adları/tipleri/nullability)
- Son 10 konuşma mesajı (multi-turn destek)
- Dil yönergesi ("Generate explanations in Turkish")
- Detaylı kurallar: GROUP BY, JOIN, alias, LIMIT, grafik-dostu veri şekli

**Function Declaration:**
```typescript
{
    name: "execute_database_query",
    parameters: {
        query_string: STRING,    // SQL veya MongoDB JSON sorgusu
        query_type: STRING,      // "sql" | "aggregation"
        explanation: STRING      // İnsan tarafından okunabilir açıklama
    }
}
```

### Adım 2: Veri → Grafik Yapılandırması

**Service**: `src/services/chart-formatter.ts`

```
Sütun adları + 3 örnek satır + Kullanıcı sorusu
                    │
                    ▼
            Gemini AI API
            Tool: render_chart
                    │
                    ▼
    { chart_type, title, x_axis_key, data_keys, colors, kpi_* }
```

**Gizlilik**: Yalnızca sütun adları ve ilk 3 satır Gemini'ye gönderilir. Tam veri seti asla AI'ya iletilmez.

**Seçim matrisi (prompt'ta):**
- Bar → Karşılaştırmalar
- Line → Zaman trendleri
- Area → Kümülatif veriler
- Pie → Oransal dağılımlar
- Scatter → Korelasyonlar
- KPI → Tek değer sonuçları
- Table → Detaylı, çok sütunlu veriler

### Adım 3: Akıllı Öneriler

**Service**: `src/services/suggestion-generator.ts`

```
Veritabanı şeması + Dil tercihi
            │
            ▼
      Gemini AI API
    Tool: suggest_queries
            │
            ▼
    6 adet şemaya özgü soru önerisi
```

**Fallback**: Gemini başarısız olursa, dile göre 6 varsayılan genel soru döner.

---

## 🗄 Veritabanı Adapter Sistemi

InsightNode, **Adapter Pattern** kullanarak üç farklı veritabanını tek bir arayüz üzerinden destekler.

### Interface

```typescript
interface DatabaseAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getSchema(): Promise<DatabaseSchema>;
    executeQuery(query: string): Promise<QueryResult>;
    testConnection(): Promise<boolean>;
}
```

### Factory

```typescript
function createDatabaseAdapter(connection: DatabaseConnection): DatabaseAdapter {
    switch (connection.type) {
        case "postgresql": return new PostgresAdapter(connection);
        case "mysql":      return new MySQLAdapter(connection);
        case "mongodb":    return new MongoDBAdapter(connection);
    }
}
```

### Adapter Detayları

| Adapter | Driver | Bağlantı | Şema Kaynağı | Sorgu Mekanizması |
|---------|--------|----------|--------------|-------------------|
| **PostgresAdapter** | `pg.Pool` | host/port/user/pass/db/ssl, max 5 bağlantı, 30s idle timeout | `information_schema.tables` + `columns` (public schema) | `pool.query(sql)` |
| **MySQLAdapter** | `mysql2.createPool` | host/port/user/pass/db/ssl, limit 5, 10s timeout | `information_schema.TABLES` + `COLUMNS` | `pool.query<RowDataPacket[]>(sql)` |
| **MongoDBAdapter** | `MongoClient` | URI veya field-based, 10s timeout | `db.listCollections()` + `findOne()` ile sample-based | JSON parse → `collection.find()` veya `.aggregate()` |

### Yaşam Döngüsü

```
connect() → getSchema() → executeQuery() → disconnect()
```

Her API çağrısı bu döngüyü izler. `testConnection()` ise connect → trivial op → disconnect sıralamasını takip eder.

---

## 🛡 Güvenlik Katmanı / Security Layer

AI tarafından üretilen her sorgu, veritabanında çalıştırılmadan önce çok katmanlı güvenlik kontrolünden geçer.

### SQL Sanitizasyonu (`sanitizeSQLQuery`)

```
AI Çıktısı (query_string)
        │
        ▼
    ① Uzunluk kontrolü (max 10.000 karakter)
        │
        ▼
    ② MySQL nested comment tespiti (/*!50000 ...*/  engelleme)
        │
        ▼
    ③ Yorum satırları temizleme (-- ve /* */ kaldırma)
        │
        ▼
    ④ Boş sorgu kontrolü
        │
        ▼
    ⑤ Yasaklı anahtar kelime kontrolü (17 kelime):
       DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER,
       CREATE, GRANT, REVOKE, EXEC, EXECUTE, CALL,
       MERGE, REPLACE, RENAME, LOAD, SOURCE
       → Word-boundary regex (\b) ile, false-positive korumalı
        │
        ▼
    ⑥ Yasaklı pattern kontrolü:
       INTO OUTFILE, INTO DUMPFILE, INTO LOCAL,
       SET (FROM olmadan)
        │
        ▼
    ⑦ Başlangıç assertion: SELECT veya WITH ile başlamalı
        │
        ▼
    ✅ Güvenli sorgu → Veritabanına gönder
```

### MongoDB Sanitizasyonu (`sanitizeMongoOperation`)

```
Whitelist yaklaşımı:
    ✅ find, aggregate, countDocuments, estimatedDocumentCount, distinct
    ❌ deleteMany, insertOne, updateMany, drop, rename, vb.
```

### False-Positive Koruması

`\b` word boundary kullanılarak, `updated_at` sütunu "UPDATE" olarak engellenmez, `settings` tablosu "SET" olarak algılanmaz.

### Test Kapsamı

38 özel test case ile tüm saldırı vektörleri doğrulanmıştır:
- Tüm 17 yasaklı keyword
- Büyük/küçük harf varyasyonları
- Yorum satırı içine gizleme denemeleri
- Alt sorgu (subquery) içinde destructive operasyon
- `INTO OUTFILE` / `INTO DUMPFILE` / `LOAD DATA`
- MySQL conditional comment (`/*!*/`)
- Edge case'ler (boş, whitespace, max uzunluk)

---

## 📡 API Referansı / API Reference

### `POST /api/auth` — Giriş Yap

```typescript
// İstek
{ password: string }

// Başarılı Yanıt (200) — httpOnly cookie set edilir
{ success: true }

// Hatalı Yanıt (401)
{ success: false, error: "Invalid password." }
```

### `DELETE /api/auth` — Çıkış Yap

```typescript
// Yanıt (200) — cookie temizlenir
{ success: true }
```

### `POST /api/connections` — Bağlantı Test & Bağlan

```typescript
// İstek
{
    name: string,
    type: "postgresql" | "mysql" | "mongodb",
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    ssl: boolean,
    connectionString?: string,       // MongoDB URI modu
    connectionMode?: "manual" | "uri" // MongoDB bağlantı modu
}

// Başarılı Yanıt
{
    success: true,
    data: {
        connected: true,
        message: "Successfully connected to postgresql database \"mydb\".",
        schema: {
            tables: [
                {
                    name: "users",
                    columns: [
                        { name: "id", type: "integer", nullable: false },
                        { name: "email", type: "varchar", nullable: false }
                    ]
                }
            ],
            databaseType: "postgresql"
        }
    }
}
```

### `POST /api/query` — AI Sorgu Pipeline

```typescript
// İstek
{
    prompt: string,                          // Doğal dil sorusu
    locale?: string,                         // "en" | "tr"
    connection: ConnectionFormData & { id },  // Bağlantı bilgileri
    conversationHistory?: ConversationMessage[], // Önceki mesajlar
    streaming?: boolean                       // Streaming modu
}

// Standard Yanıt (streaming: false)
{
    success: true,
    data: {
        chartConfig: {
            chartType: "bar",
            title: "Aylık Satış Toplamları",
            xAxisKey: "month",
            dataKeys: ["total_sales"],
            colors: [{ key: "total_sales", color: "#6366f1" }],
            data: [{ month: "Ocak", total_sales: 15000 }, ...]
        },
        generatedQuery: "SELECT ... FROM ...",
        queryType: "sql",
        executionTimeMs: 45,
        rowCount: 12
    }
}

// Streaming Yanıt (streaming: true)
// Content-Type: application/x-ndjson
{"step":"generating"}
{"step":"validating"}
{"step":"executing"}
{"step":"charting"}
{"step":"done","data":{...DashboardQueryResponse}}
// Hata durumunda:
{"step":"error","error":"Hata mesajı"}
```

### `POST /api/suggestions` — Akıllı Öneriler

```typescript
// İstek
{ schema: DatabaseSchema, locale?: string }

// Yanıt
{
    success: true,
    data: {
        suggestions: [
            "Show total revenue by product category",
            "What are the top 10 customers by order count?",
            "Display monthly user registrations trend",
            "Which cities have the highest sales?",
            "Compare this year vs last year revenue",
            "Show the distribution of order statuses"
        ]
    }
}
```

### `POST /api/schema` — Şema Çıkarma

```typescript
// İstek: ConnectionFormData
// Yanıt
{ success: true, data: DatabaseSchema }
```

---

## 🔐 Kimlik Doğrulama / Authentication

```
                                ┌─────────────────┐
                                │   .env.local     │
                                │ ADMIN_PASSWORD=? │
                                └────────┬────────┘
                                         │
                            ┌────────────┴────────────┐
                            │                         │
                    ADMIN_PASSWORD                ADMIN_PASSWORD
                      ayarlanmış                   ayarlanmamış
                            │                         │
                            ▼                         ▼
                    ┌───────────────┐         ┌──────────────┐
                    │  Middleware    │         │  Auth devre   │
                    │  cookie kontrol│        │  dışı — herkese│
                    └───────┬───────┘         │  açık erişim  │
                            │                 └──────────────┘
                  cookie yok │ cookie var
                      │          │
                      ▼          ▼
              ┌──────────┐  ┌───────────┐
              │ /login    │  │ İçerik    │
              │ sayfasına │  │ göster    │
              │ yönlendir │  │ (geçerli) │
              └─────┬─────┘  └───────────┘
                    │
                    ▼
              POST /api/auth
              { password }
                    │
              password === ADMIN_PASSWORD?
              ├─ Evet → 32-byte hex token üret
              │         httpOnly cookie set et (7 gün)
              │         → Dashboard'a yönlendir
              └─ Hayır → 401 "Invalid password"
```

**Güvenlik notları:**
- Token `crypto.getRandomValues(new Uint8Array(32))` ile kriptografik olarak güvenli üretilir
- Cookie: `httpOnly` (JS erişimi yok), `secure` (production'da), `sameSite: "lax"`
- Token'lar sunucu belleğinde (`globalThis.__insightnode_tokens` Set) tutulur
- Basit koruma katmanı — production-grade session yönetimi değil

---

## 🌍 Uluslararasılaştırma (i18n)

### Mimari

```typescript
// Tip-güvenli çeviriler
interface Translations {
    header: { brand, subtitle, connected, noConnection, ... };
    commandInput: { askYourData, placeholders: string[], ... };
    emptyState: { readyTitle, suggestedQuestions, ... };
    connectionModal: { title, host, port, ... };
    chartCard: { showQuery, exportPng, exportCsv, delete, ... };
    progress: { generating, validating, executing, charting };
    toasts: { connectedTo, chartGenerated, exported, ... };
    footer: { brand, poweredBy };
    ai: { respondIn };
    // ... 80+ anahtar toplam
}
```

### Kullanım

```tsx
const { locale, t, toggleLocale } = useLanguage();

// Bileşenlerde:
<h1>{t.header.brand}</h1>
<p>{t.emptyState.readyTitle}</p>

// AI prompt'larında:
const instruction = t.ai.respondIn; // "Generate explanations in Turkish"
```

### Desteklenen Diller
- 🇺🇸 **English** (varsayılan)
- 🇹🇷 **Türkçe**

Dil değiştirme: Header'daki globe ikonu ile tek tıkla.

---

## 🎨 Tema Sistemi / Theming

### Modlar

| Mod | Açıklama |
|-----|----------|
| `dark` | Varsayılan. `#09090b` arka plan, `#fafafa` metin |
| `light` | `#fafafa` arka plan, `#09090b` metin |
| `system` | OS tercihini takip eder (`prefers-color-scheme` media query) |

### CSS Değişkenleri

```css
/* Dark (varsayılan — @theme inline) */
--color-background: #09090b;
--color-foreground: #fafafa;
--color-primary: #6366f1;
--color-card: #0a0a0f;
--color-border: #27272a;

/* Light (.light class override) */
--color-background: #fafafa;
--color-foreground: #09090b;
--color-card: #ffffff;
--color-border: #e4e4e7;
```

### Kalıcılık

localStorage key: `insightnode_theme`. Sayfa yenilendiğinde tema korunur.

### Özel Efektler

| Efekt | Dark | Light |
|-------|------|-------|
| Glass Card | `rgba(10,10,15,0.6)` + blur | `rgba(255,255,255,0.7)` + subtle shadow |
| Glow Pulse | Mavi-mor parıltı | Daha hafif parıltı |
| Shimmer | `rgba(99,102,241,0.08)` | `rgba(99,102,241,0.04)` |
| Scrollbar | `#27272a` | `#d4d4d8` |

---

## 💾 localStorage Kalıcılık Katmanı

Tüm modüller SSR-güvenlidir (`typeof window === "undefined"` kontrolü).

### Connections (`insightnode_connections`)

```typescript
interface SavedConnection extends ConnectionFormData {
    id: string;      // crypto.randomUUID()
    savedAt: string; // ISO timestamp
}
```

- Şifreler `btoa(encodeURIComponent(password))` ile maskelenir
- İsme göre upsert (aynı isimde bağlantı varsa günceller)
- Aktif bağlantı ayrı key: `insightnode_active_connection`

### Chat History (`insightnode_chat_history`)

```typescript
interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}
```

- FIFO — max 20 mesaj
- Son 10 mesaj API'ye `conversationHistory` olarak gönderilir
- Yeni bağlantıda otomatik temizlenir

### Dashboards (`insightnode_dashboards`)

```typescript
interface SavedDashboard {
    id: string;
    name: string;
    charts: DashboardQueryResponse[];
    layout: DashboardLayoutItem[];
    createdAt: string;
    updatedAt: string;
}
```

Storage katmanı hazır, UI entegrasyonu gelecek sürüm için planlanmıştır.

---

## 📊 Grafik Tipleri / Chart Types

Tüm grafikler `src/components/charts/dynamic-chart.tsx` içinde **Recharts** ile render edilir.

| Tip | Bileşen | Özellikler |
|-----|---------|------------|
| **Bar** | `<BarChart>` + `<Bar>` | Yuvarlatılmış üst köşeler, max 50px genişlik, >5 veri noktasında açılı etiketler |
| **Line** | `<LineChart>` + `<Line>` | Monotone interpolasyon, 2px çizgi, r=3 noktalar, aktif nokta r=5 |
| **Area** | `<AreaChart>` + `<Area>` | Monotone, %15 dolgu opaklığı, 2px çizgi |
| **Pie** | `<PieChart>` + `<Pie>` | Donut stili (iç yarıçap 60, dış 130), `name: XX%` etiketleri, 3° padding |
| **Scatter** | `<ScatterChart>` + `<Scatter>` | Her iki eksen sayısal, kesikli cursor |
| **KPI** | Custom `KPIChart` | Büyük sayı + prefix/suffix, ↑↓ değişim göstergesi (yeşil/kırmızı), mini sparkline |
| **Table** | Custom `TableChart` | Sıralanabilir başlıklar (asc/desc), 10 satır/sayfa, sayfalama kontrolleri |

### Ortak Stiller

- **Tooltip**: Koyu arka plan (`rgba(10,10,15,0.95)`), border `#27272a`, 8px radius
- **Grid**: Kesikli çizgiler `#1a1a2e`
- **Eksen**: `#a1a1aa` renk, 11px font
- **Container**: `<ResponsiveContainer width="100%" height={360}>`
- **Renk paleti**: 8 varsayılan renk (`#6366f1` indigo başlangıç)

---

## 📤 Dışa Aktarma Sistemi / Export

`src/utils/export.ts` modülü üç format destekler:

| Format | Fonksiyon | Detaylar |
|--------|-----------|----------|
| **PNG** | `exportChartAsPNG(elementId, title)` | `html2canvas` ile 2x ölçek, koyu arka plan. SVG serialization fallback. |
| **CSV** | `exportDataAsCSV(data, filename)` | BOM (`\uFEFF`) ile UTF-8 — Excel uyumlu. Virgül/tırnak/yeni satır içeren değerler düzgün escape edilir. |
| **JSON** | `exportDataAsJSON(data, filename)` | 2-boşluk indentli pretty-print. `application/json` MIME tipi. |

**Tetikleme**: Her ChartCard'ın export dropdown menüsünden (Download ikonu).

**İndirme mekanizması**: `downloadBlob()` → Object URL → programatik `<a>` tıklama → URL revoke.

---

## 🧪 Test Altyapısı / Testing

### Yapılandırma

```typescript
// vitest.config.ts
{
    test: {
        globals: true,          // describe, it, expect global
        environment: "node",    // DOM gerektirmiyor
    },
    resolve: {
        alias: { "@": "./src" } // Path alias desteği
    }
}
```

### Test Dosyaları

| Dosya | Test Sayısı | Kapsam |
|-------|-------------|--------|
| `query-sanitizer.test.ts` | 38+ | SQL keyword engelleme, yorum temizleme, subquery saldırıları, INTO OUTFILE, LOAD DATA, MySQL comments, edge cases, false-positive koruma, MongoDB whitelist |
| `validators.test.ts` | 17+ | Form doğrulama (PG, MongoDB URI), prompt sanitizasyonu, port aralığı, varsayılan portlar |
| **Toplam** | **61** | Güvenlik + doğrulama katmanları |

### Script'ler

```bash
npm test          # Tek seferlik çalıştırma (vitest run)
npm run test:watch  # İzleme modu (vitest)
```

---

## 💡 Akıllı Öneri Sistemi / Smart Suggestions

```
Bağlantı başarılı
        │
        ▼
fetchSuggestions(schema)
        │
        ▼
POST /api/suggestions { schema, locale }
        │
        ▼
generateSuggestions() → Gemini AI
    Tool: suggest_queries
    "6 farklı soru öner: aggregation, trend, karşılaştırma,
     dağılım, sıralama — gerçek tablo/sütun adlarını kullan"
        │
        ▼
┌───────────────────────────────┐
│  Öneriler iki yerde gösterilir: │
│                               │
│  1. EmptyState                │
│     → Wrapped pill butonlar   │
│     → Tıkla → Sorgu çalışır  │
│                               │
│  2. CommandInput altı          │
│     → Yatay scroll chip'ler   │
│     → Tıkla → Sorgu çalışır  │
└───────────────────────────────┘
```

**Fallback**: Gemini başarısız olursa, locale'e göre 6 varsayılan genel soru döner.

---

## 📡 Streaming Mekanizması

### Neden Streaming?

AI pipeline'ı 4 aşamadan oluşur ve toplamda 3-10 saniye sürebilir. Standard JSON yanıtında kullanıcı tüm süre boyunca "loading" spinner görür. Streaming ile her adım anlık gösterilir.

### Protokol: NDJSON (Newline Delimited JSON)

```
Content-Type: application/x-ndjson
Cache-Control: no-cache
Transfer-Encoding: chunked
```

### Server Side

```typescript
const stream = new ReadableStream({
    async start(controller) {
        const encoder = new TextEncoder();
        const send = (data: unknown) => {
            controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        };

        send({ step: "generating" });
        const query = await generateQuery(...);

        send({ step: "validating" });
        sanitizeSQLQuery(query.queryString);

        send({ step: "executing" });
        const result = await adapter.executeQuery(...);

        send({ step: "charting" });
        const chart = await formatChart(...);

        send({ step: "done", data: response });
        controller.close();
    }
});
```

### Client Side

```typescript
const reader = res.body.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";  // Tamamlanmamış satırı buffer'da tut

    for (const line of lines) {
        const chunk = JSON.parse(line);
        if (chunk.step) setQueryStep(chunk.step);
        if (chunk.data) setFinalResult(chunk.data);
    }
}
```

### QueryProgress Bileşeni

4 adım animasyonlu gösterilir:

```
[✓ Generating] ─── [● Validating] ─── [○ Executing] ─── [○ Charting]
   tamamlandı        aktif (spinner)     beklemede          beklemede
```

Her adım: Loader2 spinner → Check animasyonu (Framer Motion).

---

## 📄 Lisans

Bu proje açık kaynak değildir. Tüm hakları saklıdır.

---

<p align="center">
  <strong>InsightNode</strong> — AI ile veritabanınızı konuşturun. ⚡
</p>