import React, { useEffect, useState } from "react";

export default function ChatSummary({ data, currentUserId }) {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const memberId = data.members.find((id) => id !== currentUserId);

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
  }, []);

  return (
    <>
      {memberData && (
        <>
          <hr className="border-1 border-slate-300 dark:border-slate-600" />
          <div className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 transition px-3 py-2 hover:cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="w-12 h-12 rounded-full hidden sm:block"
              src={memberData.avatar}
              alt=""
            />
            <div className="flex flex-col">
              <span className="text-slate-700 dark:text-slate-200">
                {memberData.username}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-500">
                online
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
