import React, { useState, useRef, useEffect } from "react";
import sendbtn from "../assets/paper-plane.png";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { chatMessages, getRoomMembers } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const { roomId, currUser, connected, setRoomId, setCurrUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const currentUser = currUser;
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [adminMode, setAdminMode] = useState(false); // toggle admin tools

  // Simulate admin status: for demo, admin if username === "admin"
  const isAdmin = currUser?.toLowerCase() === "admin";

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, roomId, currUser]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    // Cleanup on unmount
    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await chatMessages(roomId);
        setMessages(msgs);
      } catch (error) {
        console.error(error);
      }
    }

    if (connected) loadMessages();
  }, [connected, roomId]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const users = await getRoomMembers(roomId);
        setMembers(users);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    }

    if (connected) fetchMembers();
  }, [roomId, connected]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        roomId,
        sender: currUser,
        content: input.trim(),
        timeStamp: new Date().toISOString(),
      };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  const handleLogout = () => {
    if (stompClient) stompClient.disconnect();
    setConnected(false);
    setCurrUser("");
    setRoomId("");
    toast.success("Left the room");
    navigate("/");
  };

  // Admin tools example actions
  const kickUser = (user) => {
    toast(`Kicked user: ${user} (functionality to be implemented)`, { icon: "👢" });
  };

  const changeRoomTopic = () => {
    toast("Change room topic clicked (functionality to be implemented)", { icon: "📝" });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-gray-900 px-6 py-3 border-b border-gray-700">
        <div className="text-2xl font-bold text-cyan-400 cursor-default select-none">BitChat</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Logged in as <span className="text-cyan-300 font-semibold">{currUser}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md font-semibold transition"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 flex justify-between items-center">
            Room Members
            {isAdmin && (
              <button
                onClick={() => setAdminMode(!adminMode)}
                className={`text-sm px-2 py-1 rounded-md font-semibold transition ${
                  adminMode ? "bg-red-500 hover:bg-red-600" : "bg-cyan-500 hover:bg-cyan-600"
                }`}
              >
                {adminMode ? "Close Admin" : "Admin Tools"}
              </button>
            )}
          </h2>

          <div className="space-y-3 flex-1 overflow-auto pr-2">
            {members.length === 0 && <p className="text-gray-400 text-sm">No members in the room.</p>}
            {members.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 bg-gray-700/40 p-2 rounded-lg hover:bg-gray-600"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://avatar.iran.liara.run/public/${idx + 1}`}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                  <span className={`text-sm ${member === currUser ? "text-green-300 font-semibold" : ""}`}>
                    {member}
                  </span>
                </div>
                {/* Admin can kick users */}
                {isAdmin && adminMode && member !== currUser && (
                  <button
                    onClick={() => kickUser(member)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded-md"
                    title={`Kick ${member}`}
                  >
                    Kick
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Admin tools panel */}
          {isAdmin && adminMode && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="font-semibold text-cyan-300 mb-2">Admin Tools</h3>
              <button
                onClick={changeRoomTopic}
                className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-md font-semibold transition"
              >
                Change Room Topic
              </button>
              {/* Add more admin controls here */}
            </div>
          )}
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col relative">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-cyan-300">Room: {roomId}</h1>
            <p className="text-sm text-gray-400">You: {currUser}</p>
          </div>

          {/* Messages */}
          <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-12 select-none">No messages yet. Start the conversation!</p>
            )}

            {messages.map((message, index) => {
              const isCurrentUser = message.sender === currentUser;
              return (
                <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-xl shadow-md border text-sm
                    ${isCurrentUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"}
                  `}
                  >
                    <p className="font-semibold text-cyan-300">{message.sender}</p>
                    <p className="mt-1 break-words">{message.content}</p>
                    <p className="text-xs text-gray-300 mt-1">{timeAgo(message.timeStamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-900 flex items-center gap-4">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition"
              ref={inputRef}
              spellCheck={false}
            />
            <button
              onClick={sendMessage}
              className="bg-cyan-500 hover:bg-cyan-600 px-4 py-3 rounded-full transition-all shadow flex items-center justify-center"
              aria-label="Send Message"
            >
              <img src={sendbtn} alt="Send" className="w-6 h-6 invert" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
