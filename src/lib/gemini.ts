import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA3eNaMjvApPVauYr5FbqiH0caNGxfTOac");

export const generateWorksheet = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating worksheet:', error);
    // Return a fallback description if the API call fails
    return `Description for: ${prompt.replace('Generate a short, specific clue for the word "', '').replace('" suitable for a crossword puzzle. Keep it under 10 words.', '')}`;
  }
};