import React from "react";

import { ExtractedSkillsData } from "@/features/llm/types";
import { useLocalStorage } from "@/jobs-context/use-local-storage";
import { Job, Skill, JobSkill, Table } from "@/types";

interface JobsContextProps {
  jobs: Table<Job>;
  saveJobs: (jobs: Table<Job>) => void;
  loadingJobs: boolean;
  jobsError: boolean;
  addJob: (newJob: Job) => void;
  jobSkills: Table<JobSkill>;
  saveJobSkills: (jobSkills: Table<JobSkill>) => void;
  loadingJobSkills: boolean;
  jobSkillsError: boolean;
  addJobSkill: (newJobSkill: JobSkill) => void;
  getSkills: (jobId: number) => Skill[];
  skills: Table<Skill>;
  saveSkills: (skills: Table<Skill>) => void;
  loadingSkills: boolean;
  skillsError: boolean;
  addSkill: (newSkill: Skill) => void;
  apiToken: string;
  saveApiToken: (token: string) => void;
  loadingApiToken: boolean;
  apiTokenError: boolean;
  addSkillsToJob: (jobId: number, skills: ExtractedSkillsData) => void;
  removeAllSkillsFromJob: (jobId: number) => void;
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
  } = useLocalStorage<Table<Job>>("JOBS_V2", { max_id: 0, data: [] });
  const {
    item: jobSkills,
    saveItem: saveJobSkills,
    loading: loadingJobSkills,
    error: jobSkillsError,
  } = useLocalStorage<Table<JobSkill>>("JOB_SKILLS_V1", {
    max_id: 0,
    data: [],
  });
  const {
    item: skills,
    saveItem: saveSkills,
    loading: loadingSkills,
    error: skillsError,
  } = useLocalStorage<Table<Skill>>("SKILLS_V1", { max_id: 0, data: [] });
  const {
    item: apiToken,
    saveItem: saveApiToken,
    loading: loadingApiToken,
    error: apiTokenError,
  } = useLocalStorage<string>("JOBS_API_TOKEN_V1", "");

  const addJob = (newJob: Job) => {
    const new_max_id = jobs.max_id + 1;
    newJob.id = new_max_id;
    const newJobs: Table<Job> = {
      max_id: new_max_id,
      data: [...jobs.data, newJob],
    };
    saveJobs(newJobs);
  };

  const addJobSkill = (newJobSkill: JobSkill) => {
    const newJobSkills: Table<JobSkill> = {
      max_id: jobSkills.max_id + 1,
      data: [...jobSkills.data, newJobSkill],
    };
    saveJobSkills(newJobSkills);
  };
  const addSkill = (newSkill: Skill) => {
    const newSkills: Table<Skill> = {
      max_id: skills.max_id + 1,
      data: [...skills.data, newSkill],
    };
    saveSkills(newSkills);
  };

  // get skills by job id
  const getSkills = (jobId: number): Skill[] => {
    const jobSkillsForJob = jobSkills.data.filter(
      (jobSkill) => jobSkill.jobId === jobId,
    );
    const skillIds = jobSkillsForJob.map((jobSkill) => jobSkill.skillId);
    const skillsForJob = skills.data.filter((skill) =>
      skillIds.includes(skill.id),
    );
    return skillsForJob;
  };

  /**
    * Add skills to a job. The job must not already have the skills.
    *
    * @param jobId - The ID of the job to which the skills will be added
    * @param skillsData - The skills data extracted from the job description
    * @returns {void}
    */
  const addSkillsToJob = (jobId: number, skillsData: ExtractedSkillsData) => {

    const { seniority, skills: skillsArr } = skillsData;
    // make a copy of skills table
    let existingSkillsTable = { ...skills };
    const newJobSkills: JobSkill[] = skillsArr.map((skill, index) => {
      const existingSkill = existingSkillsTable.data.find(
        (s) => s.name === skill.name,
      );
      let skillId = existingSkill ? existingSkill.id : 0;
      if (!existingSkill) {
        const newSkill: Skill = {
          id: existingSkillsTable.max_id + 1,
          name: skill.name,
        };
        const newSkillsTable: Table<Skill> = {
          max_id: existingSkillsTable.max_id + 1,
          data: [...existingSkillsTable.data, newSkill],
        };
        skillId = newSkill.id;
        existingSkillsTable = newSkillsTable;
      }
      return {
        id: jobSkills.max_id + index + 1,
        jobId,
        skillId,
        years: skill.years,
      };
    });

    saveSkills(existingSkillsTable);

    const newJobSkillsTable: Table<JobSkill> = {
      max_id: jobSkills.max_id + newJobSkills.length,
      data: [...jobSkills.data, ...newJobSkills],
    };
    saveJobSkills(newJobSkillsTable);

    // Update seniority in the job table
    const jobIndex = jobs.data.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      const updatedJob = { ...jobs.data[jobIndex], seniority };
      const updatedJobsTable: Table<Job> = {
        max_id: jobs.max_id,
        data: [
          ...jobs.data.slice(0, jobIndex),
          updatedJob,
          ...jobs.data.slice(jobIndex + 1),
        ],
      };
      saveJobs(updatedJobsTable);
    }
  }

  /**
    * Remove skills from a job.
    * This functions removes all skills associations for the job. Do not
    * remove skills from the skills table.
    *
    * @param jobId - The ID of the job from which the skills will be removed
    * @param skillsData - The skills data extracted from the job description
    * @returns {void}
    */
  const removeAllSkillsFromJob = (jobId: number) => {
    const newJobSkills: Table<JobSkill> = {
      max_id: jobSkills.max_id,
      data: jobSkills.data.filter((jobSkill) => jobSkill.jobId !== jobId),
    };
    saveJobSkills(newJobSkills);
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        saveJobs,
        loadingJobs,
        jobsError,
        addJob,
        jobSkills,
        saveJobSkills,
        loadingJobSkills,
        jobSkillsError,
        addJobSkill,
        skills,
        getSkills,
        saveSkills,
        loadingSkills,
        skillsError,
        addSkill,
        apiToken,
        saveApiToken,
        loadingApiToken,
        apiTokenError,
        addSkillsToJob,
        removeAllSkillsFromJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export { JobsContext, JobsProvider };
