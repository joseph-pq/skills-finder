import { Seniority } from '@/types';

export interface ExtractedSkillsData {
	seniority: Seniority | null;
	skills: {
		name: string;
		years: number | null;
	}[];
}
