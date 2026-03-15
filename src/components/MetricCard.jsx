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
    neutral: 'text-[var(--text-secondary)] bg-white/5 border-white/10',
  };

  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  const trendColor = isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-[var(--text-muted)]';

  return (
    <div className="glass-card shadow-premium transition-all duration-500 hover:scale-[1.02] hover:border-[var(--accent)]/40 group relative overflow-hidden animate-fade-in">
      {/* Dynamic Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${colorStyles[color] || colorStyles.accent}`}>
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md shadow-inner`}>
              <div className={`w-1 h-1 rounded-full animate-pulse ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`text-[11px] font-black tracking-[0.2em] ${trendColor}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 leading-none">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
              {value}
            </h3>
            {subValue && (
              <p className="text-[11px] text-[var(--text-muted)] font-bold tracking-tight opacity-60">
                {subValue}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
