export default function MetricCard({ label, value, subValue, trend, color = 'default', icon: Icon }) {
  const colorClasses = {
    default: 'text-[var(--text-primary)]',
    profit: 'text-[var(--profit)]',
    loss: 'text-[var(--loss)]',
    accent: 'text-[var(--accent)]',
  };

  return (
    <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/5 group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[var(--text-muted)] font-medium">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
            <Icon size={16} className="text-[var(--accent)]" />
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color]} tracking-tight`}>
        {value}
      </p>
      {(subValue || trend) && (
        <div className="flex items-center gap-2 mt-1.5">
          {trend && (
            <span className={`text-xs font-medium ${trend > 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {subValue && (
            <span className="text-xs text-[var(--text-muted)]">{subValue}</span>
          )}
        </div>
      )}
    </div>
  );
}
