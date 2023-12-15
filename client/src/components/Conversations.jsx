import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatNumber,
  updateLatestChat,
  updateMessageNumber,
  updateOpenedChat,
} from "../redux/user/chatSlice";
import socket from "../utils/socketService";

export default function Conversations({ chat, currentUserId, online }) {
  const { noOfMessages } = useSelector((state) => state.chat);

  const [memberData, setMemberData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [scrollBehavior, setScrollBehavior] = useState("instant");
  const [sendMessage, setSendMessage] = useState(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const scroll = useRef();
  const dispatch = useDispatch();

  // send message to socket
  useEffect(() => {
    if (sendMessage) {
      socket.emit("send_messages", sendMessage);
      dispatch(updateLatestChat(chat._id));
    }

    return () => {
      socket.off("send_messages");
      dispatch(updateLatestChat(null));
    };
  }, [sendMessage]);

  const handleReceivedMessage = (receivedMessage) => {
    setScrollBehavior("smooth");

    const memberId = chat.members.find((id) => id !== currentUserId);

    if (receivedMessage && receivedMessage.senderId === memberId) {
      setMessages((prev) => [...prev, receivedMessage.data]);
    }
  };

  // receive message from socket
  useEffect(() => {
    socket.on("receive_messge", handleReceivedMessage);

    return () => {
      socket.off("receive_messge", handleReceivedMessage);
    };
  }, []);

  useEffect(() => {
    if (chat) {
      dispatch(updateOpenedChat(chat._id));
    }

    return () => {
      dispatch(updateOpenedChat(null));
    };
  }, [chat]);

  const updateChatTime = async () => {
    await fetch(`/api/chat/changeUpdatedTime/${chat._id}`);
  };

  // send message to db
  const handleSubmit = async (e) => {
    if (!newMessage.trim()) {
      return;
    }
    const memberId = chat.members.find((id) => id !== currentUserId);

    const messageInfo = {
      chatId: chat._id,
      senderId: currentUserId,
      receiverId: memberId,
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
    setScrollBehavior("smooth");
    setNewMessage("");

    setSendMessage({ data, receiverId: memberId, senderId: currentUserId });

    updateChatTime();
  };

  useEffect(() => {
    if (noOfMessages.length > 0) {
      const currentMsgs = noOfMessages.find((msg) => msg.chatId === chat._id);
      if (currentMsgs) {
        const result = noOfMessages.filter((msg) => msg.chatId !== chat._id);
        dispatch(updateMessageNumber(result));
        dispatch(updateChatNumber(result.length));
      }
    }
  }, [noOfMessages]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const memberId = chat?.members.find((id) => id !== currentUserId);

    try {
      const getMemberInfo = async () => {
        const res = await fetch(`/api/user/getUser/${memberId}`, { signal });
        const data = await res.json();
        setMemberData(data);
      };
      getMemberInfo();
    } catch (error) {
      console.error(error);
    }

    return () => {
      controller.abort();
    };
  }, [chat, currentUserId]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getMessages = async () => {
      setLoadingMsgs(true);
      try {
        const res = await fetch(`/api/message/getMessage/${chat._id}`, {
          signal,
        });
        const data = await res.json();
        setMessages(data);
        setLoadingMsgs(false);
      } catch (error) {
        console.error(error);
        setLoadingMsgs(false);
      }
    };
    if (chat !== null) getMessages();

    return () => {
      controller.abort();
      setMessages([]);
    };
  }, [chat]);

  useEffect(() => {
    scroll.current &&
      scroll.current.scrollIntoView({ behavior: scrollBehavior });
  }, [messages]);

  useEffect(() => {
    const changeReadMessagesFunc = async () => {
      await fetch(
        `/api/message/changeReadMessages?chatId=${chat._id}&senderId=${senderId}`
      );
    };
    const senderId = chat?.members.find((id) => id !== currentUserId);
    senderId && changeReadMessagesFunc();
  }, []);

  return (
    <>{
      
    }
      <div className="flex items-center gap-3 p-3 bg-slate-100 h-16 dark:bg-slate-900">
        <img
          className="w-12 h-12 rounded-full"
          src={
            memberData ? memberData?.avatar : import.meta.env.VITE_DEFAULT_AVATAR
          }
          // onError={(e) => (e.target.src = import.meta.env.VITE_DEFAULT_AVATAR)}
          alt="user image"
        />
        <div className="flex flex-col">
          <span className="text-slate-700 dark:text-slate-300">
            {memberData?.username ? memberData?.username : "..."}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-500">
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      {loadingMsgs ? (
        <div className="text-center mt-10 text-slate-700 dark:text-slate-300">
          Loading Messages...
        </div>
      ) : (
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
      )}
      <div className="mt-auto pb-3 flex items-center gap-3 p-3">
        <InputEmoji
          value={newMessage}
          onChange={(e) => setNewMessage(e)}
          theme="dark"
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
