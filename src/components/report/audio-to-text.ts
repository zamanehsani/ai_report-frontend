import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

// Get API key from VITE .env
const apiKey = import.meta.env.VITE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey });

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const myfile = await ai.files.upload({
    file: audioBlob,
    config: { mimeType: audioBlob.type || "audio/mp3" },
  });

  if (!myfile.uri || !myfile.mimeType) {
    throw new Error("File upload failed: uri or mimeType is undefined.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Describe this audio clip",
    ]),
  });
  if (typeof response.text !== "string") {
    throw new Error("Transcription failed: response.text is undefined.");
  }
  return response.text;
}
