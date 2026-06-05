
import './App.css'
import Home from '../pages/Home'
import About from '../components/About'
import Project from '../components/Project'
import Contact from '../components/Contact'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/project' element={<Project/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App
