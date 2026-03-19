import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found — SMC Journal',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full animate-fade-in">
        <div className="w-20 h-20 rounded-[32px] bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/10">
          <Compass className="text-[var(--accent)]" size={36} />
        </div>
        <p className="text-[var(--accent)] font-black text-sm uppercase tracking-[0.3em] mb-4">404</p>
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tighter mb-3">
          Page not found
        </h1>
        <p className="text-[var(--text-secondary)] font-medium mb-10 leading-relaxed">
          This page doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Home size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
