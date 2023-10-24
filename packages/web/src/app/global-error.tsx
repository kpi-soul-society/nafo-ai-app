'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { REST_ENDPOINT } from '@/lib/config/next';

// https://nextjs.org/docs/app/building-your-application/routing/error-handling
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { data: session } = useSession();

  useEffect(() => {
    console.error(error);

    // Log the error to an error reporting service
    const fetchOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
    if (session) {
      fetchOptions.headers = {
        Authorization: `Bearer ${session.user.accessToken}`,
      };
    }
    fetch(`${REST_ENDPOINT}/errors/web/notify`, fetchOptions);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center">
        <div className="relative h-[256px] w-[256px] lg:h-[512px] lg:w-[512px]">
          <Image
            src="/assets/error.png"
            alt="error"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span className="items-center justify-center px-10  md:text-2xl xl:text-3xl">
          Oh no! Sorry, something went wrong.
        </span>
        <span className="items-center justify-center px-10  md:text-2xl xl:text-3xl">
          The website team was notified.
        </span>
        <button
          className="bg-secondary my-2 rounded-md px-3 py-2 text-lg font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:text-2xl lg:text-3xl 2xl:py-3 2xl:text-5xl"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
