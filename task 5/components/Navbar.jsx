import React, { useState } from 'react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className='fixed top-0 left-0 w-full z-20 bg-gray-700 dark:bg-gray-900 text-white'>
      <div className='container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center'>
        {/* Logo */}
        <div className='flex justify-between items-center w-full md:w-auto'>
          <div className='text-2xl font-bold'>
            <a href="/">
              PORTFOLIO
            </a>
          </div>
          
          {/* Hamburger Button - muncul di layar md ke bawah */}
          <button 
            onClick={toggleMenu}
            className='block md:hidden focus:outline-none'
            aria-label='Toggle menu'
          >
            <div className='space-y-1.5'>
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Navigation Menu - responsive dengan toggle */}
        <nav className={`
          bg-gray-800 md:bg-white/0 rounded-[10px] p-3 md:p-0 mt-2 md:mt-0 
          w-full md:w-auto transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'block' : 'hidden'} md:block
        `}>
          <ul className='flex flex-col md:flex-row items-center gap-5'>
            <li><a href="/About" className='hover:text-gray-300 transition-colors' onClick={() => setIsMenuOpen(false)}>ABOUT</a></li>
            <li><a href="/Project" className='hover:text-gray-300 transition-colors' onClick={() => setIsMenuOpen(false)}>PROJECT</a></li>
            <li><a href="/Contact" className='hover:text-gray-300 transition-colors' onClick={() => setIsMenuOpen(false)}>CONTACT</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar