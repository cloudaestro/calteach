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
    throw error;
  }
};