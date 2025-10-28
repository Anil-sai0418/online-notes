import React from 'react';
import { X } from 'lucide-react';

const ImagesGrid = ({ currentNote, notes, setNotes, activeNote }) => (
  <>
    {currentNote.images && currentNote.images.length > 0 && (
      <div className="flex flex-wrap gap-4 mb-4">
        {currentNote.images.map((imgUrl, index) => (
          <div key={index} className="relative group">
            <div className="w-48 h-48 relative">
              <img
                src={imgUrl}
                alt={`Note image ${index + 1}`}
                className="w-full h-full object-contain rounded-lg shadow-md"
              />
              <button
                onClick={() => {
                  URL.revokeObjectURL(imgUrl);
                  const updatedImages = [...currentNote.images];
                  updatedImages.splice(index, 1);
                  setNotes(notes.map(n =>
                    n.id === activeNote
                      ? { ...n, images: updatedImages }
                      : n
                  ));
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
);

export default ImagesGrid;
