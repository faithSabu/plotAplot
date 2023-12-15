import React, { useEffect, useState } from "react";
import ChatSummary from "../components/ChatSummary";
import Conversations from "../components/Conversations";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { activeUsers } = useSelector((state) => state.socket);
  const { noOfMessages, latestChat } = useSelector((state) => state.chat);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (chats && latestChat) {
      const chatsCopy = [...chats];
      const index = chatsCopy.findIndex((chat) => chat._id === latestChat);
      const removedChat = chatsCopy.splice(index, 1);
      chatsCopy.unshift(removedChat[0]);

      setChats(chatsCopy);
    }
  }, [latestChat]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const chatId = params.chatId;

    const handleCurrentChat = async () => {
      const data = await fetch(`/api/chat/findByChatId/${chatId}`, { signal });
      const res = await data.json();
      setCurrentChat(res);
    };

    if (chatId) {
      handleCurrentChat();
    }

    return () => {
      controller.abort();
    };
  }, [params.chatId]);

  useEffect(() => {
    const userChats = async () => {
      setLoadingChats(true);
      try {
        const res = await fetch(`/api/chat/userChats/${currentUser._id}`);
        const data = await res.json();
        setChats(data);
        setLoadingChats(false);
      } catch (error) {
        console.error(error);
        setLoadingChats(false);
      }
    };
    currentUser && userChats();
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== currentUser._id
    );
    const online = activeUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const checkMessageNum = (chatId) => {
    const num = noOfMessages?.find((item) => item.chatId === chatId);

    const result = num ? num.messageCount : 0;
    return result;
  };

  if (loadingChats) {
    return (
      <div className="flex items-center justify-center text-slate-600 font-semibold dark:text-white mt-10">
        Loading Chats ...
      </div>
    );
  }

  return (
    <div className="flex flex-1 max-h-[calc(100vh-72px)]">
      <div
        className={`w-1/4 bg-slate-100 border-r-2 border-slate-300 dark:bg-gray-900 dark:border-slate-600 ${
          chats.length > 0 ? "w-1/4 min-w-fit" : "w-1/5"
        }`}
      >
        <div className="text-slate-600 text-lg font-semibold px-3 h-16 uppercase flex items-center dark:text-white">
          Chats
        </div>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate(`/chat/${chat._id}`);
              }}
            >
              <ChatSummary
                key={chat._id}
                chat={chat}
                currentUserId={currentUser._id}
                online={checkOnlineStatus(chat)}
                messageNumber={checkMessageNum(chat._id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-slate-700 dark:text-slate-300 p-3 mt-16 max-w-xs">
            You haven't made any connections. Visit any listing to get in touch
            with the landlord.
            <Link to="/search">
              <div className="text-blue-600 hover:text-blue-500 font-semibold hover:underline mt-2">
                Go to Listings
              </div>
            </Link>
          </div>
        )}
      </div>
      {currentChat ? (
        <div className="flex flex-col flex-1 bg-slate-300 dark:bg-slate-700">
          <Conversations
            key={currentChat._id}
            chat={currentChat}
            currentUserId={currentUser._id}
            online={checkOnlineStatus(currentChat)}
          />
        </div>
      ) : (
        <div className="bg-slate-300 flex justify-center items-center w-full dark:bg-slate-700">
          <span className="text-lg text-slate-700 dark:text-slate-300 text-center">
            Grab your best plot through{" "}
            <span className="text-slate-600 dark:text-slate-400 font-bold whitespace-pre sm:whitespace-normal">
              Plot-A-Plot
            </span>
            ...
          </span>
        </div>
      )}
    </div>
  );
}
