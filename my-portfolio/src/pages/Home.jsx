import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    document.title = 'Home - Portfolio'
  }, [])

  return (
    <div className="p-10 space-y-20">

      {/* HERO */}
      <section className="text-center space-y-4">
        <img src="https://via.placeholder.com/150" className="mx-auto rounded-full" />
        <h1 className="text-3xl lg:text-4xl font-bold">Fullstack Developer Jakarta</h1>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-500 px-4 py-2 rounded">Hire Me</button>
          <button className="border px-4 py-2 rounded">Download CV</button>
        </div>
      </section>

      {/* SKILLS */}
      <section className="grid md:grid-cols-3 gap-6 text-center">
        {['React','Laravel','JavaScript','CSS','Git','VSCode'].map(skill => (
          <div key={skill} className="p-6 rounded-xl backdrop-blur-md bg-white/30 hover:scale-105 transition-all">
            {skill}
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="grid md:grid-cols-3 gap-6">
        {[1,2,3].map(p => (
          <div key={p} className="p-6 rounded-xl backdrop-blur-md bg-white/30 hover:scale-105 transition-all">
            <h2 className="text-xl font-bold">Project {p}</h2>
            <p>Short description...</p>
          </div>
        ))}
      </section>

    </div>
  )
}