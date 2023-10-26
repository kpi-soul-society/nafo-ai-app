import Image from 'next/image';

export const CheebsLoader = () => {
  return (
    <>
      <div className="animate-spin-slow relative h-12 w-24 sm:h-20 sm:w-36 lg:h-24 lg:w-48">
        <Image
          src="/assets/cheebs.png"
          alt="cheebs"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <span className="text-2xl">Loading...</span>
    </>
  );
};
