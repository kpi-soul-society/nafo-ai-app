import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

import { useCarouselContext } from '@/lib/contexts/CarouselProvider';

import { emptyDogPlaceholder } from '../images/EmptyDog';

export const Carousel = () => {
  const { items, selectedItem, goNext, goBack } = useCarouselContext();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        <ChevronLeftIcon className={`${items.length <= 1 && 'invisible'} h-12`} onClick={goBack} />
        <div className="relative aspect-[15/20] w-full min-w-[14rem] overflow-hidden rounded-2xl">
          <Image
            src={items[selectedItem].imageUrl ?? '/assets/empty_dog.png'}
            alt="NAFO Dog"
            fill
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL={emptyDogPlaceholder}
          />
        </div>
        <ChevronRightIcon className={`${items.length <= 1 && 'invisible'} h-12`} onClick={goNext} />
      </div>
      <div className="flex gap-1">
        {items.length > 1 &&
          items.map((item, index) => (
            <StopIcon
              className={`h-4 ${index === selectedItem ? 'text-secondary' : 'text-lavander'}`}
              key={`icon_${index}`}
            />
          ))}
      </div>
    </div>
  );
};
