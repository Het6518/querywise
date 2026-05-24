import { AlertTriangle } from 'lucide-react';
import ResultCard from './ResultCard.jsx';

function splitIssue(issue) {
  const [title, ...rest] = String(issue).split(/[:.]\s+/);
  return {
    title: title || issue,
    description: rest.join('. ') || 'This pattern may increase query cost or reduce index effectiveness.',
  };
}

export default function OptimizationIssues({ issues = [], style }) {
  return (
    <ResultCard title="Optimization Issues" icon={AlertTriangle} tone="amber" className="animate-cardIn" style={style}>
      {issues.length ? (
        <ul className="space-y-4">
          {issues.map((issue, index) => {
            const parsed = splitIssue(issue);
            return (
            <li
              key={issue}
              className="group grid grid-cols-[56px_1fr] gap-4 border border-l-[3px] border-app-border border-l-app-amber bg-app-bg p-4 transition duration-300 ease-out hover:border-l-[5px] hover:bg-app-highlight"
            >
              <span className="font-display text-[30px] font-semibold leading-none text-app-border">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <strong className="block font-sans text-sm font-bold text-app-text">{parsed.title}</strong>
                <span className="mt-1 block font-sans text-sm leading-6 text-app-muted">{parsed.description}</span>
              </span>
            </li>
          );
          })}
        </ul>
      ) : (
        <p className="font-sans text-sm text-app-muted">No major optimization issues detected.</p>
      )}
    </ResultCard>
  );
}
