import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, Sun, Moon, Maximize2, Minimize2, Bold, Italic, Underline, Type, X } from 'lucide-react';

const AppleNotes = () => {
  // Add cursor position state
  const [cursorPosition, setCursorPosition] = useState(0);
  // Update note state structure
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: 'Welcome to Notes', 
      content: 'Start typing to create your first note...', 
      images: [],  // Initialize empty array
      timestamp: new Date() 
    }
  ]);
  const [activeNote, setActiveNote] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalTextColor, setGlobalTextColor] = useState(darkMode ? '#ffffff' : '#000000');
  const [globalFontSize, setGlobalFontSize] = useState(16);
  const [globalIsBold, setGlobalIsBold] = useState(false);
  const [globalIsItalic, setGlobalIsItalic] = useState(false);
  const [globalIsUnderline, setGlobalIsUnderline] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

  // Update addNote function to include images array
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      images: [], // Initialize empty array for new notes
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

  // Fix updateNoteContent to preserve images
  const updateNoteContent = (content) => {
    setNotes(notes.map(n => 
      n.id === activeNote 
        ? { 
            ...n, 
            content, 
            title: content.split('\n')[0].substring(0, 30) || 'New Note',
            timestamp: new Date(),
            images: n.images || [] // Preserve existing images
          } 
        : n
    ));
  };

  // Add handler to track cursor position
  const handleSelectionChange = () => {
    if (contentRef.current) {
      setCursorPosition(contentRef.current.selectionStart);
    }
  };

  // Replace handlePaste function
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        
        try {
          const imgUrl = URL.createObjectURL(file);
          setNotes(notes.map(n => 
            n.id === activeNote 
              ? {
                  ...n,
                  images: [...(n.images || []), imgUrl]
                }
              : n
          ));
        } catch (error) {
          console.error('Error handling pasted image:', error);
        }
      }
    }
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

  // Add effect to update text color when dark mode changes
  useEffect(() => {
    setGlobalTextColor(darkMode ? '#ffffff' : '#000000');
  }, [darkMode]);

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar with updated background and close button */}
        <aside 
          className={`
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            absolute md:relative
            w-72 md:w-[280px]
            h-full
            ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}
            border-r
            transition-transform
            duration-300
            ease-in-out
            z-30
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
          `}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden absolute right-2 top-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>

          {/* Sidebar Header with adjusted padding for close button */}
          <div className="p-4 pt-12 md:pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Notes</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={addNote}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-white border border-gray-300'
            }`}>
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="h-[calc(100vh-180px)] overflow-y-auto">
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
        </aside>

        {/* Mobile overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Editor Area with reorganized tools */}
        <main className="flex-1 flex flex-col min-w-0">
          {currentNote && (
            <>
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b gap-3 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {/* Title and hamburger section */}
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
                
                {/* Reorganized formatting controls */}
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
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="w-full h-full p-4">
                  {/* Images Grid */}
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
                                URL.revokeObjectURL(imgUrl); // Clean up the URL
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

                  {/* Text Editor */}
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
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppleNotes;