import { KeyRound } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ResultCard from './ResultCard.jsx';

export default function IndexSuggestions({ indexes = [], style }) {
  return (
    <ResultCard title="Index Recommendations" icon={KeyRound} className="animate-cardIn" style={style} tone="amber">
      {indexes.length ? (
        <div className="grid gap-4">
          {indexes.map((index, itemIndex) => (
            <article key={`${index.sql}-${itemIndex}`} className="border border-app-border bg-app-bg p-4">
              <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-app-muted">
                Suggested SQL
              </p>
              <div className="sql-code overflow-hidden">
                <SyntaxHighlighter language="sql" style={oneLight} customStyle={{ padding: '0.85rem' }}>
                  {index.sql}
                </SyntaxHighlighter>
              </div>
              <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-app-muted">Reason</p>
              <p className="mt-1 font-sans text-sm leading-6 text-app-muted">{index.reason}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-app-muted">No additional indexes recommended.</p>
      )}
    </ResultCard>
  );
}
