import React, { useState, useEffect } from "react";

type DebouncedFunction<T extends any[]> = (...args: T) => void;

function useDebounce<T extends any[]>(
  callback: DebouncedFunction<T>,
  delay: number,
) {
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return function debouncedFunction(...args: T) {
    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimerId(newTimerId);
  };
}

export default useDebounce;
