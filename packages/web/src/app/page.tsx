'use client';
import { CommonFooter } from '@/components/common/CommonFooter';
import { CommonHeader } from '@/components/common/CommonHeader';
import { AboutNafo } from '@/components/landing/AboutNafo';
import { EndOfLife } from '@/components/landing/EndOfLife';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { RecentCreations } from '@/components/landing/RecentCreations';
import { LANDING_ANCHORS } from '@/lib/constants/pages';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-y-3 overflow-hidden px-10 lg:px-20 xl:px-28">
        <CommonHeader linkPreset={LANDING_ANCHORS} />
        <main className="flex min-h-screen flex-col gap-y-12 font-sans sm:gap-y-32">
          <EndOfLife />
          <HowItWorks />
          <RecentCreations />
          <AboutNafo />
        </main>
      </div>
      <CommonFooter linkPreset={LANDING_ANCHORS} />
    </div>
  );
}
