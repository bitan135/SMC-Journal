'use client';

import { useState } from 'react';
import { Heart, Copy, Check, ShieldAlert, Sparkles, Zap, TrendingUp, Globe, ArrowRight } from 'lucide-react';

export default function DonationPage() {
    const [copied, setCopied] = useState(false);
    const walletAddress = "0xA7608672cc489538F3b96c32f2f0eee74fe91205";

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-[1280px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-5xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                        <Sparkles size={12} /> Institutional Support
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tighter leading-none mb-6">
                        Fueling the <span className="text-gradient">SMC Ecosystem</span>
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
                        Your contributions ensure the sustained development of high-performance tools for the global Smart Money community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Value Props */}
                    {[
                        { icon: Globe, title: 'Infrastructure', desc: 'Sustaining high-throughput data nodes and server reliability.' },
                        { icon: Zap, title: 'Innovation', desc: 'Accelerating the deployment of advanced technical insights.' },
                        { icon: ShieldAlert, title: 'Security', desc: 'Maintaining enterprise-grade security for the execution vaults.' }
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-8 rounded-[32px] border-[var(--glass-border)] hover:border-[var(--accent)]/30 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20">
                                <item.icon size={24} className="text-[var(--accent)]" />
                            </div>
                            <h3 className="text-lg font-black text-[var(--foreground)] mb-3 uppercase tracking-tighter">{item.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Contribution Module */}
                <div className="glass-card rounded-[48px] p-8 md:p-12 border-[var(--glass-border)] shadow-premium bg-gradient-to-br from-[var(--glass-bg)] to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--accent)]/10 transition-all duration-1000" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 space-y-10">
                            <div>
                                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight mb-4">Direct Settlement</h2>
                                <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                                    Utilize the Arbitrum Network for near-instant settlement with minimal friction.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 block ml-1">
                                        USDT (Arbitrum One) Receiver Address
                                    </label>
                                    <div className="relative group/addr">
                                        <div className="w-full bg-[var(--background)] border border-[var(--glass-border)] rounded-[24px] p-6 pr-20 font-mono text-sm text-[var(--foreground)] break-all shadow-inner group-hover/addr:border-[var(--accent)] transition-all">
                                            {walletAddress}
                                        </div>
                                        <button 
                                            onClick={handleCopy}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                copied ? 'bg-emerald-500 scale-95 shadow-none' : 'bg-[var(--accent)] hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'
                                            }`}
                                        >
                                            {copied ? <Check size={24} className="text-white" /> : <Copy size={24} className="text-white" />}
                                        </button>
                                    </div>
                                    {copied && (
                                        <div className="mt-4 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-fade-in">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> Settlement Address Copied
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 rounded-[32px] bg-rose-500/5 border border-rose-500/10 space-y-3">
                                    <div className="flex items-center gap-3 text-rose-500">
                                        <ShieldAlert size={20} />
                                        <span className="text-[11px] font-black uppercase tracking-widest leading-none">Critical Protocol Warning</span>
                                    </div>
                                    <p className="text-sm text-rose-500/80 font-medium leading-normal">
                                        Transfers must be executed via the <span className="font-black underline">Arbitrum One Network</span>. Sending funds on any other chain (Ethereum, BSC, TRX) will result in irreversible asset loss.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <div className="glass-card p-8 rounded-[40px] border-[var(--glass-border)] bg-[var(--background)]/30 backdrop-blur-sm">
                                <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-[var(--accent)]" /> Efficiency Log
                                </h4>
                                <ul className="space-y-6">
                                    {[
                                        { label: 'Asset Type', value: 'USDT (Stablecoin)' },
                                        { label: 'Settlement Layer', value: 'Arbitrum One (L2)' },
                                        { label: 'Processing Speed', value: 'Instant (~2s)' },
                                        { label: 'Transaction Cost', value: 'Minimal (~$0.10)' }
                                    ].map((spec, idx) => (
                                        <li key={idx} className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 last:border-0 last:pb-0">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{spec.label}</span>
                                            <span className="text-xs font-black text-[var(--foreground)]">{spec.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mt-8 flex items-center gap-4 px-6 text-[var(--text-muted)]">
                                <div className="flex-1 h-px bg-[var(--glass-border)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Institutional Grade</span>
                                <div className="flex-1 h-px bg-[var(--glass-border)]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Micro-copy */}
                <div className="mt-20 flex flex-col items-center text-center max-w-lg mx-auto">
                    <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mb-4">SMC Journal Protocol</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed italic">
                        &ldquo;Your support is the catalyst for technical evolution. Every contribution is reinvested into building superior execution analytics.&rdquo;
                    </p>
                </div>
            </div>
        </div>
    );
}
