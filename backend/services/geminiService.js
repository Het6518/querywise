import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const FALLBACK_MODELS = ['gemini-2.0-flash-lite', 'gemini-flash-lite-latest', 'gemini-2.0-flash'];
const ASSUMED_ROW_COUNT = 10000;

const SYSTEM_PROMPT = `You are a SQL optimizer. Return JSON only, no markdown.
Input is schema + either natural language or SQL.
Use this exact shape:
{"isNaturalLanguage":boolean,"generatedSQL":string,"syntaxValidation":{"isValid":boolean,"suggestions":string[]},"optimizationIssues":string[],"optimizedQuery":string,"indexRecommendations":[{"sql":string,"reason":string}],"executionAnalysis":{"estimatedCost":number,"rowsScanned":number,"bottlenecks":string},"performanceComparison":[{"metric":"Cost","before":number,"after":number},{"metric":"Rows scanned","before":number,"after":number}],"queryTree":{"nodes":[{"id":string,"label":string,"position":{"x":number,"y":number},"active":boolean}],"edges":[{"id":string,"source":string,"target":string}]}}
Rules: detect NL vs SQL. If NL, generate SQL; if SQL, generatedSQL="". Validate syntax. List only optimization issues. Produce runnable optimized SQL. Recommend CREATE INDEX statements. Estimate without a live DB. Normalize rows to 10000: Rows scanned before=10000, after=1..10000. Cost before=100, after proportional to optimized rows. Query tree labels should be SQL ops like SELECT,FILTER,JOIN,GROUP BY,SORT,TABLE.`;

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
  const compactSchema = schema.trim().slice(0, 6000);
  const compactQuery = query.trim().slice(0, 2500);

  const prompt = `Schema:
${compactSchema}

Query:
${compactQuery}`;

  const modelNames = [MODEL_NAME, ...FALLBACK_MODELS].filter(
    (modelName, index, models) => modelName && models.indexOf(modelName) === index,
  );
  let lastError;

  for (const modelName of modelNames) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        candidateCount: 1,
        maxOutputTokens: 1600,
      },
    });

    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();

      if (!text.trim()) {
        throw new Error('Empty response returned from Gemini.');
      }

      return normalizeResult(safeParseJson(text));
    } catch (error) {
      lastError = error;
      const message = error?.message || '';
      const shouldTryFallback =
        message.includes('429') ||
        message.toLowerCase().includes('quota') ||
        message.includes('503') ||
        message.toLowerCase().includes('overloaded') ||
        message.includes('not found for API version') ||
        message.includes('is not supported for generateContent');

      if (!shouldTryFallback) {
        throw new Error(message || 'Gemini request failed.');
      }
    }
  }

  throw new Error(lastError?.message || 'Gemini request failed.');
}
