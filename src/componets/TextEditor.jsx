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
    placeholder="Start typing... (Paste images with Ctrl+V)"
    className={`w-full h-full resize-none outline-none ${
      darkMode ? 'bg-gray-800 placeholder-gray-500' : 'bg-white placeholder-gray-400'
    }`}
    style={{
      color: globalTextColor,
      fontSize: `${globalFontSize}px`,
      fontWeight: globalIsBold ? 'bold' : 'normal',
      fontStyle: globalIsItalic ? 'italic' : 'normal',
      textDecoration: globalIsUnderline ? 'underline' : 'none',
    }}
  />
);

export default TextEditor;
