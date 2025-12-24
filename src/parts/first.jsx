import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import FormattingToolbar from './FormattingToolbar';
import ImagesGrid from './ImagesGrid';
import TextEditor from './TextEditor';
import { Lock, Unlock, ShieldOff, X } from 'lucide-react';

const AppleNotes = () => {
  // Add cursor position state
  const [cursorPosition, setCursorPosition] = useState(0);
  // Update note state structure
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: 'Welcome to Notes', 
      content: 'Start typing to create your first note...', 
      images: [],
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

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      images: [],
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

  const updateNoteContent = (content) => {
    setNotes(notes.map(n => 
      n.id === activeNote 
        ? { 
            ...n, 
            content, 
            title: content.split('\n')[0].substring(0, 30) || 'New Note',
            timestamp: new Date(),
            images: n.images || []
          } 
        : n
    ));
  };

  const handleSelectionChange = () => {
    if (contentRef.current) {
      setCursorPosition(contentRef.current.selectionStart);
    }
  };

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

  useEffect(() => {
    setGlobalTextColor(darkMode ? '#ffffff' : '#000000');
  }, [darkMode]);

  const handleFontSizeChange = (increment) => {
    setGlobalFontSize(prev => {
      const newSize = prev + increment;
      return newSize >= 12 && newSize <= 72 ? newSize : prev;
    });
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        addNote();
        showToast('New note created');
      }

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

  const navigateHome = () => {
    setActiveNote(1);
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  };

  const simpleEncrypt = (text, password) => {
    return btoa(unescape(encodeURIComponent(text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ password.charCodeAt(i % password.length))).join(''))));
  };
  
  const simpleDecrypt = (data, password) => {
    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      return decoded.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ password.charCodeAt(i % password.length))).join('');
    } catch {
      return '';
    }
  };

  const [passwordPrompt, setPasswordPrompt] = useState({ open: false, noteId: null });
  const [passwordInput, setPasswordInput] = useState('');
  const [setPasswordMode, setSetPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [lastPassword, setLastPassword] = useState('');

  const handleSetPassword = (noteId) => {
    setPasswordPrompt({ open: true, noteId });
    setSetPasswordMode(true);
    setNewPassword('');
  };

  const handleUnlockNote = (noteId) => {
    setPasswordPrompt({ open: true, noteId });
    setSetPasswordMode(false);
    setPasswordInput('');
  };

  const handleLockNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note && lastPassword && note.content) {
      setNotes(notes.map(n => n.id === noteId ? {
        ...n,
        encryptedContent: simpleEncrypt(n.content, lastPassword),
        content: '',
        passwordProtected: true
      } : n));
      showToast('Note locked successfully');
    } else {
      showToast('Cannot lock: password missing');
    }
  };

  const handlePasswordSubmit = () => {
    if (setPasswordMode) {
      if (!newPassword || newPassword.length < 4) {
        showToast('Password must be at least 4 characters');
        return;
      }
      setNotes(notes.map(n => n.id === passwordPrompt.noteId ? {
        ...n,
        encryptedContent: simpleEncrypt(n.content, newPassword),
        content: '',
        passwordProtected: true
      } : n));
      setLastPassword(newPassword);
      setPasswordPrompt({ open: false, noteId: null });
      showToast('Password set successfully');
    } else {
      const note = notes.find(n => n.id === passwordPrompt.noteId);
      const decrypted = note && note.encryptedContent ? simpleDecrypt(note.encryptedContent, passwordInput) : '';
      if (note && note.encryptedContent && decrypted && decrypted.length > 0) {
        setNotes(notes.map(n => n.id === passwordPrompt.noteId ? {
          ...n,
          content: decrypted,
          encryptedContent: '',
          passwordProtected: false
        } : n));
        setLastPassword(passwordInput);
        setPasswordPrompt({ open: false, noteId: null });
        showToast('Note unlocked successfully');
      } else {
        showToast('Incorrect password');
      }
    }
  };

  const handleRemovePassword = (noteId) => {
    setNotes(notes.map(n => n.id === noteId ? { 
      ...n, 
      passwordProtected: false, 
      encryptedContent: '', 
      content: n.content 
    } : n));
    showToast('Password removed');
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-50 text-gray-900'}`}>
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
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Editor Area */}
        <main className={`flex-1 flex flex-col min-w-0 ${
          darkMode ? 'bg-[#1a1a1a]' : 'bg-white'
        }`}>
          {currentNote && (
            <>
              {currentNote.passwordProtected ? (
                <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
                  <div className={`rounded-2xl shadow-xl border flex flex-col items-center px-6 py-10 sm:px-10 sm:py-12 w-full max-w-sm ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-700 backdrop-blur-lg' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <Lock size={40} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Note Locked
                    </h2>
                    <p className={`text-center mb-8 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      This note is password protected. Enter your password to view its contents.
                    </p>
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                      onClick={() => handleUnlockNote(currentNote.id)}
                    >
                      <Unlock size={18} />
                      Unlock Note
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Password Controls */}
                  <div className={`flex items-center gap-2 px-4 py-3 border-b ${
                    darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
                  }`}>
                    <button 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSetPassword(currentNote.id)}
                    >
                      <Lock size={14} />
                      Set Password
                    </button>
                    {currentNote.encryptedContent && (
                      <button 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          darkMode 
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400' 
                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                        }`}
                        onClick={() => handleRemovePassword(currentNote.id)}
                      >
                        <ShieldOff size={14} />
                        Remove Password
                      </button>
                    )}
                    {lastPassword && (
                      <button 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        onClick={() => handleLockNote(currentNote.id)}
                      >
                        <Lock size={14} />
                        Lock Note
                      </button>
                    )}
                  </div>

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
                    contentRef={contentRef}
                  />

                  <div className="flex-1 overflow-y-auto">
                    <div className="w-full h-full p-6 max-w-4xl mx-auto">
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
            </>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed z-50 animate-slide-in bottom-6 left-1/2 -translate-x-1/2 md:top-40 md:left-auto md:right-6 md:bottom-auto md:translate-x-0">
          <div className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passwordPrompt.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div
            className={`relative w-full max-w-md rounded-3xl shadow-2xl border transition-all duration-300 scale-100 animate-fade-in ${
              darkMode
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Close Button */}
            <button
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              onClick={() => setPasswordPrompt({ open: false, noteId: null })}
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mt-8">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <Lock size={28} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-6">
              <h2
                className={`text-2xl font-semibold text-center mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {setPasswordMode ? 'Set Password' : 'Unlock Note'}
              </h2>

              <p
                className={`text-center text-sm mb-6 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {setPasswordMode
                  ? 'Create a password to protect this note'
                  : 'Enter your password to unlock this note'}
              </p>

              {/* Input */}
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-xl border text-center font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                value={setPasswordMode ? newPassword : passwordInput}
                onChange={(e) =>
                  setPasswordMode
                    ? setNewPassword(e.target.value)
                    : setPasswordInput(e.target.value)
                }
                placeholder={setPasswordMode ? 'Enter password (min 4 chars)' : 'Enter password'}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />

              {/* Action Button */}
              <button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-150"
                onClick={handlePasswordSubmit}
              >
                {setPasswordMode ? 'Set Password' : 'Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleNotes;