import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

// Get API key from VITE .env
const apiKey = import.meta.env.VITE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey });

export interface inputProp {
  site: string;
  user: string;
  dateNTime: Date;
  reportBody: string;
  imageDesc: string;
  audioDesc: string;
}
export async function aiSummary({
  site,
  user,
  dateNTime,
  reportBody,
  imageDesc,
  audioDesc,
}: inputProp): Promise<string> {
  const prompt = `Below is the some information to generate a report. Please go through each part and give me back a summary of the deferent datas.
  \n
  site (name of a place): ${site}
  date and time: ${dateNTime}
  Personnel email: ${user}
  Personnel description: ${reportBody}
  image description of the situation or place: ${imageDesc}
  audio recording of the personnel of the place/situation: ${audioDesc} 
`;

  console.log("prompt: ", prompt);
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([prompt]),
  });

  if (typeof response.text !== "string") {
    throw new Error("describing image failed: response.text is undefined.");
  }
  return response.text;
}
