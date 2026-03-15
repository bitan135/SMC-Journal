'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Copy, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!paymentId) return;

    async function fetchPayment() {
      try {
        const res = await fetch(`/api/payments/${paymentId}`);
        const data = await res.json();
        setPayment(data);
      } catch (err) {
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    }

    fetchPayment();
    const interval = setInterval(fetchPayment, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [paymentId]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'addr') {
        setCopiedAddr(true);
        setTimeout(() => setCopiedAddr(false), 2000);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[var(--background)]">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-[var(--accent)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="text-[var(--accent)] animate-pulse" size={32} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-white text-xl font-bold tracking-tight mb-2">Securing Transaction...</p>
        <p className="text-[var(--text-muted)] text-sm font-medium animate-pulse">Establishing tunnel via Arbitrum Network</p>
      </div>
    </div>
  );

  if (error || !payment) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 p-4 text-center bg-[var(--background)]">
      <div className="w-20 h-20 rounded-3xl bg-[var(--loss-bg)] flex items-center justify-center border border-[var(--loss)]/20 shadow-2xl shadow-red-500/10">
        <AlertCircle className="text-[var(--loss)]" size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">Security Halt</h2>
        <p className="text-[var(--text-secondary)] max-w-sm font-medium">{error || 'Transaction context lost'}</p>
      </div>
      <button 
        onClick={() => router.push('/billing')} 
        className="mt-4 px-8 py-3 glass-card text-white rounded-2xl font-bold hover:scale-105 transition-all active:scale-95"
      >
        Return to Billing
      </button>
    </div>
  );

  const isFinished = payment.payment_status === 'finished';

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto relative overflow-hidden bg-[var(--background)]">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[150px] rounded-full animate-float"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full delay-1000 animate-float"></div>

      <div className="max-w-2xl mx-auto relative z-10 animate-fade-in">
        <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-8 font-bold text-xs uppercase tracking-widest group"
        >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back
        </button>

        <div className="glass-card shadow-premium">
          <div className="relative h-64 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            {/* Animated Gradient Header */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] opacity-20 transform -skew-y-3 scale-110"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150"></div>
            
            <div className="relative z-10">
                {isFinished ? (
                    <div className="w-20 h-20 rounded-full glass-effect flex items-center justify-center mb-6 mx-auto border-white/20 shadow-2xl scale-110">
                        <CheckCircle2 size={40} className="text-emerald-400 animate-bounce" />
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin mx-auto mb-6 shadow-xl" />
                )}
                <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
                    {isFinished ? 'Elevated.' : 'Awaiting Settlement'}
                </h1>
                <p className="text-indigo-200/80 font-black uppercase text-[10px] tracking-[0.2em]">
                    {isFinished ? 'Your transformation is complete' : 'Execute payment to Arbitrum Node'}
                </p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {!isFinished ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-[var(--accent)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative bg-white p-6 rounded-[var(--card-radius)] shadow-2xl shadow-black/50 overflow-hidden">
                        {/* High Quality QR */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${payment.pay_address}&color=050505`} 
                            alt="Payment QR" 
                            className="w-48 h-48 mix-blend-multiply"
                        />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Amount Card */}
                  <div className="glass-effect rounded-[24px] p-6 border-white/5 group hover:border-[var(--accent)]/30 transition-all">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-3 tracking-[0.2em] flex items-center justify-between">
                        Amount to Send
                        <span className="text-[var(--accent)]">USDT-ARB</span>
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-black text-white">{payment.pay_amount}</p>
                      <button 
                        onClick={() => copyToClipboard(payment.pay_amount, 'amount')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all active:scale-90 ${
                            copiedAmount ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[var(--accent)] hover:bg-white/10'
                        }`}
                      >
                        {copiedAmount ? <><Check size={14} /> COPIED</> : <><Copy size={14} /> COPY AMOUNT</>}
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">~ ${payment.price_amount} USD VALUE</p>
                    </div>
                  </div>

                  {/* Address Card */}
                  <div className="glass-effect rounded-[24px] p-6 border-white/5 group hover:border-[var(--accent)]/30 transition-all">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-3 tracking-[0.2em]">Execution Address</p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-mono text-white/80 break-all leading-relaxed max-w-[70%]">{payment.pay_address}</p>
                      <button 
                        onClick={() => copyToClipboard(payment.pay_address, 'addr')}
                        className={`p-4 rounded-2xl transition-all active:scale-90 ${
                            copiedAddr ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[var(--accent)] hover:bg-white/10'
                        }`}
                      >
                        {copiedAddr ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 p-6 px-8 rounded-[24px] bg-white/[0.02] border border-white/5 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-[var(--accent)] animate-spin" />
                    <span className="text-sm font-black text-white uppercase tracking-tighter">Syncing Node...</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{payment.payment_status}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-12 animate-slide-up">
                <p className="text-[var(--text-secondary)] text-lg mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                    Welcome to the elite tier. Your professional trading engine has been fully unlocked.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full py-5 bg-[var(--accent)] text-white font-black rounded-[24px] shadow-2xl shadow-indigo-500/40 hover:scale-[1.03] transition-all active:scale-95 text-sm tracking-[0.2em] uppercase"
                >
                  Enter Cockpit
                </button>
              </div>
            )}

            <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
               <a 
                href={`https://nowpayments.io/payment/?payment_id=${payment.payment_id}`}
                target="_blank"
                className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest flex items-center gap-3 hover:text-white transition-colors"
               >
                 Verify Transaction on Explorer <ExternalLink size={14} />
               </a>
               <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 border border-white/5">
                    <img 
                        src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=032" 
                        className="h-4"
                        alt="Arbitrum" 
                    />
                    <span className="text-[10px] font-black text-white/50 tracking-wider">ORDER: {payment.order_id}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
