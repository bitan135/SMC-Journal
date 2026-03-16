'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error('useConfirm must be used within a ConfirmProvider');
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);

    const showConfirm = useCallback(({ title, message, confirmLabel, onConfirm, type = 'danger' }) => {
        setConfig({ title, message, confirmLabel, onConfirm, type });
    }, []);

    const close = () => setConfig(null);

    const handleConfirm = async () => {
        if (config?.onConfirm) {
            await config.onConfirm();
        }
        close();
    };

    return (
        <ConfirmContext.Provider value={{ showConfirm }}>
            {children}
            {config && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm animate-fade-in" 
                        onClick={close}
                    />
                    
                    {/* Modal */}
                    <div className="relative w-full max-w-md glass-card border-[var(--glass-border)] rounded-[40px] p-8 shadow-premium animate-scale-in">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-xl ${
                                config.type === 'danger' 
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            }`}>
                                {config.type === 'danger' ? <Trash2 size={32} /> : <AlertTriangle size={32} />}
                            </div>
                            
                            <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight mb-3">
                                {config.title}
                            </h3>
                            
                            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed mb-10">
                                {config.message}
                            </p>
                            
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={close}
                                    className="flex-1 py-4 rounded-2xl glass-effect border-[var(--glass-border)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                                        config.type === 'danger'
                                        ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'
                                        : 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600'
                                    }`}
                                >
                                    {config.confirmLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
