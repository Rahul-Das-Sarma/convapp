import { useState, useEffect } from "react";

// Generic useLocalStorage hook with proper types
export const useLocalStorage = <T,>(
  key: string,
  initValue: T | (() => T)
): [T, (value: T) => void] => {
  function getLocalValue(): T {
    const localValue = localStorage.getItem(key);
    if (localValue) {
      return JSON.parse(localValue);
    }

    // If initValue is a function, invoke it, otherwise return initValue directly
    if (typeof initValue === "function") {
      return (initValue as () => T)();
    } else {
      return initValue;
    }
  }

  const [value, setValue] = useState<T>(getLocalValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
