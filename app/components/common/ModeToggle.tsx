import React, { useEffect, useState } from "react";

interface ModeToggleProps {
  className?: string;
}

export default function ModeToggle(props: ModeToggleProps) {
  const { className } = props;

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Safely access localStorage on the client-side
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      // Default to system preference if no theme is stored
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPreference);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="dark-mode-toggle" className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          id="dark-mode-toggle"
          className="peer hidden"
          checked={isDarkMode}
          onChange={handleToggle}
        />
        <span
          className="block w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-500 transition"
        ></span>
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full transition peer-checked:translate-x-6"
        ></span>
      </label>
      <span className="text-gray-900 dark:text-gray-100">Dark Mode</span>
    </div>
  );
}
