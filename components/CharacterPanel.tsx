import React from 'react';
import { Character } from '../types';
import { fileToBase64, getMimeType } from '../utils/fileUtils';

interface CharacterPanelProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ characters, setCharacters }) => {

  const handleNameChange = (id: string, newName: string) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleSelectionToggle = (id: string) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        const mimeType = getMimeType(file);
        setCharacters(prev => prev.map(c => c.id === id ? { 
          ...c, 
          imageData: base64, 
          mimeType: mimeType,
          selected: true // Auto select on upload
        } : c));
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">
        1. Character Reference
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {characters.map((char) => (
          <div 
            key={char.id} 
            className={`p-3 rounded-lg border transition-all ${char.selected ? 'bg-gray-800 border-blue-500' : 'bg-gray-800/50 border-gray-700'}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <input 
                type="checkbox" 
                checked={char.selected}
                onChange={() => handleSelectionToggle(char.id)}
                className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
              />
              <input 
                type="text" 
                value={char.name}
                onChange={(e) => handleNameChange(char.id, e.target.value)}
                className="bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none text-white font-medium w-full text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0 border border-gray-700 flex items-center justify-center">
                {char.imageData ? (
                  <img src={`data:${char.mimeType};base64,${char.imageData}`} alt="Ref" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-gray-600 text-xs text-center">No Img</span>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-xs text-gray-200 rounded transition-colors border border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(char.id, e)} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterPanel;
