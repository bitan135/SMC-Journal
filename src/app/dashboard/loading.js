export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl border-2 border-[var(--accent)]/20 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-2xl border-t-2 border-[var(--accent)] animate-spin-fast" />
      </div>
      <p className="mt-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] animate-pulse">Syncing Engine...</p>
    </div>
  );
}
