import { FaSearch } from "react-icons/fa";
import { MdOutlineLightMode, MdLightMode } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import { useLocation } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import socket from "../utils/socketService";
import { setActiveUsers } from "../redux/socket/socketSlice";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isDarkMode, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) setSearchTerm(searchTermFromURL);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    socket.emit("new_user_add", currentUser?._id);

    socket.on("get_users", (users) => {
      dispatch(setActiveUsers(users));
    });
    
    return () => {
      socket.off("new_user_add");
      socket.off("get_users");
    };
  }, [currentUser]);
  
  useEffect(() => {
    socket.on("receive_messge", (data) => {
      alert('msg received')
    });

    return () => {
      socket.off("receive_messge");
    };
  }, []);

  return (
    <header className="bg-slate-200 shadow-md dark:bg-gray-800 h-[72px]">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          {" "}
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500 dark:text-slate-400">Plot</span>
            <span className="text-red-700 dark:text-red-400">A</span>
            <span className="text-slate-500 dark:text-slate-400">Plot</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center dark:bg-neutral-800"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 dark:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            <FaSearch className="text-slate-600 dark:text-slate-400" />
          </button>
        </form>
        <ul className="flex gap-4">
          <button onClick={toggleTheme}>
            {isDarkMode ? (
              <MdOutlineLightMode className="text-neutral-300 text-lg" />
            ) : (
              <MdLightMode className="text-slate-700 text-lg" />
            )}
          </button>
          {location.pathname !== "/" && (
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline dark:text-neutral-300">
                Home
              </li>
            </Link>
          )}{" "}
          {location.pathname !== "/about" && (
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline dark:text-neutral-300">
                About
              </li>
            </Link>
          )}
          {location.pathname !== "/chat" && (
            <Link to="/chat">
              <li className="text-slate-700 hover:underline dark:text-neutral-300">
                <span className="hidden sm:inline">Message</span>
                <FaRegMessage className="inline sm:hidden" />
              </li>
            </Link>
          )}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="UserProfile"
              />
            ) : (
              <li className="text-slate-700 hover:underline dark:text-neutral-300">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
