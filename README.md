<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Gemini_AI-3_Flash-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

<h1 align="center">⚡ InsightNode</h1>
<p align="center">
  <strong>AI-Powered Text-to-Dashboard Builder</strong><br/>
  <em>Ask your data a question in natural language → get a beautiful, interactive chart instantly.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-security">Security</a> •
  <a href="#-internationalization">i18n</a>
</p>

---

## 🎯 What is InsightNode?

InsightNode is an **AI-powered Business Intelligence (BI) tool** that turns natural language questions into database queries and interactive charts — all in real time. No SQL knowledge required.

**The core idea:** Connect your database → type a question like *"Show me monthly revenue for the last year"* → get a beautiful Recharts visualization in seconds.

### Who is this for?

- **Developers** who want to quickly visualize data without writing dashboards
- **Data analysts** who need ad-hoc charts from live databases
- **Product managers** who want to explore data without knowing SQL
- **Anyone** who has a database and wants to talk to their data

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Natural Language Queries** | Ask questions in plain English or Turkish — AI generates the SQL/aggregation pipeline |
| 📊 **Auto-Generated Charts** | Bar, Line, Area, Pie, and Scatter charts rendered with Recharts |
| 🗄️ **Multi-Database Support** | PostgreSQL, MySQL, and MongoDB with type-specific connection flows |
| 🔗 **MongoDB URI Support** | Connect via connection string (`mongodb+srv://...`) or manual host/port |
| 🌍 **Bilingual (EN/TR)** | Full Turkish and English UI with one-click language switching |
| 🤖 **Gemini 3 Flash** | Powered by Google's latest AI model for fast, accurate query generation |
| 🔒 **Read-Only by Design** | Query sanitizer blocks INSERT, UPDATE, DELETE, DROP — only SELECT allowed |
| 🎨 **Dark-Mode UI** | Glassmorphic, modern, responsive interface with Framer Motion animations |
| ⚡ **Turbopack** | Sub-second hot reload during development |

---

## 🏗️ Architecture

InsightNode follows a **two-step AI pipeline** architecture:

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌────────────┐
│  User types  │────▶│  Step 1: Gemini   │────▶│  Step 2: Gemini   │────▶│  Recharts  │
│  a question  │     │  Text → SQL/Mongo │     │  Data → Chart     │     │  renders   │
│              │     │  (query-generator) │     │  (chart-formatter) │     │  the chart │
└─────────────┘     └──────────────────┘     └──────────────────┘     └────────────┘
                              │                         ▲
                              ▼                         │
                    ┌──────────────────┐      ┌──────────────────┐
                    │   Query Sanitizer │      │   Query Executor  │
                    │   (security gate) │─────▶│   (DB adapter)    │
                    └──────────────────┘      └──────────────────┘
```

### Data Flow (detailed)

1. **User** types a natural language question (e.g., *"Show top 10 customers by spending"*)
2. **Frontend** sends `{ prompt, locale, connection }` to `/api/query`
3. **Step 1 — Query Generation**: The prompt + database schema is sent to Gemini via function calling. Gemini returns a `execute_database_query` function call containing the generated SQL/MongoDB query.
4. **Query Sanitization**: The generated query passes through the security sanitizer:
   - SQL: Blocks all non-SELECT operations (regex-based whitelist)
   - MongoDB: Only allows `find` and `aggregate` operations
5. **Query Execution**: The sanitized query runs against the user's database through the appropriate adapter (pg / mysql2 / mongodb driver)
6. **Step 2 — Chart Configuration**: Query results (column names + 3-row sample, NOT full data) are sent to Gemini. It determines the best chart type and returns a `render_chart` function call with chart config.
7. **Rendering**: The full data + chart config are sent to the frontend, where `DynamicChart` renders an interactive Recharts visualization.

> **Privacy Note:** In Step 6, only column names and 3 sample rows are sent to Gemini — the full dataset never leaves the server for AI processing.

---

## 🛠 Tech Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | Full-stack React framework with App Router |
| **React** | 19 | UI library with server/client component model |
| **TypeScript** | 5.7 | Type safety across the entire codebase |
| **Turbopack** | Built-in | Bundler for fast dev builds |

### AI & Data

| Technology | Version | Purpose |
|---|---|---|
| **@google/genai** | 1.41.0 | Google Gemini AI SDK for function calling |
| **Gemini 3 Flash Preview** | Latest | LLM model for query generation and chart configuration |

### Database Drivers

| Driver | Version | Database |
|---|---|---|
| **pg** | 8.13 | PostgreSQL |
| **mysql2** | 3.12 | MySQL |
| **mongodb** | 6.12 | MongoDB |

### UI & Visualization

| Technology | Version | Purpose |
|---|---|---|
| **TailwindCSS** | 4.0 | Utility-first CSS framework |
| **Recharts** | 3.7 | Declarative charting library |
| **Framer Motion** | 12.34 | Animations and transitions |
| **Radix UI** | Various | Accessible headless UI primitives (Dialog, Tabs, Label, etc.) |
| **Lucide React** | 0.474 | Icon library |
| **Sonner** | 2.0 | Toast notifications |
| **CVA + clsx + tailwind-merge** | Latest | Type-safe variant system for components |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9
- A **Google Gemini API key** (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- A database to connect (PostgreSQL, MySQL, or MongoDB)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/bcansakalar/InsightNode.git
cd InsightNode

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're ready to go.

### Production Build

```bash
npm run build
npm run start
```

---

## 🧩 How It Works

### Step 1: Connect Your Database

Click **"Connect DB"** in the header. Choose your database type:

- **PostgreSQL** — Enter host, port, username, password, database name
- **MySQL** — Same field layout as PostgreSQL
- **MongoDB** — Choose between:
  - 🔗 **Connection String** (default): Paste `mongodb+srv://user:pass@cluster/db`
  - ⚙️ **Manual**: Enter host, port, user, password individually

The app tests the connection, fetches the schema (tables/collections and their columns/fields), and you're connected.

### Step 2: Ask a Question

Type a question in natural language. Examples:

- *"Show me the top 10 customers by total spending as a bar chart"*
- *"What is the monthly revenue trend for the last 12 months?"*
- *"Show the distribution of orders by status as a pie chart"*

### Step 3: Get a Chart

The AI generates a query, executes it safely, determines the best chart type, and renders it. Each chart card shows:

- **Title** (AI-generated, in your selected language)
- **Execution time** and **row count**
- **Chart type** badge
- **"Show Query"** toggle to view the generated SQL/aggregation
- **Interactive chart** with tooltips

---

## 📁 Project Structure

```
InsightNode/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (metadata, fonts, Toaster)
│   │   ├── page.tsx                  # Main dashboard page (client component)
│   │   ├── globals.css               # Global styles + dark theme + animations
│   │   ├── providers.tsx             # Client-side context wrapper (LanguageProvider)
│   │   └── api/
│   │       ├── connections/route.ts  # POST: Test DB connection + fetch schema
│   │       ├── query/route.ts        # POST: Full AI pipeline (prompt → chart)
│   │       └── schema/route.ts       # POST: Fetch schema only
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI primitives (shadcn-style)
│   │   │   ├── button.tsx            # Button with CVA variants
│   │   │   ├── dialog.tsx            # Radix Dialog wrapper
│   │   │   ├── input.tsx             # Styled input field
│   │   │   ├── label.tsx             # Radix Label
│   │   │   ├── tabs.tsx              # Radix Tabs wrapper
│   │   │   └── badge.tsx             # Status badge component
│   │   ├── dashboard/
│   │   │   ├── header.tsx            # App header + language toggle + connection status
│   │   │   ├── connection-modal.tsx  # DB connection dialog (per-type forms)
│   │   │   ├── command-input.tsx     # Natural language query input bar
│   │   │   └── empty-state.tsx       # Placeholder when no charts exist
│   │   └── charts/
│   │       ├── dynamic-chart.tsx     # Renders any chart type via Recharts
│   │       └── chart-card.tsx        # Chart wrapper with metadata + query toggle
│   │
│   ├── lib/
│   │   ├── utils.ts                  # cn() class merger utility
│   │   ├── ai/
│   │   │   ├── gemini-client.ts      # Lazy Gemini client singleton + generateWithTools
│   │   │   └── function-declarations.ts  # AI function calling schemas
│   │   ├── db/
│   │   │   ├── index.ts              # Database adapter factory
│   │   │   ├── postgres.ts           # PostgreSQL adapter (pg driver)
│   │   │   ├── mysql.ts              # MySQL adapter (mysql2 driver)
│   │   │   └── mongodb-client.ts     # MongoDB adapter (URI + manual mode)
│   │   └── i18n/
│   │       ├── translations.ts       # EN/TR translation definitions
│   │       ├── language-context.tsx   # React context for locale state
│   │       └── index.ts              # Barrel export
│   │
│   ├── services/
│   │   ├── query-generator.ts        # Step 1: Natural language → DB query
│   │   └── chart-formatter.ts        # Step 2: Query results → Chart config
│   │
│   ├── types/
│   │   ├── database.ts               # DB connection, schema, query result types
│   │   ├── chart.ts                  # Chart config, color, response types
│   │   └── api.ts                    # API response wrapper types
│   │
│   └── utils/
│       ├── query-sanitizer.ts        # SQL/MongoDB query security whitelist
│       └── validators.ts             # Connection form + prompt validation
│
├── .env.example                      # Environment variable template
├── .gitignore                        # Git ignore rules
├── next.config.mjs                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # TailwindCSS configuration (v4)
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint flat config
└── package.json                      # Dependencies and scripts
```

---

## 📡 API Reference

### `POST /api/connections`

Test a database connection and return its schema.

**Request Body:**
```json
{
  "name": "My Production DB",
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "user": "readonly_user",
  "password": "secret",
  "database": "my_database",
  "ssl": false
}
```

**MongoDB URI mode:**
```json
{
  "name": "My Atlas Cluster",
  "type": "mongodb",
  "connectionMode": "uri",
  "connectionString": "mongodb+srv://user:pass@cluster.mongodb.net/",
  "database": "my_database"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "message": "Successfully connected to postgresql database \"my_database\".",
    "schema": {
      "tables": [
        {
          "name": "users",
          "columns": [
            { "name": "id", "type": "integer", "nullable": false },
            { "name": "name", "type": "text", "nullable": false },
            { "name": "email", "type": "text", "nullable": true }
          ]
        }
      ],
      "databaseType": "postgresql"
    }
  }
}
```

---

### `POST /api/query`

The core endpoint — full AI pipeline from natural language to chart.

**Request Body:**
```json
{
  "prompt": "Show top 10 customers by total spending",
  "locale": "en",
  "connection": {
    "id": "active-connection",
    "name": "Production DB",
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "user": "readonly_user",
    "password": "secret",
    "database": "ecommerce",
    "ssl": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chartConfig": {
      "chartType": "bar",
      "title": "Top 10 Customers by Total Spending",
      "xAxisKey": "customer_name",
      "dataKeys": ["total_spending"],
      "colors": [{ "key": "total_spending", "color": "#6366f1" }],
      "data": [
        { "customer_name": "John Doe", "total_spending": 15230 },
        { "customer_name": "Jane Smith", "total_spending": 12450 }
      ]
    },
    "generatedQuery": "SELECT c.name AS customer_name, SUM(o.total) AS total_spending FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name ORDER BY total_spending DESC LIMIT 10;",
    "queryType": "sql",
    "executionTimeMs": 45,
    "rowCount": 10
  }
}
```

---

### `POST /api/schema`

Fetch schema for an already-connected database (used internally).

---

## 🔒 Security

InsightNode takes security seriously since it executes queries against real databases:

### Query Sanitization

**SQL databases (PostgreSQL, MySQL):**
- Only `SELECT` statements are allowed
- Blocked keywords: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `TRUNCATE`, `EXEC`, `EXECUTE`, `GRANT`, `REVOKE`
- Regex-based pattern matching catches destructive operations

**MongoDB:**
- Only `find` and `aggregate` operations are permitted
- All other operations (`insert`, `update`, `delete`, `drop`) are blocked

### Data Privacy

- Database credentials are **never stored** — they exist only in memory during the session
- Only **schema + 3 sample rows** are sent to Gemini for chart configuration
- Full query results **never leave your server** for AI processing
- API keys are stored in `.env.local` which is gitignored

### Best Practices

- Always use **read-only database credentials**
- Enable **SSL/TLS** for production database connections
- Run InsightNode in a **private network** or behind authentication

---

## 🌍 Internationalization

InsightNode supports **English** and **Turkish** with full UI and AI response localization.

### How it works

1. **Language Context** (`src/lib/i18n/language-context.tsx`): A React context provider manages the global locale state
2. **Translations** (`src/lib/i18n/translations.ts`): All UI strings are defined in both languages
3. **AI Integration**: The selected locale is sent to the API, which injects language instructions into Gemini prompts — so chart titles and explanations come back in the user's language
4. **Toggle**: Globe button (🌐) in the header switches between TR/EN instantly

### Adding a new language

1. Add the locale code to the `Locale` type in `translations.ts`
2. Add a new translation object to the `translations` record
3. Update `toggleLocale` in `language-context.tsx` to cycle through locales

---

## 🧪 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack (fast HMR) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ using <strong>Next.js 16</strong>, <strong>Google Gemini</strong>, and <strong>Recharts</strong>
</p>
