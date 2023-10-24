'use client';
import React from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { MAIN_PAGES } from '@/lib/constants/pages';
import { useEditorContext } from '@/lib/contexts/EditorProvider';

import { RoutesMenu } from '../common/RoutesMenu';
import { Tokens } from '../common/Tokens';
import { UserMenu } from '../common/UserMenu';
import { Logo } from '../images/Logo';
import { ShortLogo } from '../images/ShortLogo';

export const Header = () => {
  const { isMenuOpen, onMenuClick, tokenNumber = 0 } = useEditorContext();
  return (
    <header className={`flex h-24 items-center justify-between`}>
      <div
        className={`flex h-24 w-full items-center gap-x-4 sm:w-[calc(25%+6px)] sm:min-w-[18rem] sm:justify-between sm:px-6 md:min-w-[23rem] 2xl:min-w-[28rem] ${
          isMenuOpen && 'border-solid border-gray-300 sm:border-r'
        } `}
      >
        <Link href="/">
          <Logo className="hidden h-8 sm:block md:h-12" />
        </Link>
        <div className="flex gap-x-4">
          <Link href="/">
            <ShortLogo className="h-12 sm:hidden sm:h-14" />
          </Link>
          <div className="relative aspect-square w-12">
            <PlusCircleIcon
              className={`hover:text-secondary absolute z-10 aspect-square w-12 transition-all ${
                isMenuOpen && 'invisible absolute rotate-45 text-white opacity-0 hover:text-white sm:scale-[2]'
              }`}
              onClick={onMenuClick}
            />
            <XMarkIcon
              className={`hover:text-secondary absolute z-20 aspect-square w-12 transition-all  ${
                isMenuOpen ? 'rotate-180 scale-100' : 'invisible absolute rotate-45 scale-[0.3]'
              }`}
              onClick={onMenuClick}
            />
          </div>
        </div>
      </div>

      <div className={`flex w-full items-center justify-end ${isMenuOpen && 'sm:justify-between'} gap-6 pr-6 sm:pl-6 `}>
        <Tokens tokenNumber={tokenNumber} />
        <div className="flex items-center gap-2">
          <RoutesMenu routes={MAIN_PAGES} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
