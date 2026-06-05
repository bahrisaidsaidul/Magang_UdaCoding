import { Moon, Sun } from "lucide-react";
import React, { useState } from 'react'

function Header() {
const [Theme, SetTheme] = useState("light")
const ToggleTheme = () => {
    const NewTheme = Theme == "light" ? "dark" : "light";
    SetTheme(NewTheme);
    document.documentElement.classList.toggle("dark", NewTheme == "dark");
};


  return (
    <div>
        <div className="justify-end flex mt-8"> <button onClick={ToggleTheme} className="cursor-pointer dark:text-white scale-150 m-11 hover:animate-bounce  ">{Theme == 'light' ? <Moon /> : <Sun />}</button></div>
        <div className='justify-center flex m-18 ' >
            <img className='size-60 rounded-full shadow-2xl md:size-100'  src="../assets/profile-picture.png"/>
        </div>
        <div>
            <h1 className='text-center font-bold text-4xl md:text-5xl m-5  dark:text-white'>SAID SAIDUL BAHRI</h1>
        </div>
        <div text-center>
            <p className='text-2xl md:text-3xl text-center dark:text-white '>halo saya salah seorang mahasiswa dari universitas politeknik aceh <br/> saya suka hal berhubungan dalam bidang editing</p>
        </div>
        
    </div>
    


  )
}

export default Header