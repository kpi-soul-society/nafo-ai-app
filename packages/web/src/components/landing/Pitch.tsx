'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { LANDING_PITCH_DOG_ASSETS } from '@/lib/constants/assets';
import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

import { SignInDialog } from '../common/SignInDialog';

export const Pitch = () => {
  const [isSignInDialogOpen, setSignInDialogOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { isFeatureEnabled } = useFeatureFlagContext();
  const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled');

  return (
    <div className="flex flex-col justify-between gap-x-12 gap-y-6 sm:flex-row sm:gap-y-0">
      <div className="flex w-full flex-col justify-center gap-y-2 sm:mt-5 sm:w-1/3 sm:gap-y-6 md:w-1/2 xl:gap-y-10">
        <p className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">Forge your NAFO avatar with the power of AI.</p>
        <span className="text-gray text-xl 2xl:text-3xl">
          Craft your awesome NAFO themed images using state of the art AI models and support the UA armed forces!
        </span>
        <button
          type="submit"
          className="bg-secondary rounded-md px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-2/3 md:text-xl lg:text-2xl 2xl:py-3 2xl:text-4xl"
          onClick={() => {
            session ? router.push('/editor') : setSignInDialogOpen(true);
          }}
        >
          {isWaitlistEnabled ? 'JOIN WAITLIST' : session ? 'TO EDITOR' : 'JOIN THE SQUAD'}
        </button>
        <SignInDialog open={isSignInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4 sm:w-1/2 sm:justify-end">
        {LANDING_PITCH_DOG_ASSETS.map((asset) => (
          <div className="sm:w-2/7 relative aspect-square w-2/5" key={asset}>
            <Image
              src={asset}
              alt="NAFO dog"
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
