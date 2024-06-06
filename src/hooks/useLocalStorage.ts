import { useState } from "react";

// Define a generic type for the stored value
type StoredValue<T> = T | null;

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [StoredValue<T>, (newValue: T) => void] => {
  // Retrieve stored value from localStorage or use initialValue if not present
  const storedValue = localStorage.getItem(key);
  const initial: StoredValue<T> = storedValue
    ? JSON.parse(storedValue)
    : initialValue;

  // State to hold the current value
  const [value, setValue] = useState<StoredValue<T>>(initial);

  // Update localStorage whenever the state changes
  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
};

export default useLocalStorage;
