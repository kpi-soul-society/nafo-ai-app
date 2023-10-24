import { useCallback, useEffect, useRef, useState } from 'react';

export const useScrollTooltip = (dependency: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollHandler = useCallback(() => {
    if (window.pageYOffset + window.innerHeight >= ref.current!.offsetTop) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    scrollHandler();
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [dependency]);
  return { refElement: ref, isTooltipVisible: isVisible };
};
