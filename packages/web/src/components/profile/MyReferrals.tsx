'use client';
import React from 'react';
import toast from 'react-hot-toast';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';

import { CheebsToken } from '../images/CheebsToken';

export const MyReferrals = () => {
  const { data: session } = useSession();
  return (
    <div id="referral" className="flex max-w-fit flex-col gap-y-5">
      <h1 className="text-4xl font-bold">Referrals</h1>
      <span className="text-xl ">
        Share this link with your friend and you both get 10&nbsp;
        <div className="relative top-2 hidden aspect-square overflow-hidden  sm:inline-block  sm:w-8">
          <CheebsToken fill="#E0BA3F" />
        </div>{' '}
        bonus tokens for their first donation
      </span>
      <div id="referral-link" className="flex">
        <span className="w-full overflow-ellipsis break-all rounded-lg bg-gray-200 p-4 text-xl">{`https://nafoai.com?referrerId=${session?.user.id}`}</span>
        <button
          id="referral-link-button"
          className="bg-secondary rounded-lg p-4 text-lg text-white"
          onClick={() => {
            navigator.clipboard.writeText(`https://nafoai.com?referrerId=${session?.user.id}`);
            toast.success('Link copied to clipboard', {
              duration: 5000,
              position: 'top-center',
            });
          }}
        >
          <div className="flex">
            <ClipboardIcon className="w-8" />
            Copy
          </div>
        </button>
      </div>
    </div>
  );
};
