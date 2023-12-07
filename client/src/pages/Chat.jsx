import React, { useEffect, useState } from "react";
import ChatSummary from "../components/ChatSummary";
import Conversations from "../components/Conversations";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import socket from "../utils/socketService";

export default function Chat() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { activeUsers } = useSelector((state) => state.socketReducer);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
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
    setLoadingChats(true);
    try {
      const userChats = async () => {
        const res = await fetch(`/api/chat/${currentUser._id}`);
        const data = await res.json();
        setChats(data);
        setLoadingChats(false);
      };
      userChats();
    } catch (error) {
      setLoadingChats(false);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (sendMessage) {
      socket.emit("send_messages", sendMessage);
    }

    return () => {
      socket.off("send_messages");
    };
  }, [sendMessage]);

  useEffect(() => {
    socket.on("receive_messge", (data) => {
      setReceiveMessage(data);
    });

    return () => {
      socket.off("receive_messge");
    };
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== currentUser._id
    );
    const online = activeUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
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
      <div className="w-1/4 bg-slate-100 border-r-2 border-slate-300 dark:bg-gray-900 dark:border-slate-600">
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
                data={chat}
                currentUserId={currentUser._id}
                online={checkOnlineStatus(chat)}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-slate-700 dark:text-slate-300 p-3 mt-16">
            You haven't made any connections. Visit any listing to get in touch
            with the landlord.
            <Link to="/search">
              <button className="text-blue-600 hover:text-blue-500 font-semibold hover:underline mt-2">
                Go to Listings
              </button>
            </Link>
          </div>
        )}
      </div>
      {currentChat ? (
        <div className="flex flex-col flex-1 bg-slate-300 dark:bg-slate-700">
          <Conversations
            chat={currentChat}
            currentUserId={currentUser._id}
            setSendMessage={setSendMessage}
            receiveMessage={receiveMessage}
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
