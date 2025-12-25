import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Updated CSS for a more technical, geometric feel
const animationStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  /* Subtle grid movement */
  @keyframes grid-move {
    0% { background-position: 0% 0%; }
    100% { background-position: 40px 40px; }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; animation-delay: 1s; }

  /* Technical Grid Background */
  .tech-grid {
    background-image: 
      linear-gradient(to right, rgba(37, 99, 235, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(37, 99, 235, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(1000px) rotateX(60deg) scale(2);
    transform-origin: top center;
    animation: grid-move 10s linear infinite;
  }
  
  /* Glowing geometric squares */
  .geo-accent {
    position: absolute;
    border: 2px solid rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(59, 130, 246, 0.1);
    backdrop-filter: blur(2px);
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-float-delayed {
      animation: none !important;
    }
  }
`;

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
    // Changed background gradient to a cooler, sharper blue/gray tone
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 text-gray-900 overflow-hidden relative">
      <style>{animationStyles}</style>
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-16 py-4 sm:py-6 relative z-20">
        <div className="flex items-center gap-3">
         
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-900/20">
            S
          </div>
          <span className="text-xl font-semibold tracking-wide text-gray-900">
            SCRIBYX
          </span>
        </div>

      

      
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between
px-4 sm:px-6 md:px-16
py-10 sm:py-12 md:py-20
gap-12 md:gap-16
relative z-20">
        
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            <span className="w-2 h-2 bg-blue-600 rounded animate-pulse"></span>
            BELIEVE · Notes
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-gray-900">
            Believe Notes<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
              Think. Write. Execute.
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            A focused notes workspace to capture ideas, organize thoughts,
            and move forward without distraction.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/online-notes')}
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-md shadow-blue-700/30 hover:shadow-blue-700/50 transition-all transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get Started
            </button>

           
          </div>

          <p className="text-xs text-gray-400 mt-8 font-mono tracking-wide tracking-wider hidden sm:block">
             &gt; Press [ENTER] to open notes
          </p>
        </div>

        {/* Right Animation (Tech/Masculine Floating UI) */}
        <div className="relative w-full max-w-lg h-[450px] hidden md:flex items-center justify-center perspective-container">
          
          {/* --- TECH BACKGROUND ELEMENTS --- */}
          {/* Isometric Grid Floor */}
          <div className="absolute inset-0 pointer-events-none tech-grid opacity-50 mask-image-gradient"></div>
          
          {/* Floating Geometric Accents instead of blobs */}
          <div className="geo-accent w-32 h-32 top-10 -right-10 rotate-12 animate-float-delayed opacity-60"></div>
          <div className="geo-accent w-24 h-24 bottom-10 -left-10 -rotate-12 animate-float opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>


          {/* --- Main Glassmorphism Card --- */}
          <div className="relative w-full md:w-[420px] bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl p-6 animate-float z-30">
            {/* Card Header (More technical look) */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span title="Close" className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition"></span>
                <span title="Minimize" className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110 transition"></span>
                <span title="Zoom" className="w-3 h-3 rounded-full bg-green-500 hover:brightness-110 transition"></span>
              </div>
              <div className="text-xs font-mono text-blue-700 font-semibold">
                NOTE: DAILY_THOUGHTS
              </div>
            </div>

            {/* Card Content Skeleton (More structured) */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                 <div className="h-5 bg-gray-800/10 rounded-sm w-1/3"></div>
                 <div className="h-3 bg-blue-100 text-blue-800 px-2 rounded-sm text-xs font-mono">STATUS: ACTIVE</div>
              </div>
              <div className="h-3 bg-gray-200 rounded-sm w-full"></div>
              <div className="h-3 bg-gray-200 rounded-sm w-5/6"></div>
              
              {/* A code-snippet style block */}
              <div className="mt-4 bg-gray-900 rounded-md p-4 font-mono text-xs text-green-400 shadow-inner">
                <p>• Morning thoughts</p>
                <p className="ml-4">- Goals for today</p>
                <p className="ml-4">- Tasks to complete</p>
                <p className="ml-4 text-gray-500">// Stay consistent</p>
              </div>
            </div>

            {/* Floating Badge 1 (Sharper, Square) */}
            <div className="absolute -right-8 top-16 bg-white/90 backdrop-blur-md border border-gray-200 p-2 rounded-lg shadow-xl animate-float-delayed z-40">
              <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2 rounded-sm shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>

            {/* Floating Badge 2 (Sharper, Square) */}
            <div className="absolute -left-8 bottom-16 bg-white/90 backdrop-blur-md border border-gray-200 p-2 rounded-lg shadow-xl animate-float z-40" style={{ animationDelay: '1.5s' }}>
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-sm shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </main>

    
      
      {/* Subtle background gradient mask so the grid fades out */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10 pointer-events-none"></div>
    </div>
  );
}

export default Home;