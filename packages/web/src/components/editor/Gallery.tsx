import React from 'react';
import Image from 'next/image';

import { useEditorContext } from '@/lib/contexts/EditorProvider';

import { CheebsLoader } from '../common/CheebsLoader';
import { Pagination } from '../common/Pagination';

import { GalleryItem } from './GalleryItem';

export const Gallery = () => {
  const { creations, isLoading, page, setPage, lastPage, isMenuOpen } = useEditorContext();
  return (
    <div
      className={`flex ${isMenuOpen ? 'h-max' : 'min-h-full'} w-full flex-col justify-between sm:h-auto sm:min-h-full`}
    >
      {creations.length > 0 ? (
        <div
          className={`${
            isMenuOpen ? 'md:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-4  lg:grid-cols-6'
          } grid w-full grid-cols-2 gap-4 px-6 py-2 `}
        >
          {creations.map(
            ({
              id,
              resultImageUrl,
              completionStatus,
              variations,
              styles,
              textPrompt,
              startingImageUrl,
              negativePrompt,
            }) => (
              <GalleryItem
                key={id}
                id={id}
                imageUrl={resultImageUrl ?? ''}
                isImageReady={completionStatus === 'COMPLETED'}
                variations={variations}
                styles={styles}
                textPrompt={textPrompt ?? ''}
                startingImageUrl={startingImageUrl ?? ''}
                negativePrompt={negativePrompt ?? ''}
              />
            )
          )}
        </div>
      ) : (
        <div
          className={`${
            isMenuOpen ? 'justify-start' : 'justify-center'
          } flex min-h-full w-full flex-col items-center gap-4 text-xl sm:justify-center`}
        >
          {isLoading ? (
            <>
              <CheebsLoader />
            </>
          ) : (
            <div className="flex w-full flex-col items-center">
              <div className="relative aspect-[4/3] w-full sm:w-[65%]">
                <Image
                  src="/assets/cozak_squad.png"
                  alt="squad"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {creations.length > 0 && lastPage > 1 && <Pagination lastPage={lastPage} page={page} setPage={setPage} />}
    </div>
  );
};
