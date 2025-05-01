import { useState, useEffect } from "react";

type SetItemFunction<T> = (value: T) => void;

interface UseLocalStorageReturn<T> {
  item: T;
  saveItem: SetItemFunction<T>;
  loading: boolean;
  error: boolean;
}

function useLocalStorage<T>(
  itemName: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  const [item, setItem] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const localStorageItem = localStorage.getItem(itemName);

      let parsedItem: T;

      if (!localStorageItem) {
        localStorage.setItem(itemName, JSON.stringify(initialValue));
        parsedItem = initialValue;
      } else {
        parsedItem = JSON.parse(localStorageItem);
        setItem(parsedItem);
      }

      setLoading(false);
    } catch (error) {
      console.error(error); // Log the error for debugging
      setLoading(false);
      setError(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveItem = (newItem: T): void => {
    localStorage.setItem(itemName, JSON.stringify(newItem));
    setItem(newItem);
  };

  return {
    item,
    saveItem,
    loading,
    error,
  };
}

export { useLocalStorage };

// localStorage.removeItem('JOBS_V1');

// const defaultJobs = [
// {"title":"Software Engineer","company":"Facebook", "description":"Work on the Facebook app", "skills": ["React", "JavaScript", "Node.js"]},
// {"title":"Software Engineer","company":"Google", "description":"Work on the Google app", "skills": ["React", "JavaScript", "Node.js"]},
// {"title":"Software Engineer","company":"Amazon", "description":"Work on the Amazon app", "skills": ["React", "JavaScript", "Node.js"]},
// ];

// localStorage.setItem('JOBS_V1', JSON.stringify(defaultTodos));
