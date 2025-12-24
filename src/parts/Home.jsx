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
      <header className="flex items-center justify-between px-6 md:px-16 py-6 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
            S
          </div>
          <span className="text-2xl font-bold tracking-wide text-gray-800">SCRIBYX</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <span className="hover:text-blue-700 cursor-pointer transition-colors">Features</span>
          <span className="hover:text-blue-700 cursor-pointer transition-colors">About</span>
          <span className="hover:text-blue-700 cursor-pointer transition-colors">Pricing</span>
        </nav>

        <button
          onClick={() => navigate('/online-notes')}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium shadow-md hover:shadow-lg transition-all"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12 md:py-20 gap-16 relative z-20">
        
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded">
            <span className="w-2 h-2 bg-blue-600 rounded animate-pulse"></span>
            System v2.0 Live
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-gray-900">
            Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
              rapid ideation.
            </span>
          </h1>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            SCRIBYX is a high-performance workspace designed to capture data, structure thoughts, and execute ideas without friction.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/online-notes')}
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all transform hover:-translate-y-0.5"
            >
              Initialize Workspace
            </button>

            <button className="px-8 py-4 border-2 border-gray-200 bg-white hover:border-blue-700 hover:text-blue-700 rounded-lg font-bold text-gray-700 transition-all">
              Documentation
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6 font-mono">
             &gt; Press [ENTER] to execute
          </p>
        </div>

        {/* Right Animation (Tech/Masculine Floating UI) */}
        <div className="relative w-full max-w-lg h-[450px] flex items-center justify-center perspective-container">
          
          {/* --- TECH BACKGROUND ELEMENTS --- */}
          {/* Isometric Grid Floor */}
          <div className="absolute inset-0 pointer-events-none tech-grid opacity-50 mask-image-gradient"></div>
          
          {/* Floating Geometric Accents instead of blobs */}
          <div className="geo-accent w-32 h-32 top-10 -right-10 rotate-12 animate-float-delayed opacity-60"></div>
          <div className="geo-accent w-24 h-24 bottom-10 -left-10 -rotate-12 animate-float opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>


          {/* --- Main Glassmorphism Card --- */}
          <div className="relative w-full md:w-[420px] bg-white/70 backdrop-blur-md rounded-lg border border-white/40 shadow-2xl p-6 animate-float z-30">
            {/* Card Header (More technical look) */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
              </div>
              <div className="text-xs font-mono text-blue-700 font-semibold">ID: PROJ_SYNC_MD</div>
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
                <p><span className="text-blue-400">function</span> <span className="text-yellow-400">executeIdea</span>() {'{'}</p>
                <p className="ml-4">capture.thoughts();</p>
                <p className="ml-4">organize.structure();</p>
                <p className="ml-4 text-gray-500">// Deploy success</p>
                <p>{'}'}</p>
              </div>
            </div>

            {/* Floating Badge 1 (Sharper, Square) */}
            <div className="absolute -right-8 top-16 bg-white border border-gray-100 p-2 rounded shadow-lg animate-float-delayed z-40">
              <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2 rounded-sm shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>

            {/* Floating Badge 2 (Sharper, Square) */}
            <div className="absolute -left-8 bottom-16 bg-white border border-gray-100 p-2 rounded shadow-lg animate-float z-40" style={{ animationDelay: '1.5s' }}>
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-sm shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section - Updated icons and text for tech feel */}
      <section className="px-6 md:px-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Structured Data", desc: "Organize nodes with strict hierarchy and rapid search indexing.", icon: "⚙️" },
            { title: "Low Latency Input", desc: "A stripped-down interface optimized for maximum typing velocity.", icon: "⚡" },
            { title: "Local Encryption", desc: "Data remains client-side. Zero external dependencies.", icon: "🛡️" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur rounded-lg p-8 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Subtle background gradient mask so the grid fades out */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10 pointer-events-none"></div>
    </div>
  );
}

export default Home;