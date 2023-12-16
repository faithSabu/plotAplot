import { FaSearch } from "react-icons/fa";
import { MdOutlineLightMode, MdLightMode } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import { useLocation } from "react-router-dom";
import socket from "../utils/socketService";
import { setActiveUsers } from "../redux/socket/socketSlice";
import {
  updateChatNumber,
  updateLatestChat,
  updateMessageNumber,
} from "../redux/user/chatSlice";
import { IoMdHome } from "react-icons/io";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaSignInAlt } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import Tooltip from "./Tooltip";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { noOfChats, openedChat } = useSelector((state) => state.chat);

  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [messageNum, setMessageNum] = useState([]);

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
    if (openedChat) {
      setMessageNum((prev) => prev.filter((msg) => msg.chatId !== openedChat));
    }
    const handleReceivedMessage = (msgDetails) => {
      const msgChatId = msgDetails.data.chatId;
      dispatch(updateLatestChat(msgChatId));
      if (openedChat && msgChatId === openedChat) {
        setMessageNum((prev) =>
          prev.filter((msg) => msg.chatId !== openedChat)
        );
        return;
      }

      setMessageNum((prev) => {
        const copiedMsg = [...prev];

        const resultIndex = copiedMsg.findIndex(
          (msg) => msg.chatId === msgChatId
        );

        if (resultIndex !== -1) {
          copiedMsg[resultIndex] = {
            ...copiedMsg[resultIndex],
            count: copiedMsg[resultIndex].count + 1,
          };
        } else {
          copiedMsg.push({ count: 1, chatId: msgChatId });
        }

        return copiedMsg;
      });
    };

    socket.on("receive_messge", handleReceivedMessage);

    return () => {
      socket.off("receive_messge", handleReceivedMessage);
      dispatch(updateLatestChat(null));
    };
  }, [openedChat]);

  useEffect(() => {
    try {
      const getUnReadMessages = async () => {
        const result = await fetch(
          `/api/message/unreadMessages?currentUserId=${currentUser._id}`
        );
        const data = await result.json();
        setMessageNum(data);
      };
      currentUser && getUnReadMessages();
    } catch (error) {
      console.error(error);
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(updateChatNumber(messageNum.length));
    dispatch(updateMessageNumber(messageNum));
  }, [messageNum]);

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
            className="bg-transparent focus:outline-none w-24 md:w-64 dark:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            <FaSearch className="text-slate-600 dark:text-slate-400" />
          </button>
        </form>
        <ul className="flex gap-1 sm:gap-3 items-center">
          <button onClick={toggleTheme}>
            {isDarkMode ? (
              <MdOutlineLightMode className="text-neutral-300 text-lg" />
            ) : (
              <MdLightMode className="text-slate-700 text-lg" />
            )}
          </button>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-slate-500 dark:text-neutral-500 "
                : "text-slate-700 dark:text-neutral-300 "
            }
          >
            <li className="hidden sm:flex items-center gap-1 hover:underline ">
              <Tooltip
                text="Home"
                children={<IoMdHome className="text-2xl" />}
              />
              <span className="hidden md:inline">Home</span>
            </li>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-slate-500 dark:text-neutral-500"
                : "text-slate-700 dark:text-neutral-300 "
            }
          >
            <li className="hidden sm:flex items-center gap-1 hover:underline">
              <Tooltip
                text="About"
                children={<IoInformationCircle className="text-2xl" />}
              />
              <span className="hidden md:inline">About</span>
            </li>
          </NavLink>
          {currentUser && (
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                isActive
                  ? "text-slate-500 dark:text-neutral-500"
                  : "text-slate-700 dark:text-neutral-300 "
              }
            >
              <li className="flex items-center gap-1 hover:underline">
                <div className="relative">
                  <Tooltip
                    text="Messages"
                    children={<BiSolidMessageDetail className="text-2xl" />}
                  />
                  {/* && !location.pathname.startsWith("/chat")  */}
                  {noOfChats > 0 ? (
                    <span className="absolute -top-3.5 -right-3.5 sm:-right-4 bg-green-500 rounded-full h-5 min-w-max sm:h-1 flex items-center text-xs font-semibold p-1 sm:p-2 text-white">
                      {noOfChats}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <span className="hidden md:inline">Message</span>
              </li>
            </NavLink>
          )}
          <Link to="/profile">
            {currentUser ? (
              <Tooltip
                text={currentUser.username}
                children={
                  <img
                    className="rounded-full h-7 w-7 object-cover ml-2"
                    src={
                      currentUser.avatar
                        ? currentUser.avatar
                        : import.meta.env.VITE_DEFAULT_AVATAR
                    }
                    alt="UserProfile"
                  />
                }
                customStyle="-right-1.5"
              />
            ) : (
              <li className="text-slate-700 hover:underline dark:text-neutral-300 flex items-center gap-1 ml-2">
                <FaSignInAlt className="text-2xl" />
                <span className="hidden md:inline">Signin</span>
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
