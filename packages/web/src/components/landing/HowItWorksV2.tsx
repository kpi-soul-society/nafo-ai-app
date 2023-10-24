import React from 'react';
import Image from 'next/image';

import { Undo } from '@/components/images/Undo';
import { HOW_IT_WORKS_LIST } from '@/lib/constants/assets';
import { HOW_IT_WORKS_ID } from '@/lib/constants/routes';

export const HowItWorksV2 = () => {
  return (
    <div id={HOW_IT_WORKS_ID} className="flex flex-col gap-y-8 sm:gap-y-14">
      <div>
        <h1 className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">How it works?</h1>
      </div>

      <div className="flex flex-col gap-14 xl:flex-row xl:gap-32">
        <div className="flex w-full flex-col gap-y-6 xl:w-1/2">
          {HOW_IT_WORKS_LIST.map((item) => (
            <div className="flex gap-x-4" key={item.title}>
              <div className="flex h-10 w-10">
                <item.icon />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold md:text-2xl 2xl:text-3xl">{item.title}</span>
                <span className="text-gray md:text-xl 2xl:text-2xl">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-y-4 xl:w-1/2">
          <div className="2xs:gap-x-4 flex justify-center gap-x-1 xl:gap-x-16">
            <div className="relative  aspect-[2/3] w-1/4 min-w-[6.5rem] sm:min-w-[10rem] xl:w-2/5">
              <Image src="/assets/empty_dog.png" alt="NAFO avatar preview" priority fill />
            </div>
            <div className="self-center">
              <span className="text-sm lg:text-xl">Loading...</span>
              <Undo />
            </div>
            <div className="relative aspect-[2/3] w-1/4 min-w-[6.5rem] sm:min-w-[10rem] xl:w-2/5">
              <Image src="/assets/doggy5.png" alt="NAFO avatar example result" priority fill />
            </div>
          </div>
          <div className="flex w-full rounded-[30px] border p-4 shadow-lg">
            <div className="w-max max-w-[3/4]">
              <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 pr-5 text-xl font-semibold lg:text-3xl">
                fella commander.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
