'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto
                            flex items-center gap-4 px-6 py-4 rounded-2xl shadow-premium backdrop-blur-xl border-l-4 min-w-[320px] max-w-md animate-slide-right-in
                            ${toast.type === 'success' ? 'bg-[#10B98110] border-emerald-500' : 
                              toast.type === 'error' ? 'bg-[#EF444410] border-rose-500' : 
                              'bg-[var(--glass-bg)] border-[var(--accent)]'}
                        `}
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500" />}
                            {toast.type === 'error' && <AlertCircle size={20} className="text-rose-500" />}
                            {toast.type === 'info' && <Sparkles size={20} className="text-[var(--accent)]" />}
                        </div>
                        <p className={`flex-1 text-xs font-black uppercase tracking-widest leading-relaxed ${
                            toast.type === 'success' ? 'text-emerald-500' :
                            toast.type === 'error' ? 'text-rose-500' :
                            'text-[var(--foreground)]'
                        }`}>
                            {toast.message}
                        </p>
                        <button onClick={() => removeToast(toast.id)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
