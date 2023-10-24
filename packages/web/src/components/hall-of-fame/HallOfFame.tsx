'use client';

import { useState } from 'react';
import { MAX_IMAGES_DISPLAYED_IN_HALL_OF_FAME } from '@nafo-ai/core/common/validation/constants';
import { useSession } from 'next-auth/react';

import { useTypedQuery } from '@/lib/client/graphqlClient';
import { MAIN_PAGES } from '@/lib/constants/pages';
import { useBreakpoint } from '@/lib/hooks/useBreakpoint';

import { CommonHeader } from '../common/CommonHeader';
import { Loader } from '../images/Loader';

import { HallOfFameItem } from './HallOfFameItem';

export const HallOfFame = () => {
  const breakpoint = useBreakpoint();
  const { data: session } = useSession();
  const [limit, setLimit] = useState(breakpoint === 'xs' ? 10 : 20);
  const [sharedCreationsQuery] = useTypedQuery({
    query: {
      sharedVariations: [
        {
          page: 1,
          limit,
        },
        {
          variations: {
            id: true,
            imageUrl: true,
            creation: {
              textPrompt: true,
              id: true,
              startingImageUrl: true,
              negativePrompt: true,
              iterationCount: true,
              variationCount: true,
              styles: { id: true },
            },
          },
        },
      ],
    },
  });

  const routes = session ? MAIN_PAGES : [];

  return (
    <>
      <div className="px-10 lg:px-20">
        <CommonHeader linkPreset={routes} />
      </div>
      <div className="flex min-h-full w-full flex-col justify-between gap-4 px-10 py-5 lg:px-20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl">Recent community creations</h1>
        {sharedCreationsQuery.data?.sharedVariations.variations ? (
          <div className={`grid w-full grid-cols-2 gap-4 py-2 sm:grid-cols-4 lg:grid-cols-5 `}>
            {sharedCreationsQuery.data?.sharedVariations.variations.map(({ id, imageUrl, creation }, index) => (
              <HallOfFameItem
                key={id}
                id={id}
                imageUrl={imageUrl ?? ''}
                isAuthenticated={!!session}
                creationData={creation}
                isLast={
                  sharedCreationsQuery.data?.sharedVariations.variations?.length
                    ? index === sharedCreationsQuery.data?.sharedVariations.variations?.length - 1
                    : false
                }
                newLimit={() => limit < MAX_IMAGES_DISPLAYED_IN_HALL_OF_FAME && setLimit(limit + 12)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 text-xl">
            {sharedCreationsQuery.fetching ? (
              <>
                <Loader className="fill-secondary h-16 w-16 animate-spin text-gray-200" /> Loading...
              </>
            ) : (
              'No Cheebs Generated'
            )}
          </div>
        )}
      </div>
    </>
  );
};
