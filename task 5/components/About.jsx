import Navbar from './Navbar'
import Footer from './Footer'
import { FaReact } from "react-icons/fa";
import { FaLaravel } from "react-icons/fa";
import { FaJsSquare } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { FaGit } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { Moon, Sun } from "lucide-react";
import React, { useState } from 'react'


function About() {
  const [Theme, SetTheme] = useState("light")
  const ToggleTheme = () => {
      const NewTheme = Theme == "light" ? "dark" : "light";
      SetTheme(NewTheme);
      document.documentElement.classList.toggle("dark", NewTheme == "dark");
  };

  return (
    <div className='dark:bg-gray-700'>
    <Navbar/>
        <div className='mb-100 '>
          <div className="justify-end flex mt-8"> <button onClick={ToggleTheme} className="cursor-pointer dark:text-white scale-150 m-11 hover:animate-bounce">{Theme == 'light' ? <Moon /> : <Sun />}</button></div>
            <div>
              <h1 className='text-center font-bold text-5xl mt-15 dark:text-white'>TENTANG SAYA</h1>
            </div>
            <div>
              <h1 className='m-10 p-20  text-3xl text-center dark:text-white'>Perkenalkan nama saya said saidul bahri saya salah seorang mahasiswa dari universitas politeknik aceh <br /> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum animi harum corrupti consequatur placeat quidem qui, excepturi perferendis nisi, accusantium beatae porro autem itaque ex recusandae! Fuga quaerat odio molestiae!</h1>
            </div>
            <div>
              <h1 className='text-center dark:text-white text-3xl font-bold'>SKILL</h1>
              <div className='flex justify-center m-20 text-5xl dark:text-white'>
                <div><h1 className='mr-5 ml-5'><FaReact /></h1></div>
                <div><h1 className='mr-5 ml-5'><FaLaravel /></h1></div>
                <div><h1 className='mr-5 ml-5'><FaJsSquare /></h1></div>
                <div><h1 className='mr-5 ml-5'><FaCss3 /></h1></div>
                <div><h1 className='mr-5 ml-5'><FaGit /></h1></div>
                <div><h1 className='mr-5 ml-5'><VscVscode /></h1></div>
              </div>
            </div>
        </div>
    <Footer/>
    </div>
  )
}

export default About