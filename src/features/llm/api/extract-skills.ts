import { GoogleGenAI, Type } from "@google/genai";

import { ExtractedSkillsData } from "@/features/llm/types";
import { extract_skill_template } from "@/features/llm/utils/format-prompts";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    seniority: {
      type: Type.STRING,
      enum: ["intern", "junior", "mid", "senior"],
      description: "The seniority level of the job description",
      nullable: true,
    },
    skills: {
      type: Type.ARRAY,
      description: "A list of skills extracted from the job description",
      nullable: false,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the skill",
            nullable: false,
          },
          years: {
            type: Type.NUMBER,
            description:
              "The number of years of experience required for the skill",
            nullable: true,
          },
        },
      },
    },
  },
};

export async function extractSkillsFromDescription(
  title: string,
  description: string,
  apiToken: string,
  currentSkills: string[],
  model: string = "gemini-2.0-flash",
): Promise<ExtractedSkillsData> {
  const ai = new GoogleGenAI({ apiKey: apiToken });

  const prompt = extract_skill_template
    .replace("_SKILLS_", currentSkills.join(", "))
    .replace("_JOB_TITLE_", title)
    .replace("_JOB_DESCRIPTION_", description);

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });


  const parsedResponse =  JSON.parse(response.text as string) as ExtractedSkillsData;
  console.log("AI response:", parsedResponse);
  return parsedResponse;
}
