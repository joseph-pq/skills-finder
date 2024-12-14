import React from 'react';

function useLocalStorage(itemName, initialValue) {
  const [item, setItem] = React.useState(initialValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    try {
      const localStorageItem = localStorage.getItem(itemName);

      let parsedItem;

      if (!localStorageItem) {
        localStorage.setItem(itemName, JSON.stringify(initialValue));
        parsedItem = initialValue;
      } else {
        parsedItem = JSON.parse(localStorageItem);
        setItem(parsedItem);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, []);

  const saveItem = (newItem) => {
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

