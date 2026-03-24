'use client';

import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import ChartCard from '@/components/ChartCard';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card shadow-premium p-4 rounded-2xl border-[var(--glass-border)] backdrop-blur-xl">
      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
        <p className="text-lg font-black text-[var(--foreground)] tracking-tighter">
          {payload[0].value > 0 ? '+' : ''}{payload[0].value}R
        </p>
      </div>
    </div>
  );
}

export default function DashboardCharts({ equityCurve, sessionPerf }) {
  return (
    <>
      <ChartCard title="Equity Trajectory" subtitle="Cumulative R performance" className="lg:col-span-2 glass-card">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" strokeOpacity={1} vertical={false} />
                  <XAxis
                      dataKey="date"
                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                  />
                  <YAxis
                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}R`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="var(--accent)"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                      animationDuration={2000}
                  />
              </AreaChart>
          </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Session Liquidity" subtitle="Win Rates via Window" className="glass-card overflow-hidden">
          <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sessionPerf} layout="vertical" margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} 
                      axisLine={false} 
                      tickLine={false} 
                      width={80} 
                  />
                  <Tooltip cursor={{fill: 'var(--accent)', fillOpacity: 0.05}} content={({active, payload}) => {
                      if (!active || !payload?.length) return null;
                      return (
                          <div className="glass-card p-3 rounded-xl border-[var(--glass-border)] shadow-premium">
                              <p className="text-sm font-black text-[var(--foreground)]">{payload[0].value}% Precision</p>
                          </div>
                      );
                  }} />
                  <Bar 
                      dataKey="winRate" 
                      radius={[0, 12, 12, 0]} 
                      barSize={24}
                      animationDuration={1500}
                  >
                      {sessionPerf.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.winRate >= 50 ? 'var(--profit)' : 'var(--loss)'} />
                      ))}
                  </Bar>
              </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between px-4 pb-2">
              {sessionPerf.map(s => (
                  <div key={s.name} className="flex flex-col items-center justify-center">
                      <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">{s.name}</p>
                      <p className={`text-sm font-black ${s.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>{s.winRate}%</p>
                  </div>
              ))}
          </div>
      </ChartCard>
    </>
  );
}
