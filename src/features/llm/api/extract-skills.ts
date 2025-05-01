import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractSkillsFromDescription(
  description: string,
  apiToken: string
): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiToken);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert LinkedIn bot that can extract skills from job descriptions like a pro
to later identify trending skills in the job market.
From the given job description, extract required LinkedIn skills as a list with:
- no plurals
- only lower case
- the simplest form to write the skill
- avoid compound terms and acronyms
- skip generic skills
- extract context-based skills only

"""${description}"""

Return only the extracted skills in a single line separated by semicolons.
`;

  const result = await model.generateContent(prompt);
  const skillsStr = result.response.text();
  return skillsStr.split(";").map((s) => s.trim()).filter(Boolean);
}
