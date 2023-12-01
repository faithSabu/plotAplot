import { useLayoutEffect, useState } from "react";

export default function SignoutModal({ onSignout, onClose }) {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <div className="fixed top-0 justify-center items-center h-screen bg-black/30 w-full">
      <div
        className={`flex justify-center mt-20 ${
          isMounted && "animate-slideIn"
        }`}
      >
        <div className="flex flex-col justify-center items-center gap-5 border px-5 sm:px-10 py-8 border-slate-400 rounded-lg bg-slate-200 hover:shadow-md transition-shadow dark:bg-gray-800">
          <h1 className="text-2xl font-semibold uppercase text-red-700 dark:text-red-400">
            Sign Out
          </h1>
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to sign out?
          </p>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={onSignout}
              className="bg-red-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 focus:scale-95"
            >
              <span className="hidden sm:inline"> Yes, Sign me out</span>
              <span className="inline sm:hidden"> Sign out</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-600 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 focus:scale-95"
            >
              <span className="hidden sm:inline"> No, I want to stay</span>
              <span className="inline sm:hidden"> No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
