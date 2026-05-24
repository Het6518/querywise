import { Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ResultCard from './ResultCard.jsx';

export default function OptimizedQuery({ sql, style }) {
  return (
    <ResultCard title="Optimized Query" icon={Sparkles} className="animate-cardIn" style={style} tone="success">
      <div className="sql-code overflow-hidden">
        <SyntaxHighlighter language="sql" style={oneLight} customStyle={{ padding: '1rem' }}>
          {sql || '-- No optimized query returned'}
        </SyntaxHighlighter>
      </div>
    </ResultCard>
  );
}
