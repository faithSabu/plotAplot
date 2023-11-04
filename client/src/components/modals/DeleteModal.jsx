import { useLayoutEffect, useState } from "react";

export default function DeleteModal({ deleteInfo }) {
  const [isMounted, setIsMounted] = useState(false);

  const { onDelete, onClose } = deleteInfo;

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <div className="fixed top-0 justify-center items-center h-screen bg-black/20 w-full">
      <div
        className={`flex justify-center mt-20 ${
          isMounted && "animate-slideIn"
        }`}
      >
        <div className="flex flex-col justify-center items-center gap-5 border px-20 py-8 border-slate-400 rounded-lg bg-slate-200 hover:scale-105 duration-150 ">
          <h1 className="text-2xl font-semibold uppercase text-red-700">
            Are you sure ?
          </h1>
          <p className="text-slate-700">This action can not be undone!!</p>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={onDelete}
              className="bg-red-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 focus:scale-95"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="bg-slate-600 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 focus:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
