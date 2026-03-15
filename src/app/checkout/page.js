'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Copy, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!paymentId) return;

    async function fetchPayment() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/payments/${paymentId}`);
        // For simplicity in this demo, we'll poll the payment/create route or a new info route
        // but here we'll just mock it or assume a specific status 
        // In a real app, create /api/payments/[id]/route.js
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
      <p className="text-[var(--text-secondary)] font-medium">Preparing your secure checkout...</p>
    </div>
  );

  if (error || !payment) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4 text-center">
      <AlertCircle className="text-[var(--loss)]" size={48} />
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-[var(--text-muted)] max-w-sm">{error || 'Payment not found'}</p>
      <button onClick={() => router.push('/billing')} className="mt-4 px-6 py-2 bg-[var(--accent)] text-white rounded-xl font-bold">Back to Billing</button>
    </div>
  );

  const isFinished = payment.payment_status === 'finished';

  return (
    <div className="min-h-screen py-12 px-4 max-w-2xl mx-auto animate-fade-in lg:pl-64">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[40px] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 p-10 text-white text-center">
          {isFinished ? (
            <CheckCircle2 size={64} className="mx-auto mb-4 animate-bounce" />
          ) : (
            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-black mb-2">
            {isFinished ? 'Payment Confirmed!' : 'Waiting for Payment'}
          </h1>
          <p className="text-white/80 font-medium tracking-wide uppercase text-xs">
            {isFinished ? 'Your dashboard is now upgraded' : 'Send crypto to the address below'}
          </p>
        </div>

        <div className="p-10 space-y-8">
          {!isFinished ? (
            <>
              {/* QR Code Placeholder */}
              <div className="flex justify-center flex-col items-center">
                <div className="bg-white p-4 rounded-3xl mb-4 shadow-xl">
                  {/* In a real app use a QR lib */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payment.pay_address}`} 
                    alt="Payment QR" 
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Send {payment.pay_amount} {payment.pay_currency.toUpperCase()}</p>
                <p className="text-xs text-[var(--accent)] font-medium bg-[var(--accent)]/10 px-3 py-1 rounded-full">~ ${payment.price_amount} USD</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] relative group">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2 tracking-widest">Payment Address</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-mono text-[var(--text-primary)] truncate break-all">{payment.pay_address}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(payment.pay_address);
                        // show toast logic
                      }}
                      className="p-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors text-[var(--accent)]"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 px-6 rounded-2xl border border-[var(--border)] text-[var(--text-muted)] text-sm">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    Checking for network confirmation...
                  </div>
                  <span className="font-bold text-[var(--text-primary)] capitalize">{payment.payment_status}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-[var(--text-secondary)] mb-8">
                Your subscription has been successfully activated. You now have unlimited access to EdgeLedger's premium features.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-2xl shadow-xl shadow-[var(--accent)]/30 hover:scale-[1.02] transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          <div className="pt-8 border-t border-[var(--border)] flex flex-col items-center gap-4">
             <a 
              href={`https://nowpayments.io/payment/?payment_id=${payment.payment_id}`}
              target="_blank"
              className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
             >
               View on NOWPayments <ExternalLink size={12} />
             </a>
             <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-tighter">Order ID: {payment.order_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
