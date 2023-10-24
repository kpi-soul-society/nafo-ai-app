import { useRef, useState } from 'react';

/**
 * Could be used to e.g. show the user how much time has passed since they clicked the "generate" button.
 */
export const useTimer = (initialState = 0) => {
  const [elapsedTime, setElapsedTime] = useState(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const countRef = useRef<number | undefined>(undefined);

  const handleStart = () => {
    const startTime = Date.now() - elapsedTime;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    countRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);
    setIsRunning(true);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsRunning(false);
    setElapsedTime(0);
  };

  return { elapsedTime, isRunning, handleStart, handlePause, handleReset };
};
