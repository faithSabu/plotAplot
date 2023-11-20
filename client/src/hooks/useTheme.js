import { useEffect, useState } from "react";

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "rgb(241, 245, 241)";
    } else {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "rgb(33, 36, 33)";
    }
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "rgb(33, 36, 33)";
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "rgb(241, 245, 241)";
    }
  }, []);

  return { isDarkMode, toggleTheme };
};
export default useTheme;
