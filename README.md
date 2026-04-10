<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Gemini_AI-Function_Calling-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<h1 align="center">⚡ InsightNode</h1>

<p align="center">
  <strong>AI-Powered Database Dashboard Builder</strong><br/>
  Connect your database, ask questions in natural language, get interactive charts in seconds.
</p>

<p align="center">
  <em>Connect your database → Ask in natural language → Get beautiful, interactive charts — powered by Google Gemini.</em>
</p>

---

## 📖 Table of Contents

- [What is InsightNode?](#-what-is-insightnode)
- [Use Cases](#-use-cases)
- [Features](#-features)
- [Architecture](#-architecture)
- [Data Flow](#-data-flow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [AI Pipeline](#-ai-pipeline)
- [Database Adapter System](#-database-adapter-system)
- [Security Layer](#-security-layer)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Theming](#-theming)
- [localStorage Persistence](#-localstorage-persistence)
- [Chart Types](#-chart-types)
- [Export System](#-export-system)
- [Testing](#-testing)
- [Smart Suggestions](#-smart-suggestions)
- [Streaming Pipeline](#-streaming-pipeline)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 🧠 What is InsightNode?

**InsightNode** is an AI-powered dashboard builder that allows users to query their databases without any SQL or MongoDB knowledge.

A user asks a question in natural language (e.g., _"Show me the monthly sales trend"_), and the system:

1. Translates the question into a database query (SQL or MongoDB aggregation) using **Google Gemini AI**
2. Passes the query through a **multi-layer security sanitizer** (SQL injection protection)
3. Executes the query on the **actual database**
4. Sends the results back to Gemini AI to **automatically select the best chart type**
5. Presents it to the user as a **beautiful, interactive chart**

All of this happens in seconds from a single sentence typed into a text input.

### Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Zero SQL Knowledge** | Users only ask questions in natural language |
| **Privacy-First AI** | Only column names + 3 sample rows are sent to Gemini; all data stays on the server |
| **Security-First** | Every AI-generated query goes through multi-layer sanitization before execution |
| **Multi-Database** | PostgreSQL, MySQL, and MongoDB supported from a single interface |
| **Real-Time** | Streaming (NDJSON) provides instant feedback for each pipeline step |

---

## 🎯 Use Cases

InsightNode is designed for the following scenarios:

- **Business Analytics**: Analyze sales, revenue, and customer databases — without writing SQL
- **Quick Data Exploration**: Connect to a new database and ask "what's in this table?"
- **Reporting**: Quickly generate charts for meetings, export as PNG/CSV/JSON
- **Education**: For those learning SQL — type a question, inspect the generated query
- **Multi-Turn Analysis**: Ask follow-up questions like "Now show this by month", "Filter only 2024"

---

## ✨ Features

### 🤖 AI-Powered Query Engine
- Natural language → SQL/MongoDB query conversion
- Google Gemini `gemini-2.0-flash` model
- **Function Calling** mode guarantees structured output
- Multi-turn conversation support (last 10 messages sent as context)

### 📊 7 Chart Types
- **Bar Chart**: For comparisons
- **Line Chart**: Time series trends
- **Area Chart**: Cumulative data
- **Pie Chart**: Proportional distributions (donut style)
- **Scatter Plot**: Correlation analysis
- **KPI Card**: Single-value indicator (change percentage + mini sparkline)
- **Data Table**: Sortable, paginated data table

### 🗄️ Multi-Database Support
- **PostgreSQL** (pg driver)
- **MySQL** (mysql2 driver)
- **MongoDB** (native driver — URI or manual connection)

### 📡 Streaming Pipeline
- Real-time progress via NDJSON
- 4 steps: Generating → Validating → Executing → Charting
- Each step shown with animated progress bar

### 🔒 Security
- SQL injection protection (17 blocked keywords, INTO OUTFILE/DUMPFILE blocking)
- MongoDB operation whitelist (read-only operations only)
- MySQL nested comment attack detection
- Prompt sanitization (2,000 character limit)
- Query length limit (10,000 characters)
- Password-protected access (optional)

### 🌍 Bilingual Support (i18n)
- English (EN) and Turkish (TR)
- All UI text, AI directives, and placeholders included
- One-click language switching

### 🎨 Theme System
- **Dark Mode** (default) — Vercel/Linear inspired
- **Light Mode** — Full CSS variable set
- **System Mode** — Follows OS preference
- Persisted via localStorage

### 💾 Connection Saving
- Database connections saved to localStorage
- Passwords obfuscated with base64
- Active connection automatically restored on page refresh
- Quick access to saved connections via header dropdown

### 📤 Export
- **PNG** — html2canvas at 2x resolution
- **CSV** — BOM-enabled UTF-8 (Excel compatible)
- **JSON** — Pretty-printed

### 💡 Smart Suggestions
- After connecting, AI suggests 6 schema-specific questions
- Click-to-run suggestion chips
- Fallback: Default suggestions based on language

### 🔐 Authentication
- Activated via `ADMIN_PASSWORD` environment variable
- httpOnly cookie-based session (7 days)
- Next.js Edge middleware protection
- Auth completely disabled when not set

### 🧪 Testing
- 61 tests with Vitest
- Query sanitizer security tests (38 test cases)
- Validator tests (23 test cases)
- Path alias support

---

## 🏗 Architecture

InsightNode follows a **layered architecture** principle. Each layer carries a single responsibility:

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

### Design Patterns

| Pattern | Implementation |
|---------|---------------|
| **Adapter Pattern** | `DatabaseAdapter` interface + 3 concrete implementations (PG, MySQL, MongoDB) + factory function |
| **Function Calling (Structured Output)** | Gemini AI returns structured JSON every time using `FunctionCallingConfigMode.ANY` |
| **Streaming (NDJSON)** | `ReadableStream` server-side, `ReadableStreamDefaultReader` client-side |
| **Context Pattern** | Theme + Language React Contexts with cascading providers |
| **Barrel Exports** | Each module re-exports via `index.ts` |
| **Privacy-Preserving AI** | Chart formatter sends only column names + 3 sample rows — full dataset never reaches AI |
| **Security-First** | AI output → Sanitizer → Database ordering ensures no AI-generated query runs directly |
| **Composition over Inheritance** | Radix UI primitives → shadcn wrappers → domain components → page assembly |

---

## 🔄 Data Flow

```
User: "Show me total sales by month"
        │
        ▼
┌─ CommandInput ─────────────────────────────┐
│  onSubmit(prompt)                          │
│  → page.tsx handleQuerySubmit()            │
│  → Add "user" message to chatHistory       │
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
│     • 10,000 character limit               │
│     • Comment stripping                    │
│     • 17 blocked keyword check             │
│     • INTO OUTFILE/DUMPFILE blocking       │
│     • MySQL nested comment detection       │
│     • Must start with SELECT or WITH       │
│                                            │
│  ③ NDJSON: {"step":"executing"}            │
│     adapter.executeQuery(sanitizedQuery)   │
│     ← { rows[], columns[], rowCount, ms } │
│                                            │
│  ④ NDJSON: {"step":"charting"}             │
│     formatChart(rows, columns, prompt)     │
│       └─→ Gemini AI (Function Calling)     │
│           Input: column names + 3 rows     │
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
│  reader.read() → Parse NDJSON lines        │
│  Each "step" → QueryProgress animation     │
│  "done" → Prepend to charts[] state        │
│  Add "assistant" message to chatHistory     │
│  Show toast notification                   │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌─ ChartCard → DynamicChart ─────────────────┐
│  chartType'a göre dispatch:                │
│  bar → <BarChart>    pie → <PieChart>      │
│  line → <LineChart>  scatter → <Scatter>   │
│  area → <AreaChart>  kpi → KPI component    │
│                      table → DataTable     │
│                                            │
│  + Export toolbar (PNG/CSV/JSON)           │
│  + SQL query viewer                        │
│  + Delete button                           │
└────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Runtime Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | `^16.0.0` | React meta-framework (App Router, API routes, middleware) |
| `react` | `^19.0.0` | UI library |
| `react-dom` | `^19.0.0` | React DOM renderer |
| `@google/genai` | `^1.41.0` | Google Gemini AI SDK (Function Calling) |
| `recharts` | `^3.7.0` | Chart library (Bar, Line, Area, Pie, Scatter) |
| `framer-motion` | `^12.34.0` | Animation library |
| `pg` | `^8.13.0` | PostgreSQL client driver |
| `mysql2` | `^3.12.0` | MySQL client driver (promise-based) |
| `mongodb` | `^6.12.0` | MongoDB native driver |
| `sonner` | `^2.0.0` | Toast notifications |
| `class-variance-authority` | `^0.7.1` | Variant-based component styling |
| `clsx` | `^2.1.1` | Conditional CSS class merging |
| `tailwind-merge` | `^3.0.0` | Tailwind class conflict resolver |
| `lucide-react` | `^0.474.0` | Icon set (200+ icons) |
| `@radix-ui/*` | Various | Accessible UI primitives (Dialog, Tabs, Label, Select) |
| `html2canvas` | `^1.4.1` | DOM → Canvas converter (PNG export) |

### Dev Dependencies

| Package | Version | Role |
|---------|---------|------|
| `typescript` | `^5.7.0` | Type system |
| `tailwindcss` | `^4.0.0` | Utility-first CSS framework (v4) |
| `@tailwindcss/postcss` | `^4.0.0` | Tailwind v4 PostCSS integration |
| `vitest` | `^3.2.0` | Test runner |
| `eslint` | `^9.0.0` | Linter (flat config) |
| `eslint-config-next` | `^16.0.0` | Next.js ESLint rules |

---

## 📁 Project Structure

```
InsightNode/
├── .env.local                          # Environment variables (GEMINI_API_KEY, ADMIN_PASSWORD)
├── .gitignore                          # Git ignore rules
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration (@/* alias)
├── next.config.mjs                     # Next.js configuration
├── vitest.config.ts                    # Vitest test runner configuration
├── eslint.config.mjs                   # ESLint flat config
├── postcss.config.mjs                  # PostCSS + Tailwind v4
├── README.md                           # This file
├── SERVER.md                           # Setup and deployment guide
│
└── src/
    ├── middleware.ts                    # Auth middleware (Edge runtime)
    │
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout (<html>, <body>, Providers, Toaster)
    │   ├── providers.tsx               # ThemeProvider → LanguageProvider composition
    │   ├── globals.css                 # Tailwind v4 + dark/light CSS variables
    │   ├── page.tsx                    # ⭐ Main dashboard page (state orchestrator)
    │   ├── login/
    │   │   └── page.tsx                # Password login page
    │   └── api/
    │       ├── auth/route.ts           # POST: login, DELETE: logout
    │       ├── connections/route.ts    # POST: test & connect + schema extraction
    │       ├── query/route.ts          # POST: full AI pipeline (streaming/standard)
    │       ├── schema/route.ts         # POST: schema extraction only
    │       └── suggestions/route.ts   # POST: AI suggestion generation
    │
    ├── components/
    │   ├── charts/
    │   │   ├── chart-card.tsx          # Chart card (metadata + export + delete)
    │   │   └── dynamic-chart.tsx       # 7-type chart renderer (Recharts + custom)
    │   ├── dashboard/
    │   │   ├── header.tsx              # Top bar (connection, theme, language, logout)
    │   │   ├── command-input.tsx       # Natural language query input + suggestion chips
    │   │   ├── empty-state.tsx         # Empty state screen + AI suggestions
    │   │   ├── connection-modal.tsx    # Database connection dialog (3 DB types)
    │   │   └── query-progress.tsx      # 4-step pipeline progress indicator
    │   └── ui/                         # shadcn/Radix UI primitives
    │       ├── badge.tsx               # Badge component (6 variants)
    │       ├── button.tsx              # Button component (6 variants, 4 sizes)
    │       ├── dialog.tsx              # Dialog component (Radix)
    │       ├── input.tsx               # Input component
    │       ├── label.tsx               # Label component (Radix)
    │       └── tabs.tsx                # Tabs component (Radix)
    │
    ├── lib/
    │   ├── utils.ts                    # cn() — clsx + tailwind-merge
    │   ├── ai/
    │   │   ├── gemini-client.ts        # Gemini AI singleton + generateWithTools()
    │   │   └── function-declarations.ts # 3 Function Declarations (query, chart, suggest)
    │   ├── db/
    │   │   ├── index.ts                # createDatabaseAdapter() factory
    │   │   ├── postgres.ts             # PostgresAdapter (pg.Pool)
    │   │   ├── mysql.ts                # MySQLAdapter (mysql2/promise)
    │   │   └── mongodb-client.ts       # MongoDBAdapter (MongoClient)
    │   ├── i18n/
    │   │   ├── index.ts                # Barrel export
    │   │   ├── translations.ts         # Translations interface + EN/TR objects (80+ keys)
    │   │   └── language-context.tsx     # LanguageProvider + useLanguage() hook
    │   ├── theme/
    │   │   ├── index.ts                # Barrel export
    │   │   └── theme-context.tsx        # ThemeProvider + useTheme() hook
    │   └── storage/
    │       ├── index.ts                # Barrel export
    │       ├── connections.ts          # Connection CRUD (localStorage)
    │       ├── chat-history.ts         # Conversation history (max 20 messages)
    │       └── dashboard.ts            # Dashboard save/load
    │
    ├── services/
    │   ├── query-generator.ts          # AI Step 1: Text → SQL/MongoDB query
    │   ├── chart-formatter.ts          # AI Step 2: Data → ChartConfig
    │   └── suggestion-generator.ts     # AI: Schema → Smart query suggestions
    │
    ├── types/
    │   ├── api.ts                      # ApiResponse<T>, ConversationMessage
    │   ├── chart.ts                    # ChartType, ChartConfig, DashboardQueryResponse
    │   └── database.ts                 # DatabaseAdapter interface, all DB types
    │
    └── utils/
        ├── query-sanitizer.ts          # SQL/MongoDB query security sanitization
        ├── validators.ts               # Form validation + prompt sanitization
        ├── export.ts                   # PNG/CSV/JSON export
        └── __tests__/
            ├── query-sanitizer.test.ts # 38 security test cases
            └── validators.test.ts      # 23 validation test cases
```

---

## 🤖 AI Pipeline

InsightNode uses Google Gemini's **Function Calling** feature. This guarantees the AI always returns structured JSON instead of free text.

### Model
```
gemini-2.0-flash
```

### Function Calling Mode
```typescript
toolConfig: {
    functionCallingConfig: {
        mode: FunctionCallingConfigMode.ANY  // Mandatory function call
    }
}
```

### Step 1: Natural Language → Database Query

**Service**: `src/services/query-generator.ts`

```
User question + Database schema + Conversation history
                    │
                    ▼
            Gemini AI API
        Tool: execute_database_query
                    │
                    ▼
    { query_string, query_type, explanation }
```

**Prompt structure:**
- System role: "Expert {PostgreSQL/MySQL/MongoDB} database analyst"
- Full schema description (table names, column names/types/nullability)
- Last 10 conversation messages (multi-turn support)
- Language directive ("Generate explanations in Turkish")
- Detailed rules: GROUP BY, JOIN, alias, LIMIT, chart-friendly data shape

**Function Declaration:**
```typescript
{
    name: "execute_database_query",
    parameters: {
        query_string: STRING,    // SQL or MongoDB JSON query
        query_type: STRING,      // "sql" | "aggregation"
        explanation: STRING      // Human-readable explanation
    }
}
```

### Step 2: Data → Chart Configuration

**Service**: `src/services/chart-formatter.ts`

```
Column names + 3 sample rows + User question
                    │
                    ▼
            Gemini AI API
            Tool: render_chart
                    │
                    ▼
    { chart_type, title, x_axis_key, data_keys, colors, kpi_* }
```

**Privacy**: Only column names and first 3 rows are sent to Gemini. The full dataset is never transmitted to the AI.

**Selection matrix (in prompt):**
- Bar → Comparisons
- Line → Time trends
- Area → Cumulative data
- Pie → Proportional distributions
- Scatter → Correlations
- KPI → Single value results
- Table → Detailed, multi-column data

### Step 3: Smart Suggestions

**Service**: `src/services/suggestion-generator.ts`

```
Database schema + Language preference
            │
            ▼
      Gemini AI API
    Tool: suggest_queries
            │
            ▼
    6 schema-specific query suggestions
```

**Fallback**: If Gemini fails, 6 default generic questions are returned based on language.

---

## 🗄 Database Adapter System

InsightNode uses the **Adapter Pattern** to support three different databases through a single interface.

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

### Adapter Details

| Adapter | Driver | Connection | Schema Source | Query Mechanism |
|---------|--------|------------|--------------|-----------------|
| **PostgresAdapter** | `pg.Pool` | host/port/user/pass/db/ssl, max 5 connections, 30s idle timeout | `information_schema.tables` + `columns` (public schema) | `pool.query(sql)` |
| **MySQLAdapter** | `mysql2.createPool` | host/port/user/pass/db/ssl, limit 5, 10s timeout | `information_schema.TABLES` + `COLUMNS` | `pool.query<RowDataPacket[]>(sql)` |
| **MongoDBAdapter** | `MongoClient` | URI or field-based, 10s timeout | `db.listCollections()` + `findOne()` sample-based | JSON parse → `collection.find()` or `.aggregate()` |

### Lifecycle

```
connect() → getSchema() → executeQuery() → disconnect()
```

Each API call follows this lifecycle. `testConnection()` follows a connect → trivial op → disconnect sequence.

---

## 🛡 Security Layer

Every AI-generated query goes through multi-layer security checks before being executed on the database.

### SQL Sanitization (`sanitizeSQLQuery`)

```
AI Output (query_string)
        │
        ▼
    ① Length check (max 10,000 characters)
        │
        ▼
    ② MySQL nested comment detection (/*!50000 ...*/ blocking)
        │
        ▼
    ③ Comment stripping (-- and /* */ removal)
        │
        ▼
    ④ Empty query check
        │
        ▼
    ⑤ Blocked keyword check (17 keywords):
       DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER,
       CREATE, GRANT, REVOKE, EXEC, EXECUTE, CALL,
       MERGE, REPLACE, RENAME, LOAD, SOURCE
       → Word-boundary regex (\b) for false-positive protection
        │
        ▼
    ⑥ Blocked pattern check:
       INTO OUTFILE, INTO DUMPFILE, INTO LOCAL,
       SET (without FROM)
        │
        ▼
    ⑦ Start assertion: Must begin with SELECT or WITH
        │
        ▼
    ✅ Safe query → Send to database
```

### MongoDB Sanitization (`sanitizeMongoOperation`)

```
Whitelist approach:
    ✅ find, aggregate, countDocuments, estimatedDocumentCount, distinct
    ❌ deleteMany, insertOne, updateMany, drop, rename, etc.
```

### False-Positive Protection

Using `\b` word boundary regex ensures that `updated_at` column is not blocked as "UPDATE" and `settings` table is not detected as "SET".

### Test Coverage

38 dedicated test cases validate all attack vectors:
- All 17 blocked keywords
- Case variations (upper/lower/mixed)
- Hidden attempts inside comment lines
- Destructive operations within subqueries
- `INTO OUTFILE` / `INTO DUMPFILE` / `LOAD DATA`
- MySQL conditional comments (`/*!*/`)
- Edge cases (empty, whitespace, max length)

---

## 📡 API Reference

### `POST /api/auth` — Login

```typescript
// Request
{ password: string }

// Success Response (200) — httpOnly cookie is set
{ success: true }

// Error Response (401)
{ success: false, error: "Invalid password." }
```

### `DELETE /api/auth` — Logout

```typescript
// Response (200) — cookie is cleared
{ success: true }
```

### `POST /api/connections` — Test & Connect

```typescript
// Request
{
    name: string,
    type: "postgresql" | "mysql" | "mongodb",
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    ssl: boolean,
    connectionString?: string,       // MongoDB URI mode
    connectionMode?: "manual" | "uri" // MongoDB connection mode
}

// Success Response
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

### `POST /api/query` — AI Query Pipeline

```typescript
// Request
{
    prompt: string,                          // Natural language question
    locale?: string,                         // "en" | "tr"
    connection: ConnectionFormData & { id },  // Connection details
    conversationHistory?: ConversationMessage[], // Previous messages
    streaming?: boolean                       // Streaming mode
}

// Standard Response (streaming: false)
{
    success: true,
    data: {
        chartConfig: {
            chartType: "bar",
            title: "Monthly Sales Totals",
            xAxisKey: "month",
            dataKeys: ["total_sales"],
            colors: [{ key: "total_sales", color: "#6366f1" }],
            data: [{ month: "January", total_sales: 15000 }, ...]
        },
        generatedQuery: "SELECT ... FROM ...",
        queryType: "sql",
        executionTimeMs: 45,
        rowCount: 12
    }
}

// Streaming Response (streaming: true)
// Content-Type: application/x-ndjson
{"step":"generating"}
{"step":"validating"}
{"step":"executing"}
{"step":"charting"}
{"step":"done","data":{...DashboardQueryResponse}}
// On error:
{"step":"error","error":"Error message"}
```

### `POST /api/suggestions` — Smart Suggestions

```typescript
// Request
{ schema: DatabaseSchema, locale?: string }

// Response
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

### `POST /api/schema` — Schema Extraction

```typescript
// Request: ConnectionFormData
// Response
{ success: true, data: DatabaseSchema }
```

---

## 🔐 Authentication

```
                                ┌─────────────────┐
                                │   .env.local     │
                                │ ADMIN_PASSWORD=? │
                                └────────┬────────┘
                                         │
                            ┌────────────┴────────────┐
                            │                         │
                    ADMIN_PASSWORD                ADMIN_PASSWORD
                       is set                      is NOT set
                            │                         │
                            ▼                         ▼
                    ┌───────────────┐         ┌──────────────┐
                    │  Middleware    │         │  Auth disabled│
                    │  cookie check │         │  open access  │
                    └───────┬───────┘         │  for everyone │
                            │                 └──────────────┘
                  no cookie │ has cookie
                      │          │
                      ▼          ▼
              ┌──────────┐  ┌───────────┐
              │ Redirect  │  │  Show     │
              │ to /login │  │  content  │
              │           │  │ (valid)   │
              └─────┬─────┘  └───────────┘
                    │
                    ▼
              POST /api/auth
              { password }
                    │
              password === ADMIN_PASSWORD?
              ├─ Yes → Generate 32-byte hex token
              │        Set httpOnly cookie (7 days)
              │        → Redirect to Dashboard
              └─ No  → 401 "Invalid password"
```

**Security notes:**
- Token generated cryptographically secure via `crypto.getRandomValues(new Uint8Array(32))`
- Cookie: `httpOnly` (no JS access), `secure` (in production), `sameSite: "lax"`
- Tokens stored in server memory (`globalThis.__insightnode_tokens` Set)
- Simple protection layer — not production-grade session management

---

## 🌍 Internationalization (i18n)

### Architecture

```typescript
// Type-safe translations
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
    // ... 80+ total keys
}
```

### Usage

```tsx
const { locale, t, toggleLocale } = useLanguage();

// In components:
<h1>{t.header.brand}</h1>
<p>{t.emptyState.readyTitle}</p>

// In AI prompts:
const instruction = t.ai.respondIn; // "Generate explanations in Turkish"
```

### Supported Languages
- 🇺🇸 **English** (default)
- 🇹🇷 **Turkish**

Language switching: One-click via the globe icon in the header.

---

## 🎨 Theming

### Modes

| Mode | Description |
|------|-------------|
| `dark` | Default. `#09090b` background, `#fafafa` text |
| `light` | `#fafafa` background, `#09090b` text |
| `system` | Follows OS preference (`prefers-color-scheme` media query) |

### CSS Variables

```css
/* Dark (default — @theme inline) */
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

### Persistence

localStorage key: `insightnode_theme`. Theme is preserved on page refresh.

### Special Effects

| Effect | Dark | Light |
|--------|------|-------|
| Glass Card | `rgba(10,10,15,0.6)` + blur | `rgba(255,255,255,0.7)` + subtle shadow |
| Glow Pulse | Blue-purple glow | Softer glow |
| Shimmer | `rgba(99,102,241,0.08)` | `rgba(99,102,241,0.04)` |
| Scrollbar | `#27272a` | `#d4d4d8` |

---

## 💾 localStorage Persistence

All modules are SSR-safe (`typeof window === "undefined"` check).

### Connections (`insightnode_connections`)

```typescript
interface SavedConnection extends ConnectionFormData {
    id: string;      // crypto.randomUUID()
    savedAt: string; // ISO timestamp
}
```

- Passwords obfuscated with `btoa(encodeURIComponent(password))`
- Upsert by name (updates if connection with same name exists)
- Active connection stored separately: `insightnode_active_connection`

### Chat History (`insightnode_chat_history`)

```typescript
interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}
```

- FIFO — max 20 messages
- Last 10 messages sent to API as `conversationHistory`
- Automatically cleared on new connection

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

Storage layer is ready; UI integration is planned for a future release.

---

## 📊 Chart Types

All charts are rendered with **Recharts** in `src/components/charts/dynamic-chart.tsx`.

| Type | Component | Features |
|------|-----------|----------|
| **Bar** | `<BarChart>` + `<Bar>` | Rounded top corners, max 50px width, angled labels for >5 data points |
| **Line** | `<LineChart>` + `<Line>` | Monotone interpolation, 2px stroke, r=3 dots, active dot r=5 |
| **Area** | `<AreaChart>` + `<Area>` | Monotone, 15% fill opacity, 2px stroke |
| **Pie** | `<PieChart>` + `<Pie>` | Donut style (inner radius 60, outer 130), `name: XX%` labels, 3° padding |
| **Scatter** | `<ScatterChart>` + `<Scatter>` | Both axes numeric, dashed cursor |
| **KPI** | Custom `KPIChart` | Large number + prefix/suffix, ↑↓ change indicator (green/red), mini sparkline |
| **Table** | Custom `TableChart` | Sortable headers (asc/desc), 10 rows/page, pagination controls |

### Common Styles

- **Tooltip**: Dark background (`rgba(10,10,15,0.95)`), border `#27272a`, 8px radius
- **Grid**: Dashed lines `#1a1a2e`
- **Axis**: `#a1a1aa` color, 11px font
- **Container**: `<ResponsiveContainer width="100%" height={360}>`
- **Color palette**: 8 default colors (starting with `#6366f1` indigo)

---

## 📤 Export System

The `src/utils/export.ts` module supports three formats:

| Format | Function | Details |
|--------|----------|---------|
| **PNG** | `exportChartAsPNG(elementId, title)` | `html2canvas` at 2x scale, dark background. SVG serialization fallback. |
| **CSV** | `exportDataAsCSV(data, filename)` | BOM (`\uFEFF`) with UTF-8 — Excel compatible. Values with commas/quotes/newlines are properly escaped. |
| **JSON** | `exportDataAsJSON(data, filename)` | 2-space indented pretty-print. `application/json` MIME type. |

**Trigger**: From each ChartCard's export dropdown menu (Download icon).

**Download mechanism**: `downloadBlob()` → Object URL → Programmatic `<a>` click → URL revoke.

---

## 🧪 Testing

### Configuration

```typescript
// vitest.config.ts
{
    test: {
        globals: true,          // describe, it, expect are global
        environment: "node",    // No DOM required
    },
    resolve: {
        alias: { "@": "./src" } // Path alias support
    }
}
```

### Test Files

| File | Test Count | Coverage |
|------|------------|----------|
| `query-sanitizer.test.ts` | 38+ | SQL keyword blocking, comment stripping, subquery attacks, INTO OUTFILE, LOAD DATA, MySQL comments, edge cases, false-positive protection, MongoDB whitelist |
| `validators.test.ts` | 23+ | Form validation (PG, MongoDB URI), prompt sanitization, port range, default ports |
| **Total** | **61** | Security + validation layers |

### Scripts

```bash
npm test            # Single run (vitest run)
npm run test:watch  # Watch mode (vitest)
```

---

## 💡 Smart Suggestions

```
Connection successful
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
    "Suggest 6 different questions: aggregation, trend,
     comparison, distribution, ranking — use real
     table/column names"
        │
        ▼
┌───────────────────────────────┐
│  Suggestions shown in 2 spots: │
│                               │
│  1. EmptyState                │
│     → Wrapped pill buttons    │
│     → Click → Run query       │
│                               │
│  2. Below CommandInput         │
│     → Horizontal scroll chips │
│     → Click → Run query       │
└───────────────────────────────┘
```

**Fallback**: If Gemini fails, 6 default generic questions are returned based on locale.

---

## 📡 Streaming Pipeline

### Why Streaming?

The AI pipeline consists of 4 stages and can take 3–10 seconds total. With a standard JSON response, the user sees a "loading" spinner for the entire duration. With streaming, each step is shown instantly.

### Protocol: NDJSON (Newline Delimited JSON)

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
    buffer = lines.pop() || "";  // Keep incomplete line in buffer

    for (const line of lines) {
        const chunk = JSON.parse(line);
        if (chunk.step) setQueryStep(chunk.step);
        if (chunk.data) setFinalResult(chunk.data);
    }
}
```

### QueryProgress Component

4 steps shown with animation:

```
[✓ Generating] ─── [● Validating] ─── [○ Executing] ─── [○ Charting]
   completed        active (spinner)     waiting           waiting
```

Each step: Loader2 spinner → Check animation (Framer Motion).

---

## � Getting Started

### Prerequisites

```
Node.js 18.17+ (20.x recommended)
npm 9+
Google Gemini API Key
```

### Installation

```bash
git clone https://github.com/bcsakalar/insightnode.git
cd insightnode
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# [REQUIRED] Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# [OPTIONAL] Admin password — if not set, auth is disabled
ADMIN_PASSWORD=your_password_here
```

#### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Paste the generated key into your `.env.local` file

### Development

```bash
npm run dev
# Open http://localhost:3000
# Starts with Turbopack — fast HMR (Hot Module Replacement)
```

### Production

```bash
npm run build
npm start
# Default port: 3000
```

### Run Tests

```bash
npm test            # Single run
npm run test:watch  # Watch mode
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key from [AI Studio](https://aistudio.google.com/apikey) |
| `ADMIN_PASSWORD` | ❌ No | — | Password for simple auth; if not set, auth is disabled |
| `NODE_ENV` | ❌ No | development | Affects cookie security (httpOnly: true only in production) |
| `PORT` | ❌ No | 3000 | Server port for `npm start` |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>InsightNode</strong> — Talk to your database with AI. ⚡
</p>