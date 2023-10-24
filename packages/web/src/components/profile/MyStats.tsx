'use client';
import React from 'react';
import { CURRENCY_TO_TOKEN_EXCHANGE_RATE } from '@nafo-ai/core/common/payment';
import Image from 'next/image';

import { useTypedQuery } from '@/lib/client/graphqlClient';

import { Loader } from '../images/Loader';

export const MyStats = () => {
  const [stats] = useTypedQuery({
    query: {
      myStats: {
        totalCreations: true,
        totalReferrals: true,
        totalDonationsByCurrency: {
          USD: true,
          UAH: true,
          EUR: true,
        },
      },
    },
  });

  const notEmptyDonations =
    (stats.data?.myStats.totalDonationsByCurrency &&
      Object.entries(stats.data?.myStats.totalDonationsByCurrency).filter(([_, value]) => value > 0)) ??
    [];
  const isAnyDonation = notEmptyDonations.length > 0;
  return (
    <div id="stats" className="flex flex-col gap-4 sm:flex-row sm:gap-10">
      {/* <h1 className="text-4xl font-bold">Statistics</h1> */}
      <div className="flex">
        <div className="relative aspect-[10/13] w-36">
          <Image src="/assets/cheeb_worker.png" alt="cheeb" fill />
        </div>
        <div>
          <div className={`relative flex aspect-[4/1] w-48 items-start`}>
            <Image src="/assets/textbubble.png" alt="text bubble" fill />
            <div className={`relative w-full translate-x-[50%] text-[0.57rem] text-lg font-medium uppercase`}>
              <span className="absolute left-[3px] top-[-2px] max-w-[16rem] translate-x-[-50%] translate-y-[50%]">
                Your statistics
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-16">
        {stats.fetching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex flex-row-reverse items-center justify-end gap-x-4 gap-y-1 lg:flex-col lg:justify-center">
              <div
                className={`flex ${
                  notEmptyDonations.length > 1 ? 'justify-between' : 'justify-center'
                } gap-8 lg:w-full`}
              >
                {isAnyDonation ? (
                  notEmptyDonations.map(([key, value]) => (
                    <span key={key} className="text-3xl font-bold">
                      {value}
                      {CURRENCY_TO_TOKEN_EXCHANGE_RATE.find((er) => er.name === key)?.symbol}
                    </span>
                  ))
                ) : (
                  <span className="text-3xl font-bold">0</span>
                )}
              </div>
              <span className="text-3xl">Total donations</span>
            </div>
            <div className="flex flex-row-reverse items-center justify-end gap-x-4 gap-y-1 lg:flex-col lg:justify-center">
              <span className="text-3xl font-bold">{stats.data?.myStats.totalCreations}</span>
              <span className="text-3xl">Creations crafted</span>
            </div>

            <div className="flex flex-row-reverse items-center justify-end gap-x-4 gap-y-1 lg:flex-col lg:justify-center">
              <span className="text-3xl font-bold">{stats.data?.myStats.totalReferrals}</span>
              <span className="text-3xl">Fellas referred</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
