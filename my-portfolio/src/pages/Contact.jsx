import { useEffect } from 'react'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact - Portfolio'
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl">Contact</h1>
      <input className="block p-2 my-2 w-full" placeholder="Name" />
      <input className="block p-2 my-2 w-full" placeholder="Email" />
      <textarea className="block p-2 my-2 w-full" placeholder="Message" />
      <button className="bg-blue-500 px-4 py-2 rounded">Send</button>
    </div>
  )
}
