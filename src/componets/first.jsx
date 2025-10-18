import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, Sun, Moon, Maximize2, Minimize2, Bold, Italic, Underline, Type } from 'lucide-react';

const AppleNotes = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Welcome to Notes', content: 'Start typing to create your first note...', timestamp: new Date() }
  ]);
  const [activeNote, setActiveNote] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [globalFontSize, setGlobalFontSize] = useState(16);
  const [globalIsBold, setGlobalIsBold] = useState(false);
  const [globalIsItalic, setGlobalIsItalic] = useState(false);
  const [globalIsUnderline, setGlobalIsUnderline] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const currentNote = notes.find(n => n.id === activeNote);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      timestamp: new Date()
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const deleteNote = (id) => {
    if (notes.length === 1) return;
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNote === id) {
      setActiveNote(newNotes[0].id);
    }
  };

  const updateNoteContent = (content) => {
    setNotes(notes.map(n => 
      n.id === activeNote 
        ? { 
            ...n, 
            content, 
            title: content.split('\n')[0].substring(0, 30) || 'New Note',
            timestamp: new Date()
          } 
        : n
    ));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffTime = Math.abs(now - noteDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return noteDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return noteDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Top Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
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
          
          <div className="flex items-center gap-2">
            <Type size={18} />
            <input
              type="number"
              min="12"
              max="72"
              value={globalFontSize}
              onChange={(e) => setGlobalFontSize(Number(e.target.value))}
              className={`w-16 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          
          <input
            type="color"
            value={globalTextColor}
            onChange={(e) => setGlobalTextColor(e.target.value)}
            className="w-10 h-8 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isFullscreen && (
          <>
            <div 
              className={`flex flex-col border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
              style={{ width: `${sidebarWidth}px` }}
            >
              {/* Sidebar Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Notes</h1>
                  <button
                    onClick={addNote}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-300'}`}>
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="font-medium">No notes found</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => setActiveNote(note.id)}
                      className={`p-4 cursor-pointer border-b group relative ${
                        activeNote === note.id
                          ? darkMode ? 'bg-gray-700' : 'bg-blue-50'
                          : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      } ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{note.title}</h3>
                          <p className={`text-sm mt-1 truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDate(note.timestamp)} {note.content.substring(0, 50)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className={`w-1 cursor-col-resize hover:bg-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            />
          </>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentNote && (
            <>
              <div className={`flex items-center justify-end px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <textarea
                  ref={contentRef}
                  value={currentNote.content}
                  onChange={(e) => updateNoteContent(e.target.value)}
                  placeholder="Start typing..."
                  className={`w-full h-full p-8 resize-none outline-none ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                  style={{
                    color: globalTextColor,
                    fontSize: `${globalFontSize}px`,
                    fontWeight: globalIsBold ? 'bold' : 'normal',
                    fontStyle: globalIsItalic ? 'italic' : 'normal',
                    textDecoration: globalIsUnderline ? 'underline' : 'none'
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppleNotes;