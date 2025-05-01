import React from "react";

import { useLocalStorage } from "./useLocalStorage";
import { Job } from "../types";

interface JobsContextProps {
  jobs: Job[];
  saveJobs: (jobs: Job[]) => void;
  loadingJobs: boolean;
  jobsError: boolean;
  addJob: (newJob: Job) => void;
  apiToken: string;
  saveApiToken: (token: string) => void;
  loadingApiToken: boolean;
  apiTokenError: boolean;
}

const JobsContext = React.createContext<JobsContextProps | undefined>(
  undefined,
);

function JobsProvider({ children }: { children: React.ReactNode }) {
  const {
    item: jobs,
    saveItem: saveJobs,
    loading: loadingJobs,
    error: jobsError,
  } = useLocalStorage<Job[]>("JOBS_V1", []);
  const {
    item: apiToken,
    saveItem: saveApiToken,
    loading: loadingApiToken,
    error: apiTokenError,
  } = useLocalStorage<string>("JOBS_API_TOKEN_V1", "");

  const addJob = (newJob: Job) => {
    const newJobs: Job[] = [...jobs];
    newJobs.push(newJob);
    saveJobs(newJobs);
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        saveJobs,
        loadingJobs,
        jobsError,
        addJob,
        apiToken,
        saveApiToken,
        loadingApiToken,
        apiTokenError,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export { JobsContext, JobsProvider };
