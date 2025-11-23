import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { downloadImage, generateFilename } from '../utils/fileUtils';

interface ResultsGridProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ images, isGenerating }) => {
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);

  const handleDownloadAll = () => {
    // Sequential download with delay to prevent browser blocking
    images.forEach((img, idx) => {
      if (img.imageUrl && img.status === 'success') {
        setTimeout(() => {
          downloadImage(img.imageUrl!, generateFilename(idx));
        }, idx * 500);
      }
    });
  };

  const hasResults = images.length > 0;
  const successCount = images.filter(i => i.status === 'success').length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Studio Results</h1>
           <p className="text-gray-500 text-sm mt-1">
             {isGenerating ? 'Generating your storyboards...' : `${successCount} images ready`}
           </p>
        </div>
        
        {successCount > 0 && (
          <button
            onClick={handleDownloadAll}
            className="flex items-center px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-lg shadow transition-colors font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Download All
          </button>
        )}
      </div>

      {!hasResults && (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           <p className="text-lg">No images generated yet.</p>
           <p className="text-sm mt-2">Configure your characters and prompts on the left to begin.</p>
        </div>
      )}

      {hasResults && (
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {images.map((img, index) => (
                <div key={img.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <div className="relative aspect-square bg-gray-200 group">
                    {img.status === 'loading' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs text-gray-500 font-medium animate-pulse">Rendering...</span>
                        </div>
                    )}
                    {img.status === 'error' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 z-10 p-4 text-center">
                            <div>
                                <p className="font-bold text-sm">Generation Failed</p>
                                <p className="text-xs mt-1">Please try again.</p>
                            </div>
                        </div>
                    )}
                    {img.status === 'pending' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 z-10">
                            <span className="text-xs uppercase tracking-wider font-semibold">Pending</span>
                        </div>
                    )}
                    
                    {img.imageUrl && (
                        <>
                            <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-2">
                                <button 
                                    onClick={() => setPreviewImage(img)}
                                    className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-50 transition-colors"
                                    title="Preview"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => downloadImage(img.imageUrl!, generateFilename(index))}
                                    className="p-2 bg-white rounded-full text-gray-900 hover:bg-green-50 transition-colors"
                                    title="Download"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="p-3 border-t border-gray-100 flex-1">
                    <div className="text-xs text-gray-400 font-mono mb-1">{generateFilename(index)}</div>
                    <p className="text-sm text-gray-700 line-clamp-2" title={img.prompt}>{img.prompt}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {previewImage && previewImage.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
           <div className="relative max-w-5xl w-full max-h-screen p-2" onClick={(e) => e.stopPropagation()}>
             <img src={previewImage.imageUrl} alt="Full view" className="max-w-full max-h-[85vh] mx-auto rounded shadow-2xl" />
             <div className="absolute top-4 right-4 flex space-x-2">
                 <button 
                    onClick={() => downloadImage(previewImage.imageUrl!, generateFilename(images.findIndex(i => i.id === previewImage.id)))}
                    className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200"
                 >
                     Download
                 </button>
                 <button 
                    onClick={() => setPreviewImage(null)}
                    className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-500"
                 >
                     Close
                 </button>
             </div>
             <div className="text-white text-center mt-4">
                 <p className="text-lg font-light">{previewImage.prompt}</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;
