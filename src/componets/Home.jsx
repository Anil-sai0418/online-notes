

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-800">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">📝 Notes App</h1>
      <p className="text-lg text-gray-600 mb-8 text-center w-2/3">
        Capture your thoughts, ideas, and reminders instantly. All your notes are safely stored in your browser using localStorage — no login required!
      </p>
      <button
        onClick={() => navigate('/online-notes/FullScreen')}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all"
      >
        Go to Notes
      </button>
    </div>
  );
}

export default Home;