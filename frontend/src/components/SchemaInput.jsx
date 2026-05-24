function parseSchema(schema) {
  const matches = [...schema.matchAll(/([A-Za-z_][\w]*)\s*\(([\s\S]*?)\)/g)];
  return matches.map((match) => ({
    name: match[1],
    columns: match[2]
      .split(',')
      .map((column) => column.trim())
      .filter(Boolean)
      .map((column) => {
        const isPrimary = /\bid\b/i.test(column) && !/_id\b/i.test(column);
        const isForeign = /_id\b/i.test(column);
        return { name: column, type: isPrimary ? 'PK' : isForeign ? 'FK' : 'COL' };
      }),
  }));
}

function TabPanel({ label, children }) {
  return (
    <section className="relative border border-app-border border-l-[6px] border-l-app-accent bg-app-surface p-5 pl-8 shadow-paper">
      <div className="absolute -left-[33px] top-16 rotate-[-90deg] border border-app-border bg-app-bg px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-app-accent">
        {label}
      </div>
      {children}
    </section>
  );
}

export default function SchemaInput({ value, onChange }) {
  const tables = parseSchema(value);

  return (
    <TabPanel label="Schema">
      <div className="mb-5">
        <h2 className="font-display text-[24px] font-semibold text-app-text">Database Schema</h2>
        <p className="mt-1 font-sans text-sm text-app-muted">Tables and relationships inferred from the source.</p>
      </div>
      <div className="space-y-4">
        {tables.length ? (
          tables.map((table) => (
            <article key={table.name} className="border border-app-border bg-app-bg p-4">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-app-text">
                  {table.name}
                </h3>
                <div className="h-px flex-1 bg-app-border" />
              </div>
              <div className="space-y-2">
                {table.columns.map((column) => (
                  <div key={column.name} className="flex items-center justify-between gap-3 font-mono text-sm">
                    <span className="text-app-text">{column.name}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        column.type === 'PK'
                          ? 'bg-app-accent text-white'
                          : column.type === 'FK'
                            ? 'bg-app-amber text-app-text'
                            : 'bg-app-mutedBg text-app-muted'
                      }`}
                    >
                      {column.type}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="border border-dashed border-app-border bg-app-bg p-4 font-sans text-sm text-app-muted">
            Add tables using TableName(column, column_id) notation.
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-5 min-h-[150px] w-full resize-y border border-app-border bg-app-code p-4 font-mono text-sm leading-6 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent"
        placeholder={`Students(
id,
name,
marks,
course_id
)

Courses(
course_id,
course_name
)`}
        spellCheck="false"
      />
    </TabPanel>
  );
}
