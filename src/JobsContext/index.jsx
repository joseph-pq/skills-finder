import React from 'react';
import { useLocalStorage } from './useLocalStorage';


const JobsContext = React.createContext();

function JobsProvider({children}) {
  const {
    item: jobs,
    saveItem: saveJobs,
    loading: loadingJobs,
    error: jobsError,
  } = useLocalStorage('JOBS_V1', []);
  const {
    item: apiToken,
    saveItem: saveApiToken,
    loading: loadingApiToken,
    error: apiTokenError,
  } = useLocalStorage('JOBS_API_TOKEN_V1', []);

  const addJob = (newJob) => {
      const newJobs = [...jobs];
      newJobs.push(newJob);
      saveJobs(newJobs);
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      saveJobs,
      loadingJobs,
      jobsError,
      addJob,
      apiToken,
      saveApiToken,
      loadingApiToken,
      apiTokenError,
    }}>
      {children}
    </JobsContext.Provider>
  );
}


export { JobsContext, JobsProvider };
