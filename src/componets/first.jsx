import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import FormattingToolbar from './FormattingToolbar';
import ImagesGrid from './ImagesGrid';
import TextEditor from './TextEditor';
import { Plus, Trash2, Search, Sun, Moon, Maximize2, Minimize2, Bold, Italic, Underline, Type, X } from 'lucide-react';

// Toast animation handled via Tailwind utility classes

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
  const [toast, setToast] = useState({ visible: false, message: '' });
  const contentRef = useRef(null);
  const searchInputRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2500);
  }, []);

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
    if (notes.length === 1) {
      showToast('At least one note must remain');
      return;
    }

    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);

    if (activeNote === id) {
      setActiveNote(newNotes[0].id);
    }

    showToast('Note deleted successfully');
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

  // Add handler for font size changes
  const handleFontSizeChange = (increment) => {
    setGlobalFontSize(prev => {
      const newSize = prev + increment;
      return newSize >= 12 && newSize <= 72 ? newSize : prev;
    });
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      // Cmd / Ctrl + K → Focus search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Cmd / Ctrl + Enter → Create new note
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        addNote();
        showToast('New note created');
      }

      // Cmd / Ctrl + Delete → Delete current note
      if ((e.metaKey || e.ctrlKey) && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        if (currentNote) {
          deleteNote(currentNote.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [addNote, showToast, currentNote, deleteNote]);

  // Add function to handle home navigation
  const navigateHome = () => {
    setActiveNote(1);  // Set to first note
    setSearchQuery(''); // Clear search
    setIsMobileSidebarOpen(false); // Close mobile sidebar
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar
          notes={notes}
          filteredNotes={filteredNotes}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          addNote={addNote}
          deleteNote={deleteNote}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchInputRef={searchInputRef}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          navigateHome={navigateHome}
        />

        {/* Mobile overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {currentNote && (
            <>
              <FormattingToolbar
                currentNote={currentNote}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                globalIsBold={globalIsBold}
                setGlobalIsBold={setGlobalIsBold}
                globalIsItalic={globalIsItalic}
                setGlobalIsItalic={setGlobalIsItalic}
                globalIsUnderline={globalIsUnderline}
                setGlobalIsUnderline={setGlobalIsUnderline}
                globalFontSize={globalFontSize}
                handleFontSizeChange={handleFontSizeChange}
                globalTextColor={globalTextColor}
                setGlobalTextColor={setGlobalTextColor}
                darkMode={darkMode}
              />

              <div className="flex-1 overflow-y-auto">
                <div className="w-full h-full p-4">
                  <ImagesGrid
                    currentNote={currentNote}
                    notes={notes}
                    setNotes={setNotes}
                    activeNote={activeNote}
                  />
                  <TextEditor
                    contentRef={contentRef}
                    currentNote={currentNote}
                    updateNoteContent={updateNoteContent}
                    handleSelectionChange={handleSelectionChange}
                    handlePaste={handlePaste}
                    darkMode={darkMode}
                    globalTextColor={globalTextColor}
                    globalFontSize={globalFontSize}
                    globalIsBold={globalIsBold}
                    globalIsItalic={globalIsItalic}
                    globalIsUnderline={globalIsUnderline}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      {toast.visible && (
        <div className="fixed top-20 right-6 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium
            animate-slide-in
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleNotes;