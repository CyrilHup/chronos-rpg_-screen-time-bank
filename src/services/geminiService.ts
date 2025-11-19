import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Safely initialize AI only if key exists to avoid runtime crash on init
const getAiClient = () => {
  if (!apiKey) {
    console.warn("API Key not found. AI features will return mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDailyQuests = async (interests: string): Promise<any[]> => {
  const ai = getAiClient();
  if (!ai) {
    return [
      { title: "Hydration Check", description: "Drink a glass of water", durationMinutes: 5, rewardMinutes: 5 },
      { title: "Eye Rest", description: "Look at something 20ft away for 20s", durationMinutes: 2, rewardMinutes: 2 }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 healthy, non-screen related tasks for someone interested in ${interests}. 
      Return JSON matching this schema: Array of objects with title (string), description (string), durationMinutes (number), rewardMinutes (number).
      Make the reward slightly higher than the duration to incentivize them.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              durationMinutes: { type: Type.NUMBER },
              rewardMinutes: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Error generating quests:", error);
    return [];
  }
};

export const generateClanQuestLore = async (clanName: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Unite to defeat the procrastination demon!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a one sentence epic fantasy quest description for a clan named "${clanName}" whose goal is to reduce screen time.`,
    });
    return response.text || "Complete tasks to save the realm.";
  } catch (e) {
    return "Complete tasks to save the realm.";
  }
};

export const generateAvatarEvolutionText = async (stage: number): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "You have evolved!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Describe a digital avatar evolving to stage ${stage} of 3 in a cyberpunk fantasy style. One sentence.`,
    });
    return response.text || "You feel a surge of power.";
  } catch (e) {
    return "You feel a surge of power.";
  }
};