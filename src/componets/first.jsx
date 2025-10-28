import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import FormattingToolbar from './FormattingToolbar';
import ImagesGrid from './ImagesGrid';
import TextEditor from './TextEditor';
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
  const searchInputRef = useRef(null);

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

  // Add helper function to convert table content to list
  const convertTableToList = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('tr');
    let result = '';

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach(cell => {
        if (cell.textContent.trim()) {
          result += `• ${cell.textContent.trim()}\n`;
        }
      });
    });

    return result;
  };

  // Replace existing handlePaste function
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    let hasHandledItem = false;

    for (let item of items) {
      // Handle images
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        hasHandledItem = true;
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
      // Handle HTML content (tables)
      else if (item.type === 'text/html') {
        e.preventDefault();
        hasHandledItem = true;
        
        item.getAsString(html => {
          if (html.includes('<table') || html.includes('<tr')) {
            const listContent = convertTableToList(html);
            const currentContent = contentRef.current.value;
            const newContent = currentContent.slice(0, cursorPosition) + 
                             listContent + 
                             currentContent.slice(cursorPosition);
            
            updateNoteContent(newContent);
          }
        });
      }
    }

    // If no special content was handled, let the default paste behavior occur
    if (!hasHandledItem) {
      const text = e.clipboardData.getData('text/plain');
      const currentContent = contentRef.current.value;
      const newContent = currentContent.slice(0, cursorPosition) + 
                        text + 
                        currentContent.slice(cursorPosition);
      
      updateNoteContent(newContent);
      e.preventDefault();
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

  // Add keyboard shortcut effect
  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

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
    </div>
  );
};

export default AppleNotes;