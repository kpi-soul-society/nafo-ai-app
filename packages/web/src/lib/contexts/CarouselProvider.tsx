'use client';
import { createContext, useContext, useState } from 'react';

interface CarouselItem {
  id?: string;
  imageUrl?: string;
}

interface CarouselProps<T extends CarouselItem> extends React.PropsWithChildren {
  items: T[];
}

export interface Carousel<T extends CarouselItem> {
  selectedItem: number;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => void;
  goBack: () => void;
  goFirst: () => void;
  items: T[];
}

const intialValues = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  goNext: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  goBack: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  goFirst: () => {},
  selectedItem: 0,
  isFirst: true,
  isLast: false,
  items: [] as any[],
};

export const CarouselContext = createContext(intialValues);

export const CarouselProvider = <T extends CarouselItem>({ children, items }: CarouselProps<T>) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const isLast = selectedItem === items.length - 1;
  const isFirst = selectedItem === 0;
  const goFirst = () => {
    setSelectedItem(0);
  };
  const goNext = () => {
    if (!isLast) {
      setSelectedItem(selectedItem + 1);
    } else {
      setSelectedItem(0);
    }
  };
  const goBack = () => {
    if (!isFirst) {
      setSelectedItem(selectedItem - 1);
    } else {
      setSelectedItem(items.length - 1);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        goFirst,
        items,
        selectedItem,
        isLast,
        isFirst,
        goNext,
        goBack,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  return context;
};
