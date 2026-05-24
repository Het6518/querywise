import { WandSparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ResultCard from './ResultCard.jsx';

export default function GeneratedSQL({ sql, style }) {
  if (!sql) return null;

  return (
    <ResultCard title="Generated SQL" icon={WandSparkles} className="animate-cardIn" style={style}>
      <div className="sql-code overflow-hidden">
        <SyntaxHighlighter language="sql" style={oneLight} customStyle={{ padding: '1rem' }}>
          {sql}
        </SyntaxHighlighter>
      </div>
    </ResultCard>
  );
}
