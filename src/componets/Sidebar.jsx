import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Search, Sun, Moon, X } from 'lucide-react';

const Sidebar = ({
  notes,
  filteredNotes,
  activeNote,
  setActiveNote,
  addNote,
  deleteNote,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  navigateHome
}) => {
  const navigate = useNavigate();
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
      <button
        onClick={() => setIsMobileSidebarOpen(false)}
        className="md:hidden absolute right-2 top-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X size={20} />
      </button>
      <div className="p-4 pt-12 md:pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1
            onClick={() => navigate('/')}
            className="text-xl font-bold cursor-pointer hover:opacity-80"
          >
            Notes
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative group">
              <button
                onClick={addNote}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Plus size={20} />
              </button>

              <div
                className="absolute top-full mt-2 right-0
                whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium
                bg-gray-900 text-white opacity-0 scale-95
                group-hover:opacity-100 group-hover:scale-100
                transition-all duration-150 z-50"
              >
                New Note ⌘ + Enter
              </div>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-white border border-gray-300'
        }`}>
          <Search size={16} className="text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>
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
                <div className="relative group/delete">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>

                  <div
                    className="absolute top-full mt-2 right-0
                    whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium
                    bg-gray-900 text-white opacity-0 scale-95
                    group-hover/delete:opacity-100 group-hover/delete:scale-100
                    transition-all duration-150 z-50"
                  >
                    Delete ⌘ + Delete
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
