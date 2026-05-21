import { useState, useEffect } from "react";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../hooks/useAuth";

function Topbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(/\s?[AP]M$/, '');

  

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-14 flex items-center px-4 gap-3 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border shrink-0">
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title — filled by each page */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center justify-center px-7 h-11 rounded-lg bg-light-hover dark:bg-dark-hover text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium select-none">
          <div className="text-center">
            <p className="text-[20px] font-medium text-light-text-primary dark:text-dark-text-primary">
              {formattedTime}
            </p>
            <p className="text-[11px] text-light-text-tertiary dark:text-dark-text-tertiary">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium cursor-pointer">
          {user?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
