'use client';

import { ChartSkeleton } from './ui/SkeletonLoader';

export default function ChartCard({ title, subtitle, children, className = '', height = 'h-[350px]', isLoading, isEmpty }) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <div className={`glass-card shadow-premium animate-fade-in ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-3">{title}</h3>}
          {subtitle && <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
      )}
      <div className={height}>
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Awaiting Data Streams</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
