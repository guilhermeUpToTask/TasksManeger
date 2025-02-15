import { useState } from 'react'
import './App.css'
import React from 'react'
import Tasks from './components/Tasks'
import Categories from './components/Categories'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Task Manager Web Aplication</h1>
      <Categories/>
      <Tasks/>
    </>
  )
}

export default App
