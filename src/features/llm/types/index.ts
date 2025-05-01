export enum Seniority {
	intern = "intern",
	junior = "junior",
	mid = "mid",
	senior = "senior",
}

export interface ExtractedSkillsData {
	seniority: Seniority | null;
	skills: {
		name: string;
		years: number | null;
	}[];
}
