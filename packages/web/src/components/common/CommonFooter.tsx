'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

import { Cheebs } from '../images/Cheebs';
import { Logo } from '../images/Logo';

import { SignInDialog } from './SignInDialog';
interface LinkPresetItem {
  route: string;
  name: string;
}

interface FooterProps {
  linkPreset?: LinkPresetItem[];
}

export const CommonFooter = ({ linkPreset = [] }: FooterProps) => {
  const [isSignInDialogOpen, setSignInDialogOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { isFeatureEnabled } = useFeatureFlagContext();
  const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled');

  return (
    <div className="bg-secondary relative flex min-h-[18rem] flex-col overflow-y-hidden px-10 pb-4 pt-8 lg:px-20 xl:px-28">
      <div className="flex justify-between">
        <div className="flex w-full flex-col items-start gap-y-2 md:flex-row-reverse">
          <a href="/" className="flex flex-auto justify-center">
            <Logo />
          </a>
          <div className="flex w-1/3 flex-col gap-y-2">
            {linkPreset.length > 0 &&
              linkPreset
                .filter((l) => {
                  if (isWaitlistEnabled) {
                    return l.name !== 'Gallery';
                  }
                  return true;
                })
                .map((anchor) => (
                  <Link href={anchor.route} key={anchor.route}>
                    <span className="hover:text-primary md:text-xl 2xl:text-2xl">{anchor.name}</span>
                  </Link>
                ))}
            <Cheebs
              onClick={() => {
                isWaitlistEnabled
                  ? setSignInDialogOpen(true)
                  : session
                  ? router.push('/editor')
                  : setSignInDialogOpen(true);
              }}
              withText
              text={isWaitlistEnabled ? 'join waitlist' : session ? 'more cheebs!' : 'join the squad'}
            />
            <SignInDialog open={isSignInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
          </div>
        </div>

        <div className="flex w-1/3 justify-end">
          <Link className="relative h-10 w-28 md:h-16 md:w-48" href="https://fondy.ua">
            <Image src="/assets/fondy-processed-light.png" fill alt="Fondy" />
          </Link>
        </div>
      </div>
      <div className="2xs:text-md flex flex-auto flex-col items-end justify-end gap-y-2 text-xs underline md:text-xl lg:flex-row lg:gap-x-3 2xl:text-2xl">
        <a href="mailto:contact@nafoai.com">Contacts us</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
  );
};
