import React from 'react'

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        
        {/* Left section */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} Scribyx. All rights reserved.
        </p>

        {/* Right section */}
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <span className="cursor-default">
            Developed by Scribyx Team
          </span>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer