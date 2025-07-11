import { createContext, useContext, useState } from "react";
import React from 'react'; // ✅ REQUIRED for JSX to work

// 1. Create context
const ChatContext = createContext();

// 2. Create provider component
export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [currUser, setCurrUser] = useState('');
  const [connected,setConnected]=useState(false);

  return (
    <ChatContext.Provider value={{ roomId, currUser,connected, setRoomId, setCurrUser ,setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

// 3. Custom hook for using the context in components
 const useChatContext = () => useContext(ChatContext);
 export default useChatContext;
