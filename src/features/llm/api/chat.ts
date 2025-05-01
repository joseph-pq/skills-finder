import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gets a chat response from the Google Generative AI model.
 * @param message The user's message.
 * @param apiToken The API token for Google Generative AI.
 * @returns A promise that resolves with the bot's response string.
 */
export const getChatResponse = async (
  message: string,
  apiToken: string
): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(apiToken);
    // Using a suitable model for chat, gemini-1.5-flash-latest is a good choice
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(message);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Sorry, I am unable to respond at the moment.";
  }
};

