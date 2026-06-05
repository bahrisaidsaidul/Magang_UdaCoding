import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    document.title = 'About - Portfolio'
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl">About Me</h1>
      <p>I am a fullstack developer...</p>
    </div>
  )
}