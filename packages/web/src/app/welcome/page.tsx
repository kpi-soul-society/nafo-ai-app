import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

const Welcome = () => {
  return (
    <div>
      <Link
        href="/"
        className="bg-secondary  absolute left-5 top-5 flex items-center justify-center gap-2 rounded-full p-5 text-2xl text-white transition-all duration-500 hover:bg-indigo-500"
      >
        <ArrowLeftIcon className="w-10" />
      </Link>

      <div className="flex flex-col overflow-hidden px-10 lg:px-20 xl:px-28">
        <main className="flex min-h-screen flex-col items-center justify-center gap-y-4 font-sans">
          <div className="relative aspect-[16/6] w-[25rem] sm:w-[30rem] 2xl:w-[40rem]">
            <Image src="/assets/squad.png" alt="squad" fill />
          </div>
          <div className="flex justify-between gap-4">
            <div className="relative hidden aspect-square w-[15rem] sm:block 2xl:w-[20rem]">
              <Image src="/assets/getman.png" alt="squad" fill />
            </div>
            <div className="font-russo flex flex-col items-center text-xl sm:pt-10  2xl:text-3xl">
              <span>Thanks for showing interest in our project!</span>
              <span>We will let you know once we launch.</span>
            </div>
            <div className="relative hidden aspect-square w-[15rem] -scale-x-100 sm:block 2xl:w-[20rem]">
              <Image src="/assets/getman.png" alt="squad" fill />
            </div>
          </div>
          <div className="relative aspect-square w-[15rem] sm:hidden 2xl:w-[20rem]">
            <Image src="/assets/getman.png" alt="squad" fill />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Welcome;
