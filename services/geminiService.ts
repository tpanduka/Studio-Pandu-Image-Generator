import { GoogleGenAI } from "@google/genai";
import { AspectRatio, UiAspectRatio } from "../types";

// Helper to ensure we only send valid aspect ratios to the API
const mapAspectRatioToApi = (ratio: UiAspectRatio): AspectRatio => {
  if (ratio === 'Custom') return '1:1'; // Fallback for custom
  return ratio as AspectRatio;
};

interface GenerateImageParams {
  prompt: string;
  referenceImages: { data: string; mimeType: string }[];
  aspectRatio: UiAspectRatio;
}

export const promptApiKey = async () => {
  if ((window as any).aistudio) {
    await (window as any).aistudio.openSelectKey();
  }
};

export const generateCharacterImage = async (params: GenerateImageParams): Promise<string> => {
  try {
    // 1. Initialize Client (Must be done per request to catch fresh API keys if changed)
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not available");
    }
    const ai = new GoogleGenAI({ apiKey });

    // 2. Construct Parts
    // Add reference images first (multimodal context)
    const parts: any[] = params.referenceImages.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      },
    }));

    // Add the prompt - explicitly requesting an image generation to ensure the model acts as an image generator
    parts.push({
      text: `Generate an image of ${params.prompt}`,
    });

    // 3. Call API
    // Using gemini-2.5-flash-image for broader access (Free Tier friendly).
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: mapAspectRatioToApi(params.aspectRatio),
        },
      },
    });

    // 4. Parse Response
    let textResponse = '';

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            return `data:image/png;base64,${base64String}`;
          }
          if (part.text) {
            textResponse += part.text;
          }
        }
      }
    }

    // If we found text but no image, the model likely refused or misunderstood
    if (textResponse) {
      throw new Error(`Model returned text: ${textResponse.slice(0, 150)}...`);
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
