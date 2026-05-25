import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash';
const ASSUMED_ROW_COUNT = 10000;

const SYSTEM_PROMPT = `You are an expert SQL query optimizer and database execution plan analyst.
Return only valid JSON. Do not wrap the response in markdown.
Analyze the provided database schema and user query. The user query may be natural language or raw SQL.

Required JSON shape:
{
  "isNaturalLanguage": true,
  "generatedSQL": "",
  "syntaxValidation": {
    "isValid": true,
    "suggestions": []
  },
  "optimizationIssues": [],
  "optimizedQuery": "",
  "indexRecommendations": [
    {
      "sql": "",
      "reason": ""
    }
  ],
  "executionAnalysis": {
    "estimatedCost": 0,
    "rowsScanned": 0,
    "bottlenecks": ""
  },
  "performanceComparison": [
    {
      "metric": "Cost",
      "before": 0,
      "after": 0
    },
    {
      "metric": "Rows scanned",
      "before": 0,
      "after": 0
    }
  ],
  "queryTree": {
    "nodes": [
      {
        "id": "1",
        "label": "SELECT",
        "position": { "x": 240, "y": 20 },
        "active": false
      }
    ],
    "edges": [
      {
        "id": "e1-2",
        "source": "1",
        "target": "2"
      }
    ]
  }
}

Rules:
- If the input is natural language, set isNaturalLanguage to true and fill generatedSQL.
- If the input is raw SQL, set isNaturalLanguage to false and generatedSQL to an empty string.
- Validate SQL syntax against the schema. If invalid, provide concise correction suggestions.
- Identify only query optimization issues. Do not add unrelated product features or explanations.
- Optimized SQL should be runnable SQL and should avoid SELECT * when columns can be inferred.
- Index recommendations must include CREATE INDEX statements and reasons.
- Execution and performance estimates may be reasoned estimates when an actual database engine is unavailable.
- All row scan estimates must be normalized to an assumed table size of exactly 10,000 rows.
- The "Rows scanned" performance metric must use before = 10000 and after as an estimated optimized scan count between 1 and 10000.
- The "Cost" performance metric must use a normalized 0-100 scale, where before = 100 and after is proportional to optimized rows scanned.
- Query tree nodes must represent SQL operations such as SELECT, FILTER, JOIN, GROUP BY, SORT, TABLE.
- Use numeric values for performanceComparison before and after fields.`;

function stripJsonFence(text = '') {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function safeParseJson(text) {
  const cleaned = stripJsonFence(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Invalid JSON returned from Gemini.');
  }
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(Math.max(Math.round(numeric), min), max);
}

function normalizePerformanceComparison(parsedComparison) {
  const comparison = normalizeArray(parsedComparison);
  const rowMetric = comparison.find((item) => /rows/i.test(item?.metric || ''));
  const optimizedRows = clampNumber(rowMetric?.after ?? ASSUMED_ROW_COUNT * 0.2, 1, ASSUMED_ROW_COUNT);
  const optimizedCost = clampNumber((optimizedRows / ASSUMED_ROW_COUNT) * 100, 1, 100);

  return [
    {
      metric: 'Cost',
      before: 100,
      after: optimizedCost,
    },
    {
      metric: 'Rows scanned',
      before: ASSUMED_ROW_COUNT,
      after: optimizedRows,
    },
  ];
}

function normalizeResult(parsed) {
  const performanceComparison = normalizePerformanceComparison(parsed.performanceComparison);
  const rowsScanned = performanceComparison.find((item) => item.metric === 'Rows scanned')?.after;
  const estimatedCost = performanceComparison.find((item) => item.metric === 'Cost')?.after;

  return {
    isNaturalLanguage: Boolean(parsed.isNaturalLanguage),
    generatedSQL: parsed.generatedSQL || '',
    syntaxValidation: {
      isValid: Boolean(parsed.syntaxValidation?.isValid),
      suggestions: normalizeArray(parsed.syntaxValidation?.suggestions),
    },
    optimizationIssues: normalizeArray(parsed.optimizationIssues),
    optimizedQuery: parsed.optimizedQuery || '',
    indexRecommendations: normalizeArray(parsed.indexRecommendations).map((item) => ({
      sql: item?.sql || '',
      reason: item?.reason || '',
    })),
    executionAnalysis: {
      estimatedCost: `Normalized cost scale: ${estimatedCost}/100`,
      rowsScanned: `10,000-row baseline; optimized scan estimate: ${rowsScanned}`,
      bottlenecks: parsed.executionAnalysis?.bottlenecks || 'N/A',
    },
    performanceComparison,
    queryTree: {
      nodes: normalizeArray(parsed.queryTree?.nodes),
      edges: normalizeArray(parsed.queryTree?.edges),
    },
  };
}

export async function analyzeQueryWithGemini({ schema, query }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `Database schema:
${schema}

User query:
${query}`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  if (!text.trim()) {
    throw new Error('Empty response returned from Gemini.');
  }

  return normalizeResult(safeParseJson(text));
}
