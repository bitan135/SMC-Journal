'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full animate-fade-in">
        <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10">
          <AlertTriangle className="text-rose-500" size={36} />
        </div>
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter mb-3">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] font-medium mb-10 leading-relaxed">
          An unexpected error occurred. Your trade data is safe — this is a display issue only.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center gap-3 px-8 py-4 glass-card border-[var(--glass-border)] text-[var(--foreground)] rounded-2xl font-black text-sm uppercase tracking-widest hover:border-[var(--accent)]/30 transition-all active:scale-95"
          >
            <Home size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
