<div align="center">

<img src="https://img.shields.io/badge/QueryWise-SQL%20Optimizer-4f46e5?style=for-the-badge&logo=postgresql&logoColor=white" alt="QueryWise" height="40"/>

# ⚡ QueryWise — AI-Powered SQL Query Optimizer

**Write SQL smarter. Execute faster. Understand deeper.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

<br/>

> *Because a slow query in production is a problem you never want to debug at 2 AM.*

<br/>

[🚀 Live Demo](https://querywise-nine.vercel.app/) &nbsp;|&nbsp; [⚙️ Setup Guide](#-getting-started) &nbsp;|&nbsp; [🤖 AI Features](#-ai-chat-assistant)

</div>

---

## 📌 Overview

**QueryWise** is a full-stack AI-powered SQL optimization platform that transforms the way developers, data analysts, and database administrators interact with their queries. Whether you're starting from plain English or pasting a slow SQL statement, QueryWise analyzes your query, detects bottlenecks, rewrites it for peak performance, and explains every decision — visually.

From natural language to optimized SQL in seconds. No more guessing why your query scans a million rows when it shouldn't.

---

## ✨ Key Features

### 🗣️ Natural Language → SQL Generation
Describe what you need in plain English, and QueryWise generates accurate, schema-aware SQL:

> *"Show top 10 customers who spent the most money in the last 6 months"*

```sql
SELECT customer_id, SUM(amount) AS total_spent
FROM orders
WHERE order_date >= NOW() - INTERVAL '6 months'
GROUP BY customer_id
ORDER BY total_spent DESC
LIMIT 10;
```

Supports schema-aware prompting — paste your table definitions and get queries that actually match your structure.

---

### 🔍 SQL Syntax Validation
Catches errors before they hit your database. QueryWise detects syntax mistakes and suggests the correct fix:

```sql
-- ❌ Input
SELECT name age FROM students

-- ✅ Suggestion
SELECT name, age FROM students
--           ^ Missing comma detected
```

---

### 🚀 Query Optimization Engine
Identifies common anti-patterns and rewrites them for performance:

| Pattern | Bad Practice | Optimized |
|---|---|---|
| Function on indexed column | `WHERE YEAR(order_date) = 2025` | `WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31'` |
| Wildcard select | `SELECT *` | Select only required columns |
| Nested subqueries | Correlated subquery | Rewritten as JOIN |
| Missing filter pushdown | Filter applied after join | Filter pushed before join |

**Optimization rules applied:**
- Remove unnecessary `JOIN`s and subqueries
- Avoid `SELECT *` — project only needed columns
- Push `WHERE` filters earlier in the execution plan
- Rewrite function calls on indexed columns
- Flatten correlated subqueries into efficient joins

---

### 📈 Index Recommendation System
Analyzes your query and recommends the exact indexes to create:

```sql
-- Input query
SELECT * FROM users WHERE email = 'abc@gmail.com';

-- Suggested index
CREATE INDEX idx_users_email ON users(email);
-- Expected improvement: full table scan → index seek
```

---

### ⚖️ Before vs. After Performance Comparison
Side-by-side metrics showing exactly how much the optimization helped:

| Metric | Original | Optimized |
|---|---:|---:|
| Execution time | 900 ms | 120 ms |
| Rows scanned | 100,000 | 5,000 |
| Query cost | 8,000 | 1,000 |

---

### 🗺️ Visual Query Flow
See your query as a logical execution graph — no more mental model gymnastics:

```
Input Table(s)
      ↓
   Filtering
      ↓
    Joining
      ↓
  Aggregation
      ↓
    Result
```

Each stage highlights what's happening, making complex multi-table queries easy to understand and debug.

---

### 🤖 AI Chat Assistant
Ask anything about your query in natural language:

> *"Why is my query slow?"*

> **QueryWise:** *Your query performs a full table scan because no index exists on `customer_id`. Adding `CREATE INDEX idx_customer_id ON orders(customer_id)` would reduce rows scanned from 250,000 to approximately 340.*

The assistant is context-aware — it understands the query you're working with and gives precise, actionable explanations.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React + Vite** | Fast, lightweight frontend with HMR during development |
| **Tailwind CSS** | Utility-first styling and responsive design |
| **JSX Components** | Modular UI — each feature is its own isolated component |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express** | RESTful API server handling query analysis requests |
| **analyze.js route** | Core endpoint that orchestrates the optimization pipeline |
| **geminiService.js** | Gemini API client, prompt engineering, and response parsing |

### Integrations & Services

| Service | Purpose |
|---|---|
| **Google Gemini API** | NL→SQL generation, optimization engine, AI chat assistant |
| **Vercel** | Frontend deployment and CI/CD |

---

## 📁 Project Structure

```
querywise/
├── backend/
│   ├── routes/
│   │   └── analyze.js             # Core query analysis route
│   ├── services/
│   │   └── geminiService.js       # Gemini API client and prompt logic
│   ├── server.js                  # Express server entry point
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ExecutionAnalysis.jsx     # Execution plan breakdown
    │   │   ├── GeneratedSQL.jsx          # Displays NL → SQL output
    │   │   ├── IndexSuggestions.jsx      # Recommended indexes
    │   │   ├── LoadingSpinner.jsx        # Loading state UI
    │   │   ├── Navbar.jsx                # Top navigation bar
    │   │   ├── OptimizationIssues.jsx    # Detected anti-patterns list
    │   │   ├── OptimizedQuery.jsx        # Rewritten optimized SQL
    │   │   ├── PerformanceCompar.jsx     # Before vs after metrics table
    │   │   ├── QueryInput.jsx            # SQL / NL input field
    │   │   ├── QueryTree.jsx             # Visual query flow graph
    │   │   ├── ResultCard.jsx            # Reusable result display card
    │   │   ├── SchemaInput.jsx           # Database schema input
    │   │   └── SyntaxValidation.jsx      # Syntax error feedback
    │   ├── pages/
    │   │   └── Home.jsx                  # Main optimizer page
    │   ├── services/
    │   │   └── api.js                    # Frontend API calls to backend
    │   ├── App.jsx                       # Root app component
    │   ├── main.jsx                      # React entry point
    │   └── styles.css                    # Global styles
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── postcss.config.js
    ├── package.json
    └── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- A **Google Gemini** API key ([Get one here](https://ai.google.dev/))

### 1. Clone the Repository

```bash
git clone https://github.com/Het6518/querywise.git
cd querywise
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The API will be running at `http://localhost:5000`.

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL="http://localhost:5000"
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌍 Deployment

The frontend is deployed from the **`frontend/` folder on Vercel**. The backend is deployed separately from the **`backend/` folder on Render**.

Current deployed backend:

```text
https://query-optimizer-backend.onrender.com
```

The frontend calls this backend through `frontend/src/services/api.js`. In production, the app uses the Render URL unless `VITE_API_URL` is provided.

### Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the following in your Vercel project under **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `VITE_API_URL` | `https://query-optimizer-backend.onrender.com` |

### Deploy Backend

**Render**:
1. Create a new Web Service.
2. Set root directory to `backend/`.
3. Set build command to `npm install`.
4. Set start command to `npm start`.
5. Add `GEMINI_API_KEY` as an environment variable.
6. Redeploy after changing environment variables.

---

## 🔭 Future Improvements

The roadmap for QueryWise includes several high-impact features:

- **📊 Query History & Analytics** — Track optimization history and measure cumulative performance gains over time
- **🔌 Live Database Connection** — Connect directly to a live database and run actual execution plans (`EXPLAIN ANALYZE`)
- **🗄️ Multi-dialect Support** — Extend beyond PostgreSQL to MySQL, SQLite, and BigQuery dialects
- **🧩 Schema Import** — Paste a `CREATE TABLE` dump and get fully schema-aware suggestions
- **📤 Export** — Download optimized queries and reports as PDF or share via link
- **👥 Team Workspaces** — Collaborate on query reviews with annotation and commenting
---
## ⚡ Performance & Optimization

- **Lazy Loading** — Heavy editor and visualization components are dynamically imported to reduce initial bundle size
- **Debounced Inputs** — SQL editor and NL input are debounced to avoid redundant API calls during typing
- **Streaming Responses** — AI responses stream progressively for a snappy, real-time feel
- **Edge-Ready** — API routes are compatible with Vercel Edge Runtime for low-latency global responses

---

## 👤 Contributor

<table>
  <tr>
    <td align="center">
      <b>Het Shah</b><br/>
      <a href="https://github.com/Het6518">@Het6518</a><br/>
      <sub>Full-Stack Developer · Designer · Builder</sub>
    </td>
    <td align="center">
      <b>Jenil Mehta</b><br/>
      <a href="https://github.com/MLinej">@MLinej</a><br/>
      <sub>Full-Stack Developer · Designer · Builder</sub>
    </td>
  </tr>
</table>

---

<div align="center">

*Built for developers who care about performance — and the databases that power them.*

**QueryWise** — Because every millisecond counts.

<br/>

⭐ If you found this project useful, consider starring the repository!

</div>
