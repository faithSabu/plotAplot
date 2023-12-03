import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoMdSend } from "react-icons/io";

export default function Conversations({ chat, currentUserId }) {
  const [memberData, setMemberData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
        const res = await fetch(`/api/message/1`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getMessages();
  }, [chat]);

  const handleChange = (e) => {
    setNewMessage(e);
  };

  const handleSubmit = (e) => {
    console.log(e);
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-slate-100 h-16">
        <img
          className="w-12 h-12 rounded-full"
          // src="data:image/jpeg;base64,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"
          src={memberData?.avatar}
          alt=""
        />
        <div className="flex flex-col">
          <span className="text-slate-700 ">name</span>
          <span className="text-xs text-slate-600 ">online</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-2">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`w-fit max-w-[400px] p-2 ${
              message.senderId === currentUserId
                ? "ml-auto rounded-t-xl rounded-l-xl bg-white"
                : "mr-auto rounded-b-xl rounded-r-xl bg-slate-100"
            }`}
          >
            <div className="text-slate-700">{message.text}</div>
            <div className="text-right text-xs text-slate-600 -mt-0.5">
              {format(message.createdAt)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pb-3 flex items-center gap-3 p-3">
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          theme="light"
          shouldReturn
          onEnter={handleSubmit}
          cleanOnEnter
        />
        <button type="submit" className="bg-slate-100 p-2 pl-3 rounded-full">
          <IoMdSend className="text-2xl" />
        </button>
      </div>
    </>
  );
}
