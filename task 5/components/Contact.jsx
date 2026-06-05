import { Moon, Sun } from "lucide-react";
import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function Contact() {
  const [Theme, SetTheme] = useState("light")
  const ToggleTheme = () => {
      const NewTheme = Theme == "light" ? "dark" : "light";
      SetTheme(NewTheme);
      document.documentElement.classList.toggle("dark", NewTheme == "dark");
  };
  
  return (
    <div className='dark:bg-gray-700'>
    <Navbar/>
       <div>
        <div className="justify-end flex mt-8"> <button onClick={ToggleTheme} className="cursor-pointer dark:text-white scale-150 m-11 hover:animate-bounce ">{Theme == 'light' ? <Moon /> : <Sun />}</button></div>
          <div>
            <h1 className='text-center font-bold text-5xl mt-15 mb-10 dark:text-white '>KONTAK SAYA</h1>
            <div className="place-content-center flex">
              <div className="backdrop-blur-md bg-white/30 p-6 rounded-xl w-3.5xl mt-30 mb-50">
                  <div className="flex dark:text-white font-bold text-2xl md:text-3xl ">
                    <ul className="ml-5 border-2 p-2">
                      <li className="p-5 border-2">no telpon </li>
                      <li className="p-5 border-2">email </li>
                      <li className="p-5 border-2">intagram </li>
                    </ul>
                    <ul className="ml-10 mr-5 border-2 p-2">
                      <li className="p-5 border-2">08980897878</li>
                      <li className="p-5 border-2">saidsaidulbahri@gmail.com</li>
                      <li className="p-5 border-2">said-saidul</li>
                    </ul>
                  </div>
            </div>
            </div>
          </div>
       </div>
    <div className="mb-0"><Footer/></div>
    </div>
  )
}

export default Contact