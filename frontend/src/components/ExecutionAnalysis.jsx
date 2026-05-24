import { Activity } from 'lucide-react';
import ResultCard from './ResultCard.jsx';

export default function ExecutionAnalysis({ analysis = {}, style }) {
  const items = [
    ['Cost basis', analysis.estimatedCost ?? 'Normalized cost scale: N/A'],
    ['Row basis', analysis.rowsScanned ?? '10,000-row baseline'],
    ['Bottlenecks', analysis.bottlenecks ?? 'N/A'],
  ];

  return (
    <ResultCard title="Execution Analysis" icon={Activity} className="animate-cardIn" style={style}>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="border border-app-border bg-app-bg p-4">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-app-muted">{label}</p>
            <p className="mt-3 font-mono text-sm leading-6 text-app-text">{value}</p>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
