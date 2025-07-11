import React from "react";
import ChatIcon from "../assets/talking.png";
import { useState } from "react";
import toast from "react-hot-toast";
import {createRoomApi,getRoomStatus} from "../services/RoomService"
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
  const [detail,setDetail]= useState({
    roomId:"",
    userName:"",
  });
const navigate=useNavigate();

   const {roomId,userName,connected,setRoomId,setCurrUser,setConnected }=useChatContext()


  function handleFormInput(event){
    setDetail({...detail,
      [event.target.name] : event.target.value,})
    }

    
  function validateForm(){
    if(detail.userName===""||detail.roomId===""){
      toast.error("Form is incomplete")
      return false
    }
  return true
  }
  async function joinChat(){
    if(validateForm()){
    try {
        const response=await getRoomStatus(detail.roomId);
        const room = response.data;
          setCurrUser(detail.userName);
          setRoomId(room.roomId);
          setConnected(true);
            console.log(roomId);

          navigate("/chat")
          toast.success("Sucessfully joined the room")
        
      
    } catch (error) {
     if (error.response?.status === 400) {
        toast.error("The room you're trying to access is invalid");
      } else {
        toast.error("Something went wrong");
        console.error("Join chat error:", error);
      }
    }

    }
  }
 async function createRoom(){
     if(validateForm()){
      //call api to create room
      try {
        const response= await createRoomApi(detail.roomId);
        console.log(response)
        toast.success("Room Created sucessfully")
        setCurrUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
        
      } catch (error) {
        console.log(error);
        if(error.response?.status === 400){
          toast.error("Room Already Exist")
        }
        console.log("error in creating room")
        
      }
    }
  }
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center overflow-hidden px-4">

      {/* Animated Particle Background (CSS only) */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full overflow-hidden">
          <div className="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-purple-400/10 rounded-full blur-3xl bottom-10 right-1/3 animate-ping"></div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 text-white p-10 rounded-3xl shadow-2xl animate-fade-in space-y-6">

        {/* Floating Chat Icon */}
        <div className="w-24 mx-auto mb-2 animate-float">
          <img src={ChatIcon} alt="Chat Icon" className="drop-shadow-xl" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl text-center font-extrabold text-cyan-300 tracking-wide">
          Join or Create a Room
        </h1>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
            Your Name
          </label>
          <input
          onChange={handleFormInput}
          value={detail.userName}
            id="name"
            type="text"
            name="userName"
            
            placeholder="e.g. Your Name"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Room ID Input */}
        <div>
          <label htmlFor="roomid" className="block text-sm font-semibold text-gray-200 mb-2">
            Room ID / Create New
          </label>
          <input
            id="roomid"
            onChange={handleFormInput}
            value={detail.roomId}
            type="text"
            name="roomId"
            placeholder="e.g. room123"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
          onClick={joinChat}
          className="w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-2 rounded-full text-white font-semibold shadow-lg transition-all duration-300">
            Join Room
          </button>
          <button
          onClick={createRoom}
          className="w-1/2 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 py-2 rounded-full text-white font-semibold shadow-lg transition-all duration-300">
            Create Room
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};  

export default JoinCreateChat;
