import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { Moon, Sun, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      <h2 className="text-sm font-medium text-neutral-500">
        Selamat Datang, Admin {user?.name}
      </h2>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-neutral-600" />
          )}
        </button>

        <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-800"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-700">
          <NavLink to={"/profile"}>
            <img
              src={
                user?.imageProfile ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              }
              alt="profile"
              className="w-8 h-8 rounded-full bg-emerald-100 object-cover"
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
