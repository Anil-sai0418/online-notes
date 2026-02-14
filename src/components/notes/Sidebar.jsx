import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Sun, Moon, X, ChevronLeft, } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = ({
  filteredNotes,
  activeNote,
  setActiveNote,
  addNote,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    const now = new Date();
    const noteDate = new Date(date);

    // Get the start of today and the note's day (midnight) for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDay = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

    // Calculate difference in days
    const diffTime = today - noteDay;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
      return noteDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7 && diffDays > 0) {
      // Within last week - show day name
      return noteDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      // Older - show date
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
        ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'}
        transition-transform
        duration-300
        ease-in-out
        z-30
        flex
        flex-col
      `}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 min-w-0">
            {isMobileSidebarOpen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`md:hidden p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className={`
                flex items-center justify-center
                h-10 px-6 rounded-full
                text-sm font-semibold tracking-wide
                transition-all duration-200
                ${darkMode
                  ? 'bg-transparent text-white border border-gray-700 hover:bg-gray-800/40'
                  : 'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              <span>SCRIBYX</span>

            </button>
          </div>

          {/* Right: Actions */}
          <div
            className={`
              flex items-center gap-1
              h-10 px-2 rounded-full
              ${darkMode
                ? 'bg-transparent border border-gray-700'
                : 'bg-transparent border border-gray-300'
              }
            `}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={addNote}
                  className={`
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    transition-colors duration-150
                    ${darkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Plus size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Note</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    transition-colors duration-150
                    ${darkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {/* Search Bar */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode
          ? 'bg-gray-800/50 border border-gray-800 focus-within:border-gray-700'
          : 'bg-gray-50 border border-gray-200 focus-within:border-gray-300'
          }`}>
          <Search size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search (⌘ + k)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
          />
        </div>
      </div>
      {/* Notes List */}
      <div
        className={`flex-1 overflow-y-auto rounded-2xl
          ${darkMode
            ? 'bg-[#111111] border border-gray-800'
            : 'bg-gray-50 border border-gray-200'
          }
        `}
      >
        {filteredNotes.length === 0 ? (
          <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="font-medium text-sm">
              No notes found for
            </p>
            {searchQuery && (
              <p
                className={`mt-1 text-sm font-semibold break-words ${darkMode ? 'text-white' : 'text-gray-800'
                  }`}
              >
                "{searchQuery}"
              </p>
            )}
            <p className="text-xs mt-2">
              Try a different keyword or create a new note.
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`
                  p-3 mb-1 cursor-pointer rounded-lg group relative
                  transition-all duration-150
                  ${activeNote === note.id
                    ? darkMode
                      ? 'bg-blue-600/10 border border-blue-600/20'
                      : 'bg-blue-50 border border-blue-100'
                    : darkMode
                      ? 'hover:bg-gray-800/50 border border-transparent'
                      : 'hover:bg-gray-50 border border-transparent'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {activeNote === note.id && (
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'
                          }`} />
                      )}
                      <h3 className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        {note.title}
                      </h3>
                    </div>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                      {note.content.substring(0, 50)}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                      {formatDate(note.timestamp)}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;