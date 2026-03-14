export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="px-3 pb-4">
        {children}
      </div>
    </div>
  );
}
