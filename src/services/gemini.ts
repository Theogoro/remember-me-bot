import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../utils/env";
import { cleanAiString } from "../utils/string";

const BASE_PROMPT = `
  --BASICS:
  you're an assistant that helps to manage events in google calendar
`;

const BASE_CONTEXT = `
  --Context:
  todays date is: ${new Date().toISOString()} -I'm living in ${env.country}, so use my timezone. All responses should respect json format. In case you cannot provide a valid json, return a json with a error message.
`;

async function callGeminiAPI(prompt: string) {
  const gemini = new GoogleGenerativeAI(env.geminiAPIKey);
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
  const response = await model.generateContent(prompt);
  return response;
}

export const cleanData = async (data: string) => {
  const answer = await callGeminiAPI(`
      ${BASE_PROMPT}
      --INTENT:
      take the following text and format it to fit a json with the fields: title, description, start, end. Give me the json as a response in the way i can you it with the JSON.parse() function. On the title field, include emojis that represent the event. In case the event is an all day event, set the start and end fields to the date of the event. In case there isn't information about the event, return an error message.
      ${BASE_CONTEXT}
      --DATA:
      ${data}
    `);
  return cleanAiString(answer.response.text());
};

export const generateEventQuery = async (data: string) => {
  const answer = await callGeminiAPI(`
      ${BASE_PROMPT}
      --INTENT:
      take the following text and format it to fit a query to get events from a calendar. Give me the query as a response. Use the parameters: timeMin, timeMax, maxResults:20, singleEvents:true, orderBy:startTime. Use the date of the event as the timeMin parameter.
      ${BASE_CONTEXT}
      --DATA:
      ${data}
    `);
  return cleanAiString(answer.response.text());
};