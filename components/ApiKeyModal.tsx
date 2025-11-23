import React from 'react';
import { promptApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess }) => {
  const handleSelectKey = async () => {
    try {
      await promptApiKey();
      // Assume success if no error thrown, or user closes dialog. 
      // In a real env, we might poll, but here we trigger the parent to check.
      onSuccess();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">API Key Required</h2>
        <p className="text-gray-300 mb-8">
          To generate character storyboards, Studio Pandu requires a valid API key from Google AI Studio.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
        >
          Select API Key
        </button>
        
        <p className="mt-6 text-xs text-gray-500">
           Powered by Gemini 2.5 Flash. Works with standard API keys.<br/>
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-400 underline ml-1">
             Billing Information
           </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;