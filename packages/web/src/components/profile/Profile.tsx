'use client';

import { MAIN_PAGES } from '@/lib/constants/pages';

import { CommonFooter } from '../common/CommonFooter';

import { AvatarAndTokens } from './AvatarAndTokens';
import { DeleteMyAccount } from './DeleteMyAccount';
import { MyReferrals } from './MyReferrals';
import { MyStats } from './MyStats';

export const Profile = () => {
  return (
    <div className="flex flex-col gap-y-3 overflow-hidden ">
      <main className="flex min-h-screen flex-col gap-y-12 p-6 font-sans sm:gap-y-16 lg:p-10 xl:p-12">
        <AvatarAndTokens />

        <MyStats />

        <MyReferrals />

        <DeleteMyAccount />
      </main>
      <CommonFooter linkPreset={MAIN_PAGES} />
    </div>
  );
};
