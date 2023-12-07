import React, { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoMdSend } from "react-icons/io";

export default function Conversations({
  chat,
  currentUserId,
  setSendMessage,
  receiveMessage,
  online,
}) {
  const [memberData, setMemberData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [scrollBehavior, setScrollBehavior] = useState("instant");
  const scroll = useRef();

  useEffect(() => {
    const memberId = chat?.members.find((id) => id !== currentUserId);

    try {
      const getMemberInfo = async () => {
        const res = await fetch(`/api/user/${memberId}`);
        const data = await res.json();
        setMemberData(data);
      };
      getMemberInfo();
    } catch (error) {
      console.log(error);
    }
  }, [chat, currentUserId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/message/${chat._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getMessages();
  }, [chat]);

  useEffect(() => {
    if (receiveMessage && receiveMessage.receiverId === currentUserId) {
      setMessages((prev) => [...prev, receiveMessage.data]);
    }
  }, [receiveMessage]);

  const handleChange = (e) => {
    setNewMessage(e);
  };

  const updateChatTime = async () => {
    await fetch(`/api/chat/changeUpdatedTime/${chat._id}`);
  };

  const handleSubmit = async (e) => {
    if (!newMessage.trim()) {
      return;
    }
    const messageInfo = {
      chatId: chat._id,
      senderId: currentUserId,
      text: newMessage,
    };

    const res = await fetch(`/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageInfo),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    setNewMessage("");

    // sending message to socket server
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ data, receiverId });

    updateChatTime();
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: scrollBehavior });
    setTimeout(() => {
      setScrollBehavior("smooth");
    }, 500);
  }, [messages]);

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-slate-100 h-16 dark:bg-slate-900">
        <img
          className="w-12 h-12 rounded-full"
          src={memberData?.avatar}
          alt="user image"
        />
        <div className="flex flex-col">
          <span className="text-slate-700 dark:text-slate-300">
            {memberData?.username}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-500">
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-2 sm:px-10 overflow-scroll conversations-body">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={scroll}
            className={`w-fit max-w-[400px] p-2 ${
              message.senderId === currentUserId
                ? "ml-auto rounded-t-xl rounded-l-xl bg-white dark:bg-gray-900"
                : "mr-auto rounded-b-xl rounded-r-xl bg-slate-100 dark:bg-gray-800"
            }`}
          >
            <div className="text-slate-700 dark:text-slate-300">
              {message.text}
            </div>
            <div className="text-right text-xs text-slate-600 -mt-0.5 dark:text-slate-400">
              {format(message.createdAt)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pb-3 flex items-center gap-3 p-3">
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          theme="dark"
          shouldReturn
          onEnter={handleSubmit}
          cleanOnEnter
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-slate-100 p-2 pl-3 rounded-full"
        >
          <IoMdSend className="text-2xl" />
        </button>
      </div>
    </>
  );
}
