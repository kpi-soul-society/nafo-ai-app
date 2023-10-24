'use client';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import useDownloader from 'react-use-downloader';
import { ArrowDownTrayIcon, ArrowPathIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Creation, Style } from '@nafo-ai/graphql/genql';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { AsyncButton } from '../common/AsyncButton';
import { ModalDialog } from '../common/ModalDialog';

interface HallOfFameItemProps {
  id: string;
  imageUrl: string;
  isLast: boolean;
  newLimit: any;
  creationData: Pick<Creation, 'id' | 'resultImageUrl' | 'textPrompt' | 'startingImageUrl' | 'negativePrompt'> & {
    styles: Pick<Style, 'id'>[];
  };
  isAuthenticated: boolean;
}

export const HallOfFameItem = ({
  id,
  imageUrl,
  isLast,
  newLimit,
  creationData,
  isAuthenticated,
}: HallOfFameItemProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageRef = useRef();
  const { push } = useRouter();
  /**
   * Implement Intersection Observer to check if the last Card in the array is visible on the screen, then set a new limit
   */
  useEffect(() => {
    if (!imageRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        newLimit();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(imageRef.current);
  }, [isLast]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const { download } = useDownloader();

  const handleDownload = () => {
    download(imageUrl, 'cheebs.png');
  };

  const SETTINGS_ACTIONS = [
    {
      name: 'Evolve',
      onClick: () => {
        sessionStorage.setItem('evolveItem', JSON.stringify({ ...creationData, resultImageUrl: imageUrl }));
        push('/editor');
      },
      icon: <ArrowPathIcon className="h-6" />,
    },
    {
      name: 'Img2Img',
      onClick: () => {
        sessionStorage.setItem('imageToImage', JSON.stringify({ imageUrl, id: creationData.id }));
        push('/editor');
      },
      icon: <DocumentDuplicateIcon className="h-6" />,
    },
    {
      name: 'Download',
      onClick: () => {
        handleDownload();
      },
      icon: <ArrowDownTrayIcon className="h-6" />,
    },
  ];

  return (
    <div
      key={id}
      className={`relative aspect-[15/20] w-full shrink-0 grow-0 overflow-hidden rounded-2xl`}
      ref={imageRef as unknown as LegacyRef<HTMLDivElement>}
    >
      <Image
        src={imageUrl}
        alt="NAFO dog"
        priority
        fill
        onLoad={() => {
          setIsImageLoading(false);
        }}
        style={{ objectFit: 'cover' }}
        className={`${isImageLoading && 'animate-pulse'}`}
        placeholder="blur"
        blurDataURL="/assets/empty_dog.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...(isAuthenticated ? { onClick: openModal } : {})}
      />
      <ModalDialog isOpen={isOpen} onClose={closeModal}>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col-reverse gap-5 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-2 sm:flex-col sm:justify-start">
              {SETTINGS_ACTIONS.map(({ name, onClick, icon }) => (
                <AsyncButton
                  key={name}
                  onClick={onClick}
                  disabledClassName="hover:bg-lavander"
                  className="bg-lavander hover:bg-secondary w-full max-w-[8rem] items-center justify-center gap-2 rounded-2xl p-2 text-sm transition-all hover:text-white sm:max-w-[9rem] sm:text-lg"
                >
                  {icon} {name}
                </AsyncButton>
              ))}
            </div>
            <div className="flex max-h-24 w-full min-w-0 max-w-lg overflow-y-auto px-4 text-2xl font-semibold capitalize sm:hidden">
              {creationData.textPrompt}
            </div>
            <div className="flex pl-10 pr-10 sm:pl-0">
              <div className="relative aspect-[15/20] w-full min-w-[14rem] shrink-0 grow-0 overflow-hidden rounded-2xl">
                <Image
                  src={imageUrl}
                  alt="NAFO dog"
                  priority
                  fill
                  style={{ objectFit: 'cover' }}
                  className={`${isImageLoading && 'animate-pulse'}`}
                  onClick={openModal}
                />
              </div>
            </div>
          </div>
          <div className="hidden max-h-16 w-full min-w-0 max-w-md overflow-y-auto px-4 text-2xl font-semibold capitalize sm:flex">
            {creationData.textPrompt}
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};
