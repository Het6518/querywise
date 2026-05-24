import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import SchemaInput from '../components/SchemaInput.jsx';
import QueryInput from '../components/QueryInput.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import GeneratedSQL from '../components/GeneratedSQL.jsx';
import SyntaxValidation from '../components/SyntaxValidation.jsx';
import OptimizationIssues from '../components/OptimizationIssues.jsx';
import OptimizedQuery from '../components/OptimizedQuery.jsx';
import IndexSuggestions from '../components/IndexSuggestions.jsx';
import ExecutionAnalysis from '../components/ExecutionAnalysis.jsx';
import PerformanceComparison from '../components/PerformanceComparison.jsx';
import QueryTree from '../components/QueryTree.jsx';
import ResultCard from '../components/ResultCard.jsx';
import { analyzeQuery } from '../services/api.js';

const initialSchema = `Students(
id,
name,
marks,
course_id
)

Courses(
course_id,
course_name
)`;

export default function Home() {
  const [schema, setSchema] = useState(initialSchema);
  const [query, setQuery] = useState('Find students scoring above 80 marks');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canAnalyze = useMemo(() => schema.trim() && query.trim() && !isLoading, [schema, query, isLoading]);

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await analyzeQuery({ schema, query });
      if (!response || response.error) {
        throw new Error(response?.message || 'Unable to analyze query');
      }
      setResult(response);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to analyze query');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar />
      <main className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 lg:grid-cols-[38%_1fr] lg:px-8">
        <aside className="animate-slideLeft space-y-7 lg:sticky lg:top-[104px] lg:self-start">
          <SchemaInput value={schema} onChange={setSchema} />
          <QueryInput value={query} onChange={setQuery} onAnalyze={handleAnalyze} disabled={!canAnalyze} />
        </aside>

        <section className="animate-slideRight min-h-[calc(100vh-132px)] space-y-14 overflow-y-auto">
          {isLoading ? <LoadingSpinner /> : null}

          {error ? (
            <ResultCard title="Unable to analyze query" icon={AlertCircle} tone="error">
              <p className="text-sm leading-6 text-app-muted">{error}</p>
            </ResultCard>
          ) : null}

          {!isLoading && !error && !result ? (
            <div className="paper-card grid min-h-[360px] place-items-center border-l-[6px] border-l-app-accent p-10 text-center">
              <div className="max-w-md">
                <p className="font-display text-[34px] font-semibold leading-tight text-app-text">Ready to analyze a query</p>
                <p className="mt-4 font-sans text-sm leading-7 text-app-muted">
                  Add a schema and either natural language or SQL, then run the optimizer.
                </p>
              </div>
            </div>
          ) : null}

          {result ? (
            <>
              <GeneratedSQL sql={result.generatedSQL} style={{ animationDelay: '0ms' }} />
              <SyntaxValidation validation={result.syntaxValidation} style={{ animationDelay: '100ms' }} />
              <OptimizationIssues issues={result.optimizationIssues} style={{ animationDelay: '200ms' }} />
              <OptimizedQuery sql={result.optimizedQuery} style={{ animationDelay: '300ms' }} />
              <IndexSuggestions indexes={result.indexRecommendations} style={{ animationDelay: '400ms' }} />
              <ExecutionAnalysis analysis={result.executionAnalysis} style={{ animationDelay: '500ms' }} />
              <PerformanceComparison comparison={result.performanceComparison} style={{ animationDelay: '600ms' }} />
              <QueryTree tree={result.queryTree} style={{ animationDelay: '700ms' }} />
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}
