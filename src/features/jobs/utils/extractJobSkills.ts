// src/features/jobs/utils/extractJobSkills.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Extracts skills from a job description using Google Generative AI.
 * @param description The job description text.
 * @param apiToken The API token for Google Generative AI.
 * @returns A promise that resolves with an array of extracted skills (strings).
 */
export const extractJobSkills = async (
  description: string,
  apiToken: string
): Promise<string[]> => {
  const genAI = new GoogleGenerativeAI(apiToken);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert linkedin bot that can extract skills from job descriptions like a pro
    to later identify trending skills in the job market.
    From the given job description. Extract required LinkedIn skills as list with no plurals, only lower case, the simplest form to write the skill, avoid compound terms, do not use acronyms. Do not write generic skills. Extract skills based on context.

    """${description}"""

    Return only the extracted skills in a single line separated by semicolons.
    `;

  try {
    const result = await model.generateContent(prompt);
    // Add a small delay to avoid hitting rate limits if processing multiple jobs
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const skillsStr = result.response.text();
    // Split by semicolon and trim whitespace from each skill
    const skills = skillsStr.split(";").map(skill => skill.trim()).filter(skill => skill.length > 0);
    return skills;
  } catch (error) {
    console.error("Error extracting skills:", error);
    // Return empty array or re-throw error depending on desired error handling
    return [];
  }
};

