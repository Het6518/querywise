function highlightQuery(query) {
  const escaped = query
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/('[^']*')/g, '<span class="string">$1</span>')
    .replace(
      /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|ON|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|CREATE|INDEX|AS|DISTINCT|COUNT|SUM|AVG|YEAR)\b/gi,
      '<span class="keyword">$1</span>',
    );
}

function TabPanel({ label, children }) {
  return (
    <section className="relative border border-app-border border-l-[6px] border-l-app-amber bg-app-surface p-5 pl-8 shadow-paper">
      <div className="absolute -left-[27px] top-14 rotate-[-90deg] border border-app-border bg-app-bg px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-app-amber">
        {label}
      </div>
      {children}
    </section>
  );
}

export default function QueryInput({ value, onChange, onAnalyze, disabled }) {
  const lines = value.split('\n').length || 1;

  return (
    <TabPanel label="Query">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h2 className="font-display text-[24px] font-semibold text-app-text">Query Input</h2>
          <p className="mt-1 font-sans text-sm text-app-muted">Natural language or SQL source.</p>
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled}
          className="border border-app-accent bg-app-accent px-4 py-2 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#B94222] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Analyze →
        </button>
      </div>
      <div className="border border-app-border bg-app-code">
        <div className="flex items-center justify-between border-b border-app-border bg-app-mutedBg px-4 py-2">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-app-muted">Editor</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-app-muted">SQL</span>
        </div>
        <div className="grid grid-cols-[52px_1fr]">
          <div className="select-none border-r border-app-border bg-app-mutedBg px-3 py-4 text-right font-mono text-sm leading-6 text-app-muted">
            {Array.from({ length: Math.max(lines, 8) }, (_, index) => (
              <div key={index + 1}>{index + 1}</div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-[220px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-app-text outline-none placeholder:text-app-muted"
            placeholder={`Find students scoring above 80 marks

OR

SELECT *
FROM Students
WHERE YEAR(date)=2025`}
            spellCheck="false"
          />
        </div>
      </div>
      <pre
        className="editor-highlight mt-3 overflow-auto border border-app-border bg-app-bg p-3 font-mono text-xs leading-6"
        dangerouslySetInnerHTML={{ __html: highlightQuery(value || 'SELECT * FROM Students WHERE marks > 80') }}
      />
    </TabPanel>
  );
}
