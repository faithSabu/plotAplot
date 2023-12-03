import React, { useEffect, useState } from "react";
import ChatSummary from "../components/ChatSummary";
import Conversations from "../components/Conversations";
import { useSelector } from "react-redux";

export default function Chat() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

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

  return (
    <div className="flex flex-1">
      <div className="w-1/4 bg-slate-100 border-r-2 border-slate-300 dark:bg-gray-900 dark:border-slate-600">
        <div className="text-slate-600 text-lg font-semibold px-3 h-16 uppercase flex items-center dark:text-white">
          Chats
        </div>
        <div className="">
          {chats.map((chat) => (
            <div onClick={() => setCurrentChat(chat)}>
              <ChatSummary data={chat} currentUserId={currentUser._id} />
            </div>
          ))}
        </div>
      </div>
      {currentChat ? (
        <div className="flex flex-col flex-1 bg-slate-300 dark:bg-slate-700">
          <Conversations chat={currentChat} currentUserId={currentUser._id} />
        </div>
      ) : (
        <div className="bg-slate-300 flex justify-center items-center w-full dark:bg-slate-700">
          <span className="text-lg text-slate-700 dark:text-slate-300">Grab your best plot through Plot-A-Plot...</span>
        </div>
      )}
    </div>
  );
}
