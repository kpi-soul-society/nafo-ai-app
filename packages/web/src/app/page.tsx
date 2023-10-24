'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { CommonFooter } from '@/components/common/CommonFooter';
import { CommonHeader } from '@/components/common/CommonHeader';
import { AboutNafo } from '@/components/landing/AboutNafo';
import { Donation } from '@/components/landing/Donation';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pitch } from '@/components/landing/Pitch';
import { RecentCreations } from '@/components/landing/RecentCreations';
import { LANDING_ANCHORS } from '@/lib/constants/pages';
import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

export default function Home() {
  const params = useSearchParams();
  const { isFeatureEnabled } = useFeatureFlagContext();
  const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled');

  useEffect(() => {
    const referrerId = params.get('referrerId');
    if (referrerId) {
      localStorage.setItem('referrerId', referrerId);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-y-3 overflow-hidden px-10 lg:px-20 xl:px-28">
        <CommonHeader linkPreset={LANDING_ANCHORS} />
        <main className="flex min-h-screen flex-col gap-y-12 font-sans sm:gap-y-32">
          <Pitch />
          <HowItWorks />
          <RecentCreations />
          <AboutNafo />
        </main>
        {!isWaitlistEnabled && (
          <div className="py-12">
            <Donation />
          </div>
        )}
      </div>
      <CommonFooter linkPreset={LANDING_ANCHORS} />
    </div>
  );
}
