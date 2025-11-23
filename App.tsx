import React, { useState } from 'react';
import { Character, GeneratedImage, UiAspectRatio } from './types';
import { INITIAL_CHARACTERS } from './constants';
import CharacterPanel from './components/CharacterPanel';
import PromptPanel from './components/PromptPanel';
import ResultsGrid from './components/ResultsGrid';
import { generateCharacterImage } from './services/geminiService';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [aspectRatio, setAspectRatio] = useState<UiAspectRatio>('16:9');
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    const validPrompts = prompts.filter(p => p.trim() !== '');
    if (validPrompts.length === 0) {
      alert("Please enter at least one prompt.");
      return;
    }

    const selectedCharacters = characters.filter(c => c.selected && c.imageData);
    
    // Initialize results placeholders
    const newImages: GeneratedImage[] = validPrompts.map((prompt, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      prompt,
      imageUrl: null,
      status: 'pending',
      timestamp: Date.now()
    }));
    
    setGeneratedImages(newImages);
    setIsGenerating(true);

    // Process sequentially to manage rate limits and ensure order
    for (let i = 0; i < newImages.length; i++) {
        const currentId = newImages[i].id;
        
        // Update status to loading
        setGeneratedImages(prev => prev.map(img => 
            img.id === currentId ? { ...img, status: 'loading' } : img
        ));

        try {
            const refImagesData = selectedCharacters.map(c => ({
                data: c.imageData!,
                mimeType: c.mimeType
            }));

            const imageUrl = await generateCharacterImage({
                prompt: newImages[i].prompt,
                referenceImages: refImagesData,
                aspectRatio
            });

            // Update success
            setGeneratedImages(prev => prev.map(img => 
                img.id === currentId ? { ...img, status: 'success', imageUrl } : img
            ));
        } catch (error: any) {
            console.error(`Generation failed for prompt ${i}`, error);

            // Update error status
            setGeneratedImages(prev => prev.map(img => 
                img.id === currentId ? { ...img, status: 'error' } : img
            ));
            
            // Optionally break on auth errors to prevent spamming
            const errorMsg = error.message || JSON.stringify(error);
            if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
                setIsGenerating(false);
                alert("Authorization Error: Please check your API Key configuration.");
                return; 
            }
        }
    }

    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden font-sans">
      {/* Left Column: Control Panel */}
      <div className="w-[400px] flex flex-col border-r border-gray-800 bg-gray-900 flex-shrink-0 z-20 shadow-2xl">
        <div className="p-6 pb-2 border-b border-gray-800">
           <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center">
             <span className="text-red-600 mr-2 text-3xl">●</span> Studio Pandu
           </h1>
           <p className="text-gray-500 text-xs mt-1 tracking-wider uppercase">Consistent AI Character Creator</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <CharacterPanel characters={characters} setCharacters={setCharacters} />
          <PromptPanel 
            prompts={prompts} 
            setPrompts={setPrompts}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="flex-1 bg-gray-100 text-gray-900 overflow-hidden relative">
         {/* Top decorative bar */}
         <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-gray-400">GEMINI NANO BANANA POWERED</div>
         </div>
         
         <div className="p-8 h-[calc(100vh-64px)] overflow-hidden">
            <ResultsGrid images={generatedImages} isGenerating={isGenerating} />
         </div>
      </div>
    </div>
  );
};

export default App;