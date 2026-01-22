
import { GoogleGenAI } from "@google/genai";

export interface SecurityNotification {
  id: string;
  type: 'REGISTRATION' | 'LOGIN_ALERT';
  timestamp: string;
  recipient: string;
  subject: string;
  body: string;
  metadata: {
    ip: string;
    location: string;
    device: string;
  };
}

export async function generateSecurityNotification(
  email: string, 
  type: 'REGISTRATION' | 'LOGIN_ALERT'
): Promise<SecurityNotification> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mockMetadata = {
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.XXX.XXX`,
    location: "Global Proxy Node (Secure Tunnel)",
    device: navigator.userAgent.split(') ')[0] + ')'
  };

  const prompt = type === 'REGISTRATION' 
    ? `Generate a formal welcome email body for a new user '${email}' joining the 'Nexus Forensic Pre-Mortem Engine'. Use enterprise security terminology. Mention their identity has been vaulted.`
    : `Generate a 'Suspicious Login Alert' manifest for user '${email}'. Mention login detected from IP ${mockMetadata.ip} at ${mockMetadata.location}. Ask 'Was this you?' and provide security instructions. Use adversarial/forensic tone.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "You are the Nexus System Security AI. Your tone is cold, professional, and hyper-secure. Do not use conversational filler.",
    }
  });

  return {
    id: `SEC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    type,
    timestamp: new Date().toISOString(),
    recipient: email,
    subject: type === 'REGISTRATION' ? 'IDENTITY_VAULTED :: WELCOME TO NEXUS' : 'SECURITY_ALERT :: UNKNOWN_ACCESS_DETECTED',
    body: response.text || "Encryption Error: Manifest Body Unavailable.",
    metadata: mockMetadata
  };
}
