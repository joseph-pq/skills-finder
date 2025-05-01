import * as dotenv from "dotenv";

import { extractSkillsFromDescription } from "@/features/llm/api/extract-skills";

dotenv.config();

async function main() {
  const apiToken = process.env.GEMINI_API_KEY!;
  if (!apiToken) throw new Error("Missing GEMINI_API_KEY");

  const jobDescription = `
    We are seeking a mid-level frontend developer proficient in React, TypeScript,
    and Tailwind CSS, with at least 3 years of experience.
  `;

  const currentSkills = ["React", "TypeScript", "Tailwind CSS"];

  try {
    const result = await extractSkillsFromDescription(
      jobDescription,
      apiToken,
      currentSkills,
    );
    // print type of result
    console.log("✅ API response:\n", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error calling API:", error);
  }
}

main();
