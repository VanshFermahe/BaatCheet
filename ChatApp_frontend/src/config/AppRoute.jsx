import React from 'react'
import App from '../App'
import {Routes,Route} from  "react-router";
import ChatPage from '../Components/ChatPage';

const AppRoute = () => {

  return (
    <Routes>
        <Route path="" element={<App/>}/>
        <Route path="home" element={<h1>This is a chat app</h1>}/>
         <Route path="chat" element={<ChatPage/>}/>
    </Routes>
  )
}

export default AppRoute
