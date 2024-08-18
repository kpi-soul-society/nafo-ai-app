'use client';
import React from 'react';
import Link from 'next/link';

import { HOME_ID } from '@/lib/constants/routes';
import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

import { Logo } from '../images/Logo';

interface LinkPresetItem {
  route: string;
  name: string;
}

interface HeaderProps {
  linkPreset?: LinkPresetItem[];
  logoLink?: string;
}

export const CommonHeader = ({ linkPreset = [], logoLink = '/' }: HeaderProps) => {
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
    </header>
  );
};
