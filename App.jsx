import { useState } from 'react'
import './App.css'
import Converter from './Components/Converter'
import Header from './Components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {


  return (
    <>
    <Router basename='/'>
      <Header />
      <Routes>
        <Route path='/' element={<Converter />}>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
