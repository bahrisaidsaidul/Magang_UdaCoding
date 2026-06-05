import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navLink = (path) =>
    location.pathname === path ? 'text-blue-400' : ''

  return (
    <nav className="p-5 flex justify-between items-center bg-white/10 backdrop-blur-md">
      <h1 className="text-xl font-bold">MY-PORTFOLIO</h1>

      <div className="hidden md:flex gap-6">
        <Link className={navLink('/')} to="/">Home</Link>
        <Link className={navLink('/about')} to="/about">About</Link>
        <Link className={navLink('/projects')} to="/projects">Projects</Link>
        <Link className={navLink('/contact')} to="/contact">Contact</Link>
      </div>

      <button onClick={() => setOpen(!open)} className="md:hidden">
        ☰
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 p-5 flex flex-col gap-4">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>
      )}
    </nav>
  )
}
