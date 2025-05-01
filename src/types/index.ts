export enum StorageViewType {
  Jobs = "jobs",
  Skills = "skills",
  Groups = "groups",
}

export enum Seniority {
	intern = "intern",
	junior = "junior",
	mid = "mid",
	senior = "senior",
}

export interface Job {
  id: number;
  title: string;
  company: string;
  seniority: Seniority | null;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface JobSkill {
  id: number;
  jobId: number;
  skillId: number;
  years: number | null;
}

export interface Table<T> {
  max_id: number;
  data: T[];
}
