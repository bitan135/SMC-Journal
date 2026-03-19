'use client';

import { useEffect } from 'react';
import { captureReferral } from '@/lib/referral';

export default function ReferralTracker() {
  useEffect(() => {
    captureReferral();
  }, []);

  return null;
}
