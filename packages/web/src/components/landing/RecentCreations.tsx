import React from 'react';
import Image from 'next/image';

import { emptyDogPlaceholder } from '../images/EmptyDog';

export const RecentCreations = () => {
  return (
    <div className="flex flex-col gap-y-8 sm:gap-y-14">
      <div>
        <h1 className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">Recent creations</h1>
      </div>

      <div className="flex flex-nowrap justify-between gap-x-10 overflow-y-hidden overflow-x-scroll sm:overflow-x-visible">
        <div className="relative aspect-[7/9] w-1/3 min-w-[13rem]">
          <Image
            src={'/assets/dogs1.png'}
            alt="Recent NAFO avatars"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={emptyDogPlaceholder}
          />
        </div>

        <div className="relative aspect-square w-2/5 min-w-[17rem]">
          <Image
            src={'/assets/dogs2.png'}
            alt="Recent NAFO avatars"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={emptyDogPlaceholder}
          />
        </div>

        <div className="relative aspect-[7/9] w-1/3 min-w-[13rem]">
          <Image
            src={'/assets/dogs3.png'}
            alt="Recent NAFO avatars"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={emptyDogPlaceholder}
          />
        </div>
      </div>
    </div>
  );
};
