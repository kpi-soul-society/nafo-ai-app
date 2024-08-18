'use client';
import React from 'react';
import Image from 'next/image';

import { LANDING_PITCH_DOG_ASSETS } from '@/lib/constants/assets';

import { emptyDogPlaceholder } from '../images/EmptyDog';
export const EndOfLife = () => {
  return (
    <div className="flex flex-col justify-between gap-x-12 gap-y-6 sm:flex-row sm:gap-y-0">
      <div className="flex w-full flex-col justify-center gap-y-2 sm:mt-5 sm:w-1/3 sm:gap-y-6 md:w-1/2 xl:gap-y-10">
        <p className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">So Long, and Thanks for All the Cheebs.</p>
        <span className="text-gray text-xl 2xl:text-3xl">
          With 183$ raised the project has been discontinued. Thank you for your support!
        </span>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4 sm:w-1/2 sm:justify-end">
        {LANDING_PITCH_DOG_ASSETS.map((asset) => (
          <div className="sm:w-2/7 relative aspect-square w-2/5 overflow-hidden rounded-3xl" key={asset}>
            <Image
              src={asset}
              alt="NAFO dog"
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={emptyDogPlaceholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
