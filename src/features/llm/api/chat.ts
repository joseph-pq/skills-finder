import { GoogleGenAI, FunctionCallingConfigMode } from "@google/genai";

import { chatbotSystemPrompt } from "@/features/llm/utils/format-prompts";
import {
  getRegistries,
  groupBy,
  joinLists,
} from "@/features/llm/utils/function-calls";
import { Job, JobSkill, Skill } from "@/types";

type GroupedResult = { key: string | number; size: number };

/**
 * Groups a list of objects by a specified key and returns a new list with objects: {key: `key`, size: `size`}
 * @param list The list of objects to group.
 * @param key The key to group by.
 * @returns A new list of objects with the key and size properties.
 */
const groupByFunction = <T extends Record<string, string | number>>(
  list: T[],
  keyName: string,
): GroupedResult[] => {
  const grouped: Record<string, GroupedResult> = list.reduce(
    (acc, obj) => {
      const keyValue: string | number = obj[keyName];
      if (!acc[keyValue]) {
        acc[keyValue] = { [keyName]: keyValue, count: 0 };
      }
      acc[keyValue].size += 1;
      return acc;
    },
    {} as Record<string, GroupedResult>,
  );

  return Object.values(grouped);
};

const getRegistriesFunction = <T extends Record<string, string | number>>(
  list: T[],
  count: number,
  orderBy: string,
): T[] => {
  // Sort the list based on the orderBy field
  const sortedList = list.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return -1;
    if (a[orderBy] > b[orderBy]) return 1;
    return 0;
  });

  // Return the first `count` items from the sorted list
  return sortedList.slice(0, count);
};

const joinListsFunction = <T extends Record<string, string | number>>(
  list1: T[],
  list2: T[],
  key1: string,
  key2: string,
): T[] => {
  const joinedList = list1.map((item1) => {
    const item2 = list2.find((item) => item[key2] === item1[key1]);
    return { ...item1, ...item2 };
  });
  return joinedList;
};

/**
 * Gets a chat response from the Google Generative AI model.
 * @param message The user's message.
 * @param apiToken The API token for Google Generative AI.
 * @returns A promise that resolves with the bot's response string.
 */
export const getChatResponse = async (
  message: string,
  apiToken: string,
  jobs: Job[],
  skills: Skill[],
  jobSkills: JobSkill[],
  model: string = "gemini-2.0-flash",
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: apiToken });

    const contents = [{ role: "user", parts: [{ text: message }] }];

    const maxIterations = 7;
    const currentListNames = ["jobs", "skills", "jobSkills"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalLists: Record<string, any[]> = {
      jobs: jobs,
      skills: skills,
      jobSkills: jobSkills,
    };

    for (let i = 0; i < maxIterations; i++) {
      groupBy.parameters.properties.list.enum = currentListNames;
      joinLists.parameters.properties.list1.enum = currentListNames;
      joinLists.parameters.properties.list2.enum = currentListNames;
      getRegistries.parameters.properties.list.enum = currentListNames;
      console.log(
        "Contents:",
        contents.map((c) => ({ role: c.role, message: c.parts[0].text })),
      );
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: chatbotSystemPrompt,
          tools: [
            { functionDeclarations: [getRegistries, groupBy, joinLists] },
          ],
        },
      });
      console.log("Response:", response);
      console.log("Response text:", response.text || "***");
      // check if response is a function call
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const functionCall of functionCalls) {
          const functionName = functionCall.name;
          const functionArgs = functionCall.args;
          console.log("Function call:", functionName, functionArgs);
          contents.push({
            role: "assistant",
            parts: [
              {
                text:
                  "Function call: " +
                  functionName +
                  JSON.stringify(functionArgs),
              },
            ],
          });
          if (functionName === "groupBy") {
            if (!functionArgs) {
              console.error("Function arguments are missing.");
              return "Sorry, I couldn't process your request.";
            }
            const listName: string = functionArgs["list"] as string;
            const key: string = functionArgs["key"] as string;
            const newName = functionArgs["newName"] as string;
            // check if newName is already registered
            if (currentListNames.includes(newName)) {
              contents.push({
                role: "user",
                parts: [
                  {
                    text: `The list "${newName}" already exists. Please choose a different name.`,
                  },
                ],
              });
              continue;
            }
            totalLists[newName] = groupByFunction(totalLists[listName], key);
            currentListNames.push(newName);
            // Update the contents with the grouped list
            contents.push({
              role: "user",
              parts: [
                {
                  text: `Created new list "${newName}" which was created from "${listName}" but with grouped by "${key}". This new array contains ${totalLists[newName].length} items.`,
                },
              ],
            });
            continue;
          } else if (functionName === "getRegistries") {
            if (!functionArgs) {
              console.error("Function arguments are missing.");
              return "Sorry, I couldn't process your request.";
            }
            const listName: string = functionArgs["list"] as string;
            const count: number = functionArgs["count"] as number;
            const orderBy: string = functionArgs["orderBy"] as string;
            // check if listName is already registered
            if (!currentListNames.includes(listName)) {
              contents.push({
                role: "user",
                parts: [
                  {
                    text: `The list "${listName}" does not exist. Please choose a different name.`,
                  },
                ],
              });
              continue;
            }
            const newList = getRegistriesFunction(
              totalLists[listName],
              count,
              orderBy,
            );
            contents.push({
              role: "user",
              parts: [
                {
                  text: `Result of "${functionName}" function call: ${JSON.stringify(newList)}`,
                },
              ],
            });
            continue;
          } else if (functionName === "joinLists") {
            if (!functionArgs) {
              console.error("Function arguments are missing.");
              return "Sorry, I couldn't process your request.";
            }
            const list1Name: string = functionArgs["list1"] as string;
            const list2Name: string = functionArgs["list2"] as string;
            const key1: string = functionArgs["key1"] as string;
            const key2: string = functionArgs["key2"] as string;
            const newName: string = functionArgs["newName"] as string;
            // check if newName is already registered
            if (currentListNames.includes(newName)) {
              contents.push({
                role: "user",
                parts: [
                  {
                    text: `The list "${newName}" already exists. Please choose a different name.`,
                  },
                ],
              });
              continue;
            }
            // check if list1Name and list2Name are already registered
            if (
              !currentListNames.includes(list1Name) ||
              !currentListNames.includes(list2Name)
            ) {
              contents.push({
                role: "user",
                parts: [
                  {
                    text: `The list "${list1Name}" or "${list2Name}" does not exist. Please choose a different name.`,
                  },
                ],
              });
              continue;
            }
            const newList = joinListsFunction(
              totalLists[list1Name],
              totalLists[list2Name],
              key1,
              key2,
            );
            totalLists[newName] = newList;
            currentListNames.push(newName);
            // Update the contents with the joined list
            contents.push({
              role: "user",
              parts: [
                {
                  text: `Created new list "${newName}" which was created from "${list1Name}" and "${list2Name}" but with joined by "${key1}" and "${key2}". This new array contains ${totalLists[newName].length} items. First object contains: ${JSON.stringify(
                    newList[0],
                  )}.`,
                },
              ],
            });
            continue;
          }
          return "Invalid function call.";
        }
      } else {
        return response.text as string;
      }
    }
    return "Sorry, I couldn't process your request.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Sorry, I am unable to respond at the moment.";
  }
};
