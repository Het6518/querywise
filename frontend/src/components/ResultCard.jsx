export default function ResultCard({ title, icon: Icon, children, className = '', tone = 'accent', style }) {
  const tones = {
    accent: 'border-l-app-accent',
    amber: 'border-l-app-amber',
    success: 'border-l-app-success',
    error: 'border-l-app-error',
  };

  return (
    <section
      className={`paper-card border-l-[6px] ${tones[tone] || tones.accent} p-6 transition duration-300 ${className}`}
      style={style}
    >
      <div className="mb-5 flex items-center gap-3">
        {Icon ? (
          <span className="grid h-8 w-8 place-items-center border border-app-border bg-app-mutedBg text-app-text">
            <Icon size={16} strokeWidth={1.8} />
          </span>
        ) : null}
        <h2 className="font-display text-[22px] font-semibold leading-tight text-app-text">{title}</h2>
        <div className="h-px flex-1 bg-app-border" />
      </div>
      {children}
    </section>
  );
}
