'use client';

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Global Error Boundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-card p-10 rounded-3xl border-[var(--glass-border)] shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tighter">
              Something went wrong
            </h1>
            <p className="text-[var(--text-muted)] font-bold text-sm mb-8 leading-relaxed">
              An unexpected error occurred. We have been notified and are looking into it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
