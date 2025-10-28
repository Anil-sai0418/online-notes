import React from 'react';
import { Bold, Italic, Underline, Type } from 'lucide-react';

const FormattingToolbar = ({
  currentNote,
  setIsMobileSidebarOpen,
  globalIsBold,
  setGlobalIsBold,
  globalIsItalic,
  setGlobalIsItalic,
  globalIsUnderline,
  setGlobalIsUnderline,
  globalFontSize,
  handleFontSizeChange,
  globalTextColor,
  setGlobalTextColor,
  darkMode
}) => (
  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b gap-3 ${
    darkMode ? 'border-gray-700' : 'border-gray-200'
  }`}>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h2 className="text-lg font-semibold truncate">{currentNote.title}</h2>
    </div>
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setGlobalIsBold(!globalIsBold)}
          className={`p-2 rounded ${globalIsBold ? 'bg-blue-500 text-white' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => setGlobalIsItalic(!globalIsItalic)}
          className={`p-2 rounded ${globalIsItalic ? 'bg-blue-500 text-white' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => setGlobalIsUnderline(!globalIsUnderline)}
          className={`p-2 rounded ${globalIsUnderline ? 'bg-blue-500 text-white' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <Underline size={18} />
        </button>
      </div>
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <div className="flex items-center gap-2">
          <Type size={18} />
          <div className="flex items-center">
            <button
              onClick={() => handleFontSizeChange(-1)}
              className={`px-2 py-1 rounded-l border ${
                darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              -
            </button>
            <span className={`px-3 py-1 border-t border-b ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              {globalFontSize}
            </span>
            <button
              onClick={() => handleFontSizeChange(1)}
              className={`px-2 py-1 rounded-r border ${
                darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              +
            </button>
          </div>
        </div>
        <input
          type="color"
          value={globalTextColor}
          onChange={(e) => setGlobalTextColor(e.target.value)}
          className="w-10 h-8 rounded cursor-pointer"
        />
      </div>
    </div>
  </div>
);

export default FormattingToolbar;
