import React, { useState } from 'react';
import { Bold, Italic, Underline, Type, Menu, Lock, Moon, Search, Settings } from 'lucide-react';

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
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value) {
      window.find(value);
    }
  };

  return (
  <div className={`relative flex flex-col border-b w-full ${
    darkMode ? 'border-gray-800 bg-[#1a1a1a]' : 'border-gray-100 bg-white'
  }`}>
    {/* Top Row - Title and Menu */}
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between px-3 py-2 gap-2`}>
      {/* Left Section - Title */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Menu size={20} />
        </button>
        <div className="grid grid-cols-[1fr_auto] items-start w-full gap-3">
          {/* Heading */}
          <div className="min-w-0">
            {/* Note Title */}
            <div className="flex flex-col leading-tight">
              <h2
                className={`text-[17px] md:text-lg font-semibold line-clamp-1 break-all ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {currentNote.title}
              </h2>

              {/* Sub status */}
              <span
                className={`text-xs font-medium tracking-wide ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Last edited just now
              </span>
            </div>
          </div>
          {/* Action Icons - Mobile placement */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            <div
              className={`flex items-center gap-1 p-1.5 rounded-2xl shadow-sm ${
                darkMode ? 'bg-[#111111]' : 'bg-gray-100'
              }`}
            >
              <button
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-white text-gray-700'
                }`}
                title="Lock Note"
              >
                <Lock size={18} />
              </button>

              <button
                onClick={() => setIsSearchOpen(prev => !prev)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-white text-gray-700'
                }`}
                title="Search in Note"
              >
                <Search size={18} />
              </button>

              <button
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-white text-gray-700'
                }`}
                title="Settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>


    <div
      className={`flex items-center justify-start md:justify-center gap-2 px-3 py-2 border-t flex-nowrap rounded-2xl mx-2 mb-2 overflow-x-auto shadow-sm ${
        darkMode ? 'bg-[#111111] border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* Text Formatting Group */}
      <div className={`flex items-center gap-1 p-1.5 rounded-xl shrink-0 shadow-inner ${
        darkMode ? 'bg-gray-800/60' : 'bg-white'
      }`}>
        <button
          onClick={() => setGlobalIsBold(!globalIsBold)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${
            globalIsBold
              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => setGlobalIsItalic(!globalIsItalic)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${
            globalIsItalic
              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => setGlobalIsUnderline(!globalIsUnderline)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${
            globalIsUnderline
              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="Underline"
        >
          <Underline size={16} />
        </button>
      </div>

      {/* Font Size Control */}
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl shrink-0 shadow-inner ${
        darkMode ? 'bg-gray-800/60' : 'bg-white'
      }`}>
        <button
          onClick={() => handleFontSizeChange(-1)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all active:scale-95 ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          −
        </button>

        <span className={`w-10 h-8 flex items-center justify-center text-sm font-medium rounded-md ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {globalFontSize}
        </span>

        <button
          onClick={() => handleFontSizeChange(1)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all active:scale-95 ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          +
        </button>
      </div>

      {/* Color Picker */}
      <div className="relative shrink-0">
        <input
          type="color"
          value={globalTextColor}
          onChange={(e) => setGlobalTextColor(e.target.value)}
          className="w-8 h-8 absolute inset-0 opacity-0 cursor-pointer"
          title="Text Color"
        />
        <div
          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor: globalTextColor }}
        />
      </div>
    </div>
    {isSearchOpen && (
      <div className={`absolute right-4 top-full mt-2 z-50 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border ${
        darkMode
          ? 'bg-[#111111] border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search in note..."
          className={`w-48 text-sm outline-none bg-transparent ${
            darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
          }`}
        />
        <button
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          className={`text-xs px-2 py-1 rounded-md ${
            darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          ✕
        </button>
      </div>
    )}
    {/* Action Icons - Desktop (after toolbar) */}
    <div className="hidden md:flex justify-end px-3 pb-2">
      <div
        className={`flex items-center gap-1 p-1.5 rounded-2xl shadow-sm ${
          darkMode ? 'bg-[#111111]' : 'bg-gray-100'
        }`}
      >
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
            darkMode
              ? 'hover:bg-gray-800 text-gray-300'
              : 'hover:bg-white text-gray-700'
          }`}
          title="Lock Note"
        >
          <Lock size={18} />
        </button>

        <button
          onClick={() => setIsSearchOpen(prev => !prev)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
            darkMode
              ? 'hover:bg-gray-800 text-gray-300'
              : 'hover:bg-white text-gray-700'
          }`}
          title="Search in Note"
        >
          <Search size={18} />
        </button>

        <button
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
            darkMode
              ? 'hover:bg-gray-800 text-gray-300'
              : 'hover:bg-white text-gray-700'
          }`}
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
    </div>

    {/* Bottom Row - Formatting Tools (All in Single Div) */}
  </div>
  );
};

export default FormattingToolbar;