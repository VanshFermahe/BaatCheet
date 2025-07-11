import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'
import toast from 'react-hot-toast'
import ChatPage from './Components/ChatPage'
import JoinCreateChat from './Components/JoinCreateChat'
function App() {
  const [count, setCount] = useState(0)

  return <div>

  <JoinCreateChat/>
 </div>
  
  
}

export default App
