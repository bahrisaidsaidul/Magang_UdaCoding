import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Header from '../components/Header'

function Home() {
  return (
    <div className='dark:bg-gray-700'>
    <Navbar/>
    <Header/>
    <Footer/>
    </div>
  )
}

export default Home