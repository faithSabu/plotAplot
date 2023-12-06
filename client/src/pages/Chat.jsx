import React, { useEffect, useRef, useState } from "react";
import ChatSummary from "../components/ChatSummary";
import Conversations from "../components/Conversations";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const chatId = params.chatId;

    const handleCurrentChat = async () => {
      const data = await fetch(`/api/chat/findByChatId/${chatId}`);
      const res = await data.json();
      setCurrentChat(res);
    };

    if (chatId) {
      handleCurrentChat();
    }
  }, [params.chatId]);

  useEffect(() => {
    try {
      const userChats = async () => {
        const res = await fetch(`/api/chat/${currentUser._id}`);
        const data = await res.json();
        setChats(data);
      };
      userChats();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:8000");
    socket.current.emit("new_user_add", currentUser._id);
    socket.current.on("get_users", (users) => {
      setOnlineUsers(users);
    });

    // return() => {
    //   socket.current.emit("disconnect")
    // }
  }, [currentUser]);

  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send_messages", sendMessage);
    }

    return () => {
      socket.current.off("send_messages");
    };
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("receive_messge", (data) => {
      setReceiveMessage(data);
    });

    return () => {
      socket.current.off("receive_messge");
    };
  }, []);

  return (
    <div className="flex flex-1 max-h-[calc(100vh-72px)]">
      <div className="w-1/4 bg-slate-100 border-r-2 border-slate-300 dark:bg-gray-900 dark:border-slate-600">
        <div className="text-slate-600 text-lg font-semibold px-3 h-16 uppercase flex items-center dark:text-white">
          Chats
        </div>
        <div className="">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate(`/chat/${chat._id}`);
              }}
            >
              <ChatSummary data={chat} currentUserId={currentUser._id} />
            </div>
          ))}
        </div>
      </div>
      {currentChat ? (
        <div className="flex flex-col flex-1 bg-slate-300 dark:bg-slate-700">
          <Conversations
            chat={currentChat}
            currentUserId={currentUser._id}
            setSendMessage={setSendMessage}
            receiveMessage={receiveMessage}
          />
        </div>
      ) : (
        <div className="bg-slate-300 flex justify-center items-center w-full dark:bg-slate-700">
          <span className="text-lg text-slate-700 dark:text-slate-300">
            Grab your best plot through Plot-A-Plot...
          </span>
        </div>
      )}
    </div>
  );
}
