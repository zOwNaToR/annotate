import React, { useRef } from 'react';

export const useLocalStorageWithRef = <T,>(key: string, initialValue: T) => {
  const storedValue = useRef<T>(
    (() => {
      if (typeof window === 'undefined') return initialValue;

      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    })(),
  );

  const setValue = (newValue: T) => {
    try {
      storedValue.current = newValue;

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue.current));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue.current, setValue] as const;
};
