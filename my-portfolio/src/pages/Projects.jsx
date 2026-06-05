import { useEffect } from 'react'

export default function Projects() {
  useEffect(() => {
    document.title = 'Projects - Portfolio'
  }, [])

  return (
    <div className="p-10 grid md:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(p => (
        <div key={p} className="p-6 rounded-xl backdrop-blur-md bg-white/30">
          Project {p}
        </div>
      ))}
    </div>
  )
}
