export enum StorageViewType {
  Jobs = "jobs",
  Skills = "skills",
  Groups = "groups",
}

export interface Job {
  jobTitle: string;
  companyName: string;
  description: string;
  skills: string[];
}
