import { CheckCircle2, CircleAlert } from 'lucide-react';
import ResultCard from './ResultCard.jsx';

export default function SyntaxValidation({ validation, style }) {
  const isValid = Boolean(validation?.isValid);
  const suggestions = validation?.suggestions || [];
  const mainLine = isValid ? 'No syntax errors were found.' : suggestions[0] || 'Review the SQL syntax and schema references.';

  return (
    <ResultCard
      title="Syntax Validation"
      icon={isValid ? CheckCircle2 : CircleAlert}
      tone={isValid ? 'success' : 'error'}
      className="animate-cardIn"
      style={style}
    >
      <div
        className={`border-l-[6px] p-4 ${
          isValid
            ? 'border-l-app-success bg-[#E3F0E8] text-app-success'
            : 'border-l-app-error bg-[#F8E4DE] text-app-error'
        }`}
      >
        <div className="flex items-center gap-3 font-sans text-[12px] font-bold uppercase tracking-[0.18em]">
          {isValid ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}
          {isValid ? 'Valid Syntax' : 'Invalid Syntax'}
        </div>
        <p className="mt-2 font-sans text-sm leading-6 text-app-text">{mainLine}</p>
      </div>
      {!isValid && suggestions.length > 0 ? (
        <ul className="mt-4 space-y-2 font-sans text-sm text-app-muted">
          {suggestions.slice(1).map((suggestion) => (
            <li key={suggestion} className="border border-app-border bg-app-bg p-3">
              {suggestion}
            </li>
          ))}
        </ul>
      ) : null}
    </ResultCard>
  );
}
