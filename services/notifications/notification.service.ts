
import { GoogleGenAI } from "@google/genai";

export async function generateSecurityNotification(email: string, type: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Security notification for ${email}. Type: ${type}. Forensic enterprise tone.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: { systemInstruction: "Nexus Security AI." }
  });
  return response.text;
}
