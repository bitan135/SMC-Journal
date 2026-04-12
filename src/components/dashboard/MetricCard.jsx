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
    profit: 'text-[var(--profit)] bg-[var(--profit-bg)] border-[var(--profit)]/20',
    loss: 'text-[var(--loss)] bg-[var(--loss-bg)] border-[var(--loss)]/20',
    accent: 'text-[var(--accent)] bg-[var(--accent)]/5 border-[var(--accent)]/20',
    neutral: 'text-[var(--text-secondary)] bg-[var(--glass-bg)] border-[var(--glass-border)]',
  };

  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  const trendColor = isPositive 
    ? 'text-emerald-500 dark:text-emerald-400' 
    : isNegative 
      ? 'text-rose-500 dark:text-rose-400' 
      : 'text-[var(--text-muted)]';

  return (
    <div className="glass-card shadow-premium transition-all duration-500 hover:scale-[1.02] hover:border-[var(--accent)]/40 group relative overflow-hidden animate-fade-in">
      {/* Dynamic Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg ${colorStyles[color] || colorStyles.accent}`}>
            {Icon && <Icon size={26} />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-inner`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className={`text-[11px] font-black tracking-[0.2em] ${trendColor}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4 leading-relaxed group-hover:text-[var(--accent)] transition-colors">
            {label}
          </p>
          <div className="flex flex-col gap-1 mt-1">
            <h3 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tighter leading-none truncate">
              {value}
            </h3>
            {subValue && (
              <p className="text-[10px] md:text-[11px] text-[var(--text-muted)] font-black uppercase tracking-widest opacity-80 truncate">
                {subValue}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
