import { Moon, Sun } from "lucide-react";
import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { FaReact } from "react-icons/fa";

function Project() {
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
        <div className="justify-end flex mt-8"> <button onClick={ToggleTheme} className="cursor-pointer dark:text-white scale-150 m-11 hover:animate-bounce">{Theme == 'light' ? <Moon /> : <Sun />}</button></div>
          <div>
            <div>
                <h1 className='text-center font-bold text-5xl mt-15 dark:text-white' >PROJECT</h1>
            </div>
            <div>
                <p className="text-2xl md:text-3xl text-center mt-20 mb-32 dark:text-white p-30">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam possimus illum officiis iste magnam illo cupiditate dolorem quos? Nihil, dolores. Sint necessitatibus exercitationem similique qui, deserunt sunt dicta quia ipsam!</p>
            </div>
            <div className="flex justify-center ">
              <p className="text-5xl dark:text-white "><FaReact /></p>
            </div>
          </div>
       </div>
    <Footer/>
    </div>
  )
}

export default Project