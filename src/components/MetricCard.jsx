'use client';

export default function MetricCard({ 
  label, 
  value, 
  subValue, 
  color = 'accent', 
  icon: Icon,
  trend 
}) {
  const colorStyles = {
    profit: 'text-[var(--profit)] bg-[var(--profit-bg)]',
    loss: 'text-[var(--loss)] bg-[var(--loss-bg)]',
    accent: 'text-[var(--accent)] bg-[var(--sidebar-active)]',
    neutral: 'text-[var(--text-secondary)] bg-[var(--card-hover)]',
  };

  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  const trendColor = isPositive ? 'text-[var(--profit)]' : isNegative ? 'text-[var(--loss)]' : 'text-[var(--text-muted)]';

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 transition-all duration-300 hover:border-[var(--accent)]/50 group shadow-sm hover:shadow-xl hover:shadow-[var(--accent)]/5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${colorStyles[color] || colorStyles.accent}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-bg)] border border-[var(--tag-bg)] ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {value}
          </h3>
          {subValue && (
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
