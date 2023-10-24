import React from 'react';

import { ABOUT_NAFO_ID } from '@/lib/constants/routes';

import { ShortLogo } from '../images/ShortLogo';

export const AboutNafo = () => {
  return (
    <div
      id={ABOUT_NAFO_ID}
      className="bg-primary -mx-10 flex flex-col gap-y-4 px-10 py-12 text-white sm:gap-y-14 lg:-mx-20 lg:px-20 xl:-mx-28 xl:px-28"
    >
      <h1 className="text-3xl md:text-3xl lg:text-5xl 2xl:text-6xl">About NAFO</h1>

      <div className="flex flex-col p-4 md:flex-row">
        <div className="flex flex-col gap-y-2 sm:gap-y-4 md:w-1/3">
          <span className="text-xl md:text-2xl md:font-semibold">Who is NAFO</span>
          <span className="md:text-xl">
            NAFO is a movement fundraising for Ukraine&apos;s defenders. Their profits benefit verified Ukrainian
            charities.
          </span>
          <a href={'https://nafo-ofan.org/'} className="underline md:text-xl">
            You can learn more about NAFO on their official website.
          </a>
        </div>

        <div className="flex w-full justify-center md:w-1/3">
          <ShortLogo fill="#fff" />
        </div>

        <div className="flex flex-col gap-y-2 sm:gap-y-4 md:w-1/3">
          <span className="text-xl md:text-2xl md:font-semibold">How is this project related to NAFO?</span>
          <span className="md:text-xl">
            We are not directly affiliated with NAFO, but we are a proud supporter of their cause. nafoai.com was built
            by fellas from Ukraine seeking to harness the latest developments in AI to help their country.
          </span>
        </div>
      </div>
    </div>
  );
};
