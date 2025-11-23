export interface Character {
  id: string;
  name: string;
  imageData: string | null; // Base64
  mimeType: string;
  selected: boolean;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string | null;
  status: 'pending' | 'loading' | 'success' | 'error';
  timestamp: number;
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

// Extended type to handle the "Custom" UI option, though API maps it to 1:1 or closest
export type UiAspectRatio = AspectRatio | 'Custom';

export interface AppState {
  characters: Character[];
  aspectRatio: UiAspectRatio;
  prompts: string[];
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  apiKeySet: boolean;
}
