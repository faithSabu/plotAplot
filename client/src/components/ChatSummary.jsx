import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChatSummary({ chat, currentUserId, online }) {
  const { noOfMessages } = useSelector((state) => state.chat);

  const [memberData, setMemberData] = useState(null);
  const [noOfCurrentMsgs, setNoOfCurrentMsgs] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const memberId = chat.members.find((id) => id !== currentUserId);

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
  }, []);

  useEffect(() => {
    if (noOfMessages.length > 0) {
      const result = noOfMessages.find((msg) => msg.chatId === chat._id);
      if (result) {
        setNoOfCurrentMsgs(result.count);
      } else {
        setNoOfCurrentMsgs(null);
      }
    } else {
      setNoOfCurrentMsgs(null);
    }
  }, [noOfMessages]);

  return (
    <>
      {memberData && (
        <>
          <hr className="border-1 border-slate-300 dark:border-slate-600" />
          <div className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 transition px-3 py-2 hover:cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="w-12 h-12 rounded-full hidden sm:block"
              src={
                memberData
                  ? memberData?.avatar
                  : import.meta.env.VITE_DEFAULT_AVATAR
              }
              onError={(e) => (e.target.src = import.meta.env.VITE_DEFAULT_AVATAR)}
              alt="P"
            />
            <div className="flex flex-col">
              <span className="text-slate-700 dark:text-slate-200">
                {memberData.username}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-500">
                {online ? "Online" : "Offline"}
              </span>
            </div>
            {noOfCurrentMsgs > 0 ? (
              <div className="flex-1 flex justify-end">
                <span className="bg-green-500 rounded-full h-5 sm:h-6 flex items-center text-xs font-semibold p-1 sm:p-2 text-white">
                  {noOfCurrentMsgs}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </>
  );
}
