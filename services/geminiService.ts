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

    // Add the prompt
    parts.push({
      text: params.prompt,
    });

    // 3. Call API
    // Using gemini-3-pro-image-preview for high quality (4K supported) and reference image support.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: mapAspectRatioToApi(params.aspectRatio),
          imageSize: '4K', // Requested in prompt
        },
      },
    });

    // 4. Parse Response
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          return `data:image/png;base64,${base64String}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// AI Studio Key Selection Helpers

export const checkApiKey = async (): Promise<boolean> => {
  if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptApiKey = async (): Promise<void> => {
  if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
    await (window as any).aistudio.openSelectKey();
  } else {
    console.warn("AI Studio environment not detected.");
  }
};