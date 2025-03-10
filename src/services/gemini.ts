import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../utils/env";

async function callGeminiAPI(prompt: string) {
  const gemini = new GoogleGenerativeAI(env.geminiAPIKey);
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
  const response = await model.generateContent(prompt);
  return response;
}

export const cleanData = async (data: string) => {
  const answer = await callGeminiAPI(`
      --INTENT:
      you're an assistan that helps to save events in a calendar. take the following text and format it to fit a json with the fields: title, description, start, end. Give me the json as a response in the way i can you it with the JSON.parse() function. On the title field, include emojis that represent the event. I'm living in ${env.country}, so use my timezone.
      --Context:
      todays date is: ${new Date().toISOString()}
      --DATA:
      ${data}
    `);

  return answer.response.text().replace("```", "").replace("json", "").replace("```", "");
};