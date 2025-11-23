import { Character } from "./types";

export const INITIAL_CHARACTERS: Character[] = [
  { id: 'char1', name: 'Character 1', imageData: null, mimeType: '', selected: true },
  { id: 'char2', name: 'Character 2', imageData: null, mimeType: '', selected: false },
  { id: 'char3', name: 'Character 3', imageData: null, mimeType: '', selected: false },
  { id: 'char4', name: 'Character 4', imageData: null, mimeType: '', selected: false },
];

export const ASPECT_RATIOS = [
  { label: '16:9 (Landscape)', value: '16:9' },
  { label: '9:16 (Portrait)', value: '9:16' },
  { label: '1:1 (Square)', value: '1:1' },
  { label: '4:3 (Standard)', value: '4:3' },
  { label: 'Custom', value: 'Custom' },
];
