import React from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import { useTypedQuery } from '@/lib/client/graphqlClient';
import { MAIN_PAGES } from '@/lib/constants/pages';

import { RoutesMenu } from '../common/RoutesMenu';
import { Tokens } from '../common/Tokens';

export const AvatarAndTokens = () => {
  const { data: session } = useSession();
  const [tokensData] = useTypedQuery({
    query: {
      me: { tokenNumber: true },
    },
  });

  return (
    <div id="avatar-and-tokens" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="border-lavander relative aspect-square w-14 overflow-hidden rounded-full border-4 sm:w-20 ">
              <Image
                src={session?.user.avatarUrl || ''}
                fill
                alt="My Avatar"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <button
              className="bg-secondary text-md 2lg:text-3xl rounded-md px-3 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:hidden md:text-2xl"
              onClick={() => {
                signOut();
              }}
            >
              Log out
            </button>
          </div>
          <span className="hidden text-xl font-bold sm:block sm:text-2xl lg:text-3xl">{session?.user.email}</span>
          <button
            className="bg-secondary text-md 2lg:text-3xl hidden rounded-md px-3 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:block md:text-2xl"
            onClick={() => {
              signOut();
            }}
          >
            Log out
          </button>
        </div>
        <div className="flex gap-4">
          <Tokens tokenNumber={tokensData.data?.me.tokenNumber} />
          <RoutesMenu routes={MAIN_PAGES} />
        </div>
      </div>
      <span className="text-2xl  font-bold sm:hidden">{session?.user.email}</span>
    </div>
  );
};
