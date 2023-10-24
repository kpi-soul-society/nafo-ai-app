import Image from 'next/image';
import Link from 'next/link';

export const Tokens = ({ tokenNumber = 0 }) => {
  return (
    <Link href="/tokens">
      <div className="parent-onhover bg-yield relative flex items-center gap-2 rounded-full p-2 px-3 text-xl font-semibold text-white">
        <div className="relative aspect-square w-10 transition-transform">
          <Image
            src="/assets/token_yield.png"
            fill
            alt="tokens"
            placeholder="blur"
            blurDataURL="/assets/token_yield.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span className={`${tokenNumber === 0 ? 'sm:hidden' : 'child-hide-onhover'} flex gap-1`}>
          {tokenNumber}
          <span className="hidden sm:block">{tokenNumber === 1 ? 'Token' : 'Tokens'}</span>
        </span>
        <span className={`${tokenNumber === 0 ? 'hidden sm:flex' : 'child-show-onhover'}`}>Get more!</span>
      </div>
    </Link>
  );
};
