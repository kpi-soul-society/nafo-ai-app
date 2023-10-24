import React from 'react';
import Image from 'next/image';

type Props = {
  withText?: boolean;
  vertical?: boolean;
  text?: string | null | undefined;
  left?: number;
  bottom?: number;
  onClick?: () => void;
  dogSizes?: string;
  bubbleSizes?: string;
  textSizes?: string;
};
export const Cheebs = ({
  withText = false,
  vertical = false,
  text = '',
  onClick,
  dogSizes = 'w-24 sm:w-36 lg:w-48',
  bubbleSizes = 'w-24 sm:w-36 lg:w-48',
  textSizes = 'text-[0.57rem] sm:text-[0.85rem] lg:text-lg',
}: Props) => {
  return (
    <div onClick={onClick} className="absolute bottom-0 left-2 flex items-center gap-2">
      <div className={`relative aspect-[18/10] ${dogSizes}`}>
        <Image
          src="/assets/cheebs.png"
          alt="cheebs"
          fill
          placeholder="blur"
          blurDataURL="/assets/cheebs.png"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {withText && !vertical && text && (
        <a className="hover:text-secondary hover:cursor-pointer">
          <div className={`relative flex aspect-[4/1] ${bubbleSizes}`}>
            <Image src="/assets/textbubble.png" alt="text bubble" fill />
            <div className={`relative w-full translate-x-[50%] translate-y-[50%] font-medium uppercase ${textSizes}`}>
              <span className="absolute left-[3px] top-[-2px] max-w-[16rem] translate-x-[-50%] translate-y-[calc(-50%+4px)]">
                {text}
              </span>
            </div>
          </div>
        </a>
      )}
    </div>
  );
};
