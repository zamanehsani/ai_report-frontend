import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

// Get API key from VITE .env
const apiKey = import.meta.env.VITE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey });

export async function describeImage(imageBlob: Blob): Promise<string> {
  const imageFile = await ai.files.upload({
    file: imageBlob,
  });

  if (!imageFile.uri || !imageFile.mimeType) {
    throw new Error("File upload failed: uri or mimeType is undefined.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      createPartFromUri(imageFile.uri, imageFile.mimeType),
      "Describe this image",
    ]),
  });

  if (typeof response.text !== "string") {
    throw new Error("describing image failed: response.text is undefined.");
  }
  return response.text;
}
