'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { HOME_ID } from '@/lib/constants/routes';
import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

import { UserMenu } from '../common/UserMenu';
import { Logo } from '../images/Logo';

import { RoutesMenu } from './RoutesMenu';
import { SignInDialog } from './SignInDialog';

interface LinkPresetItem {
  route: string;
  name: string;
}

interface HeaderProps {
  linkPreset?: LinkPresetItem[];
  logoLink?: string;
}

export const CommonHeader = ({ linkPreset = [], logoLink = '/' }: HeaderProps) => {
  const [isSignInDialogOpen, setSignInDialogOpen] = useState(false);
  const { data: session } = useSession();
  const { isFeatureEnabled } = useFeatureFlagContext();
  const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled');

  return (
    <header id={HOME_ID} className="2lg:h-48 flex h-16 items-center justify-between sm:h-36">
      <Link href={logoLink}>
        <Logo />
      </Link>
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
              <span className="hover:text-secondary hidden text-xl md:block lg:text-3xl">{anchor.name}</span>
            </Link>
          ))}
      {isWaitlistEnabled ? (
        <>
          <button
            className="bg-secondary text-md rounded-md px-3 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:text-2xl lg:text-3xl"
            onClick={() => setSignInDialogOpen(true)}
          >
            JOIN!
          </button>
          <SignInDialog open={isSignInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
        </>
      ) : session ? (
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <RoutesMenu routes={linkPreset} />
          </div>
          <UserMenu />
        </div>
      ) : (
        <>
          <button
            className="bg-secondary text-md rounded-md px-3 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:text-2xl lg:text-3xl"
            onClick={() => setSignInDialogOpen(true)}
          >
            JOIN!
          </button>
          <SignInDialog open={isSignInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
        </>
      )}
    </header>
  );
};
