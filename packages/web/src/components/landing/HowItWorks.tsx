import React from 'react';
import Image from 'next/image';

import { CHEEBS_STEPS, HOW_IT_WORKS_LIST } from '@/lib/constants/assets';
import { HOW_IT_WORKS_ID } from '@/lib/constants/routes';

export const HowItWorks = () => {
  return (
    <div id={HOW_IT_WORKS_ID} className="flex flex-col gap-y-8 sm:gap-y-14">
      <div>
        <h1 className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">How it worked?</h1>
      </div>

      <div className="flex flex-col gap-14 xl:flex-row xl:gap-32">
        <div className="flex w-full flex-col justify-evenly gap-10  sm:flex-row">
          {HOW_IT_WORKS_LIST.map((item, i) => (
            <div className="flex flex-col sm:max-w-[17rem]" key={item.title}>
              <div className="flex flex-col gap-2">
                <div className="relative hidden aspect-[9/10] w-40 sm:block">
                  <Image
                    src={CHEEBS_STEPS[i]}
                    alt={'cheeb_step' + i}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex gap-2 sm:flex-row-reverse sm:justify-end ">
                  <div className="flex h-10 w-10">
                    <item.icon />
                  </div>
                  <span className="text-xl font-semibold md:text-2xl 2xl:text-3xl">{item.title}</span>
                </div>
                <span className="text-gray inline whitespace-pre-wrap md:text-xl 2xl:text-2xl">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
