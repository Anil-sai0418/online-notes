import React from 'react';

const TextEditor = ({
  contentRef,
  currentNote,
  updateNoteContent,
  handleSelectionChange,
  handlePaste,
  darkMode,
  globalTextColor,
  globalFontSize,
  globalIsBold,
  globalIsItalic,
  globalIsUnderline
}) => (
  <textarea
    ref={contentRef}
    value={currentNote.content}
    onChange={(e) => updateNoteContent(e.target.value)}
    onSelect={handleSelectionChange}
    onPaste={handlePaste}
    placeholder="Start typing... "
    className={`w-full h-full resize-none outline-none px-4 py-3 rounded-xl transition-colors duration-200 leading-relaxed tracking-wide ${
      darkMode 
        ? 'bg-[#0f0f0f] text-gray-200 placeholder-gray-500 focus:bg-[#111111]' 
        : 'bg-[#fafafa] text-gray-800 placeholder-gray-400 focus:bg-white'
    }`}
    style={{
      color: globalTextColor,
      fontSize: `${globalFontSize}px`,
      fontWeight: globalIsBold ? 'bold' : 'normal',
      fontStyle: globalIsItalic ? 'italic' : 'normal',
      textDecoration: globalIsUnderline ? 'underline' : 'none',
      boxShadow: darkMode
        ? 'inset 0 0 0 1px rgba(255,255,255,0.05)'
        : 'inset 0 0 0 1px rgba(0,0,0,0.05)',
    }}
  />
);

export default TextEditor;
