'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Target, TrendingUp, BarChart3, X } from 'lucide-react';
import { hasOnboarded, setOnboarded } from '@/lib/storage';

const steps = [
  {
    title: 'Welcome to EdgeLedger',
    description: 'The modern trading journal designed for Smart Money traders. Let\'s get you started with 3 simple steps.',
    icon: TrendingUp,
    color: 'text-[#6366F1]',
  },
  {
    title: 'Log Your First Trade',
    description: 'Add your trade details, setup tags (SMC), and screenshots. We\'ll auto-calculate your RR and risk.',
    icon: Target,
    color: 'text-[#22C55E]',
  },
  {
    title: 'Analyze Your Edge',
    description: 'View deep insights across sessions, strategies, and instruments. Find what works and cut what doesn\'t.',
    icon: BarChart3,
    color: 'text-[#8B5CF6]',
  }
];

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const pathname = usePathname();

  useEffect(() => {
    const checkOnboarding = async () => {
      // Don't show Onboarding on auth pages
      if (pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback') {
        setShow(false);
        return;
      }

      // Check local storage first for instant feedback during auth transitions
      const localOnboarded = localStorage.getItem('edge_onboarded');
      if (localOnboarded === 'true') {
        setShow(false);
        return;
      }

      const onboarded = await hasOnboarded();
      if (!onboarded) {
        setShow(true);
      }
    };
    checkOnboarding();
  }, [pathname]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    localStorage.setItem('edge_onboarded', 'true');
    await setOnboarded();
    setShow(false);
  };

  if (!show) return null;

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl animate-scale-in">
        <button 
          onClick={handleComplete}
          className="absolute top-6 right-6 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl bg-[var(--card-hover)] flex items-center justify-center mb-6 border border-[var(--border)] shadow-xl ${current.color}`}>
            <Icon size={40} />
          </div>

          <div className="flex gap-1.5 mb-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--border)]'}`}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            {current.title}
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
            {current.description}
          </p>

          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-[var(--accent)] text-white font-semibold transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent)]/20"
          >
            {currentStep === steps.length - 1 ? 'Start Journaling' : 'Continue'}
          </button>
          
          <button 
            onClick={handleComplete}
            className="mt-4 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
