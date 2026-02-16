<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

<h1 align="center">⚡ InsightNode</h1>

<p align="center">
  <strong>AI-Powered Text-to-Dashboard Builder</strong><br/>
  <em>Ask your data a question in plain language → get a beautiful chart instantly.</em>
</p>

<p align="center">
  <strong>Yapay Zeka Destekli Metin-den-Dashboard Oluşturucu</strong><br/>
  <em>Verinize doğal dilde bir soru sorun → anında güzel bir grafik alın.</em>
</p>

---

<details>
<summary>🇬🇧 <strong>English</strong></summary>

## 💡 The Problem

You have a database full of valuable data. But to see it as a chart, you need to:

1. Write an SQL query (or MongoDB aggregation)
2. Export the results to a spreadsheet
3. Manually build a chart
4. Rinse and repeat for every question

**InsightNode eliminates all of that.** Just type your question in plain English (or Turkish), and the AI handles the rest — writing the query, running it safely, and rendering a beautiful interactive chart.

## ✨ What It Does

- **🧠 Talk to your data** — Ask questions like *"Show me monthly revenue for the last year"* and get an instant chart
- **📊 Smart chart selection** — The AI picks the best chart type (bar, line, area, pie, scatter) based on your data
- **🗄️ Connect any database** — PostgreSQL, MySQL, or MongoDB (via connection string or manual setup)
- **🌍 Bilingual** — Full Turkish and English support — UI and AI responses switch with one click
- **🔒 Safe by design** — Only SELECT queries are allowed; no data can be modified or deleted
- **🎨 Beautiful dark UI** — Glassmorphic design with smooth animations

## 🏗️ How It Works

InsightNode uses a **two-step AI pipeline** powered by Google Gemini:

```
  "Show top 10 customers"
           │
           ▼
  ┌─────────────────────┐
  │  Step 1: Gemini AI   │  → Generates SQL/MongoDB query
  │  (query generation)  │     from your question + schema
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  Query Sanitizer     │  → Blocks any destructive operations
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  Database Execution  │  → Runs the safe query on YOUR database
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  Step 2: Gemini AI   │  → Picks chart type, colors, labels
  │  (chart config)      │     from column names + 3 sample rows
  └──────────┬──────────┘
             ▼
        📊 Chart!
```

> **Privacy:** Only your schema and 3 sample rows are sent to Gemini — the full dataset never leaves your server for AI processing.

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS 4, Recharts, Framer Motion |
| **AI** | Google Gemini (via `@google/genai` SDK, function calling) |
| **Database Drivers** | `pg` (PostgreSQL), `mysql2` (MySQL), `mongodb` (MongoDB) |
| **UI Components** | Radix UI primitives, Lucide icons, Sonner toasts, CVA variants |

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/bcansakalar/InsightNode.git
cd InsightNode

# Install
npm install

# Configure
cp .env.example .env.local
# Add your Gemini API key to .env.local
# Get one free at: https://aistudio.google.com/apikey

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Click **"Connect DB"** → Start asking questions!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Main dashboard (client component)
│   ├── providers.tsx       # Language context wrapper
│   └── api/
│       ├── connections/    # Test & fetch schema
│       └── query/          # Full AI pipeline endpoint
│
├── components/
│   ├── ui/                 # Reusable primitives (Button, Dialog, Tabs...)
│   ├── dashboard/          # Header, CommandInput, ConnectionModal, EmptyState
│   └── charts/             # DynamicChart (Recharts), ChartCard
│
├── lib/
│   ├── ai/                 # Gemini client + function declarations
│   ├── db/                 # Database adapter factory + drivers
│   └── i18n/               # Translation system (EN/TR)
│
├── services/
│   ├── query-generator.ts  # Step 1: Text → SQL/Mongo
│   └── chart-formatter.ts  # Step 2: Data → Chart config
│
├── types/                  # TypeScript type definitions
└── utils/                  # Query sanitizer + form validators
```

## 🔒 Security

- **Query whitelist**: Only `SELECT` (SQL) and `find`/`aggregate` (MongoDB) are allowed
- **No data storage**: Credentials exist in memory only — nothing is saved to disk
- **Minimal AI exposure**: Gemini sees schema + 3 rows, not your full dataset
- **Use read-only credentials** for maximum safety

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/connections` | POST | Test database connection + return schema |
| `/api/query` | POST | Full pipeline: prompt → query → chart |
| `/api/schema` | POST | Fetch database schema only |

## 📄 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (Turbopack, fast HMR) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

</details>

---

<details>
<summary>🇹🇷 <strong>Türkçe</strong></summary>

## 💡 Problem

Elinizde değerli verilerle dolu bir veritabanı var. Ama bunu grafik olarak görmek için:

1. SQL sorgusu (veya MongoDB aggregation) yazmanız,
2. Sonuçları bir tabloya aktarmanız,
3. Elle grafik oluşturmanız,
4. Her yeni soru için bunları baştan yapmanız gerekiyor.

**InsightNode bunların hepsini ortadan kaldırıyor.** Sorunuzu Türkçe (veya İngilizce) doğal dilde yazın — yapay zeka sorguyu yazar, güvenle çalıştırır ve etkileşimli bir grafik oluşturur.

## ✨ Ne Yapar?

- **🧠 Verinizle konuşun** — *"Son 12 ayın aylık gelir trendini göster"* gibi sorular sorun, anında grafik gelsin
- **📊 Akıllı grafik seçimi** — Yapay zeka veriye göre en uygun grafik türünü seçer (bar, çizgi, alan, pasta, scatter)
- **🗄️ Her veritabanını bağlayın** — PostgreSQL, MySQL veya MongoDB (connection string veya manuel kurulum)
- **🌍 İki dilli** — Türkçe ve İngilizce tam destek — tek tıkla dil değişir
- **🔒 Güvenli tasarım** — Sadece SELECT sorguları çalışır; veri değiştirilemez veya silinemez
- **🎨 Şık karanlık arayüz** — Cam efektli (glassmorphism) modern tasarım, yumuşak animasyonlar

## 🏗️ Nasıl Çalışır?

InsightNode, Google Gemini ile çalışan **iki adımlı yapay zeka pipeline'ı** kullanır:

```
  "En çok harcayan 10 müşteriyi göster"
           │
           ▼
  ┌──────────────────────────┐
  │  Adım 1: Gemini AI       │  → Sorunuz + şemadan SQL/MongoDB sorgusu üretilir
  │  (sorgu oluşturma)        │
  └──────────┬───────────────┘
             ▼
  ┌──────────────────────────┐
  │  Sorgu Güvenlik Filtresi  │  → Tehlikeli işlemler engellenir
  └──────────┬───────────────┘
             ▼
  ┌──────────────────────────┐
  │  Veritabanı Çalıştırma    │  → Güvenli sorgu SİZİN veritabanınızda çalışır
  └──────────┬───────────────┘
             ▼
  ┌──────────────────────────┐
  │  Adım 2: Gemini AI       │  → Grafik türü, renkler, etiketler seçilir
  │  (grafik yapılandırma)    │     (sadece sütun adları + 3 örnek satır gönderilir)
  └──────────┬───────────────┘
             ▼
        📊 Grafik!
```

> **Gizlilik:** Gemini'ye sadece şemanız ve 3 örnek satır gönderilir — tam veri setiniz AI işleme için sunucunuzdan hiç çıkmaz.

## 🛠 Teknoloji Yığını

| Katman | Teknolojiler |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS 4, Recharts, Framer Motion |
| **Yapay Zeka** | Google Gemini (`@google/genai` SDK, function calling) |
| **Veritabanı Sürücüleri** | `pg` (PostgreSQL), `mysql2` (MySQL), `mongodb` (MongoDB) |
| **UI Bileşenleri** | Radix UI, Lucide ikonlar, Sonner bildirimler, CVA varyantları |

## 🚀 Başlangıç

```bash
# Klonlayın
git clone https://github.com/bcansakalar/InsightNode.git
cd InsightNode

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local'a Gemini API anahtarınızı ekleyin
# Ücretsiz alın: https://aistudio.google.com/apikey

# Çalıştırın
npm run dev
```

[http://localhost:3000](http://localhost:3000) açın → **"Veritabanı Bağla"** tıklayın → Soru sormaya başlayın!

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Ana dashboard (client component)
│   ├── providers.tsx       # Dil context wrapper'ı
│   └── api/
│       ├── connections/    # Bağlantı testi + şema getirme
│       └── query/          # Tam AI pipeline endpoint'i
│
├── components/
│   ├── ui/                 # Tekrar kullanılabilir bileşenler (Button, Dialog, Tabs...)
│   ├── dashboard/          # Header, Komut Girişi, Bağlantı Modalı, Boş Durum
│   └── charts/             # DynamicChart (Recharts), ChartCard
│
├── lib/
│   ├── ai/                 # Gemini istemcisi + fonksiyon tanımları
│   ├── db/                 # Veritabanı adapter fabrikası + sürücüler
│   └── i18n/               # Çeviri sistemi (EN/TR)
│
├── services/
│   ├── query-generator.ts  # Adım 1: Metin → SQL/Mongo
│   └── chart-formatter.ts  # Adım 2: Veri → Grafik yapılandırması
│
├── types/                  # TypeScript tip tanımları
└── utils/                  # Sorgu sanitizer + form doğrulayıcılar
```

## 🔒 Güvenlik

- **Sorgu beyaz listesi**: Sadece `SELECT` (SQL) ve `find`/`aggregate` (MongoDB) izinli
- **Veri saklanmaz**: Kimlik bilgileri sadece bellekte tutulur — diske hiçbir şey yazılmaz
- **Minimal AI maruziyeti**: Gemini sadece şema + 3 satır görür, tam veri setinizi görmez
- **Salt okunur kimlik bilgileri kullanın** — maksimum güvenlik için

## 📡 API Endpoint'leri

| Endpoint | Metod | Açıklama |
|---|---|---|
| `/api/connections` | POST | Veritabanı bağlantısı testi + şema döndürme |
| `/api/query` | POST | Tam pipeline: soru → sorgu → grafik |
| `/api/schema` | POST | Sadece veritabanı şemasını getirme |

## 📄 Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu başlatır (Turbopack, hızlı HMR) |
| `npm run build` | Production build oluşturur |
| `npm run start` | Production build'i sunar |
| `npm run lint` | ESLint kontrolleri çalıştırır |

</details>

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ using <strong>Next.js 16</strong>, <strong>Google Gemini</strong> & <strong>Recharts</strong>
</p>
