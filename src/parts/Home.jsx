

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        navigate('/online-notes');
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-800">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">📝 Notes App</h1>
      <p className="text-lg text-gray-600 mb-8 text-center w-2/3">
        Capture your thoughts, ideas, and reminders instantly. All your notes are safely stored in your browser using localStorage — no login required!
      </p>
   
      <div className="relative group">
       
        <button
          onClick={() => navigate('/online-notes')}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          Go to Notes
        </button>
        <div className="group relative">
  {/* Your trigger element goes here, e.g., <button>Invite</button> */}
  
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 invisible group-hover:visible transition-all duration-300 ease-out z-10 max-w-xs">
    <div className="flex items-center justify-center gap-1">
      <span>Press</span>
      <span className="font-semibold text-blue-400">Enter</span>
      <span className="text-blue-400">⏎</span>
     
   
      
    </div>

    {/* Tail pointing upwards */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-900 rotate-180"></div>
  </div>
</div>
      </div>

    </div>
  );
}

export default Home;