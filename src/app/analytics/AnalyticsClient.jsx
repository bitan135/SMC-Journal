'use client';

import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/SkeletonLoader';
import PlanGuard from '@/components/shared/PlanGuard';

const AnalyticsContent = dynamic(() => import('@/components/insights/AnalyticsContent'), {
  ssr: false,
  loading: () => (
    <div className="px-4 sm:px-6 lg:px-10 py-10 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 px-2">
            <div className="flex-1">
                <div className="h-4 w-32 bg-white/5 rounded-full mb-4 animate-shimmer" />
                <div className="h-12 w-64 bg-white/5 rounded-2xl mb-4 animate-shimmer" />
                <div className="h-4 w-48 bg-white/5 rounded-full animate-shimmer" />
            </div>
            <div className="flex items-center gap-4">
                <div className="h-[76px] w-[140px] bg-white/5 rounded-[24px] animate-shimmer" />
                <div className="h-[76px] w-[140px] bg-white/5 rounded-[24px] animate-shimmer" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
  )
});

export default function AnalyticsPage() {
  return (
    <AnalyticsContent />
  );
}
