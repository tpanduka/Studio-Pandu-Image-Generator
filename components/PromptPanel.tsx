import React from 'react';
import { UiAspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface PromptPanelProps {
  prompts: string[];
  setPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  aspectRatio: UiAspectRatio;
  setAspectRatio: React.Dispatch<React.SetStateAction<UiAspectRatio>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptPanel: React.FC<PromptPanelProps> = ({ 
  prompts, 
  setPrompts, 
  aspectRatio, 
  setAspectRatio,
  onGenerate,
  isGenerating
}) => {

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const addPrompt = () => {
    if (prompts.length < 20) {
      setPrompts([...prompts, '']);
    }
  };

  const removePrompt = (index: number) => {
    const newPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(newPrompts.length ? newPrompts : ['']);
  };

  return (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div>
        <h2 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">
          2. Aspect Ratio
        </h2>
        <select 
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as UiAspectRatio)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ASPECT_RATIOS.map(ratio => (
            <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
          ))}
        </select>
        {aspectRatio === 'Custom' && (
          <p className="text-xs text-yellow-500 mt-2">
            Note: Custom ratios are approximated to 1:1 for AI generation in this version.
          </p>
        )}
      </div>

      {/* Prompts */}
      <div className="flex-1 flex flex-col min-h-0">
         <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-xl font-bold text-gray-100">3. Prompts</h2>
            <span className="text-xs text-gray-400">{prompts.length}/20</span>
         </div>
         
         <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
           {prompts.map((prompt, index) => (
             <div key={index} className="flex gap-2">
               <span className="text-gray-500 text-sm py-2 w-6 text-right font-mono">{index + 1}.</span>
               <textarea
                 value={prompt}
                 onChange={(e) => handlePromptChange(index, e.target.value)}
                 placeholder={`Describe scene ${index + 1}...`}
                 rows={2}
                 className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none resize-none"
               />
               {prompts.length > 1 && (
                 <button 
                  onClick={() => removePrompt(index)}
                  className="text-gray-500 hover:text-red-400 p-1 self-start"
                 >
                   &times;
                 </button>
               )}
             </div>
           ))}
         </div>
         
         <button 
           onClick={addPrompt}
           disabled={prompts.length >= 20}
           className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center font-medium disabled:opacity-50"
         >
           <span className="text-lg mr-1">+</span> Add Prompt
         </button>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-700 sticky bottom-0 bg-gray-900 pb-2 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg tracking-wide transition-all
            ${isGenerating 
              ? 'bg-gray-700 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transform hover:scale-[1.02]'}
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Stories...
            </span>
          ) : 'GENERATE ALL IMAGES'}
        </button>
      </div>
    </div>
  );
};

export default PromptPanel;
