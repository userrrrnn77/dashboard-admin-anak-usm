import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => {
          const nextMode = !state.isDarkMode;
          // Langsung manipulasi DOM biar CSS v4 lu nangkep
          if (nextMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: nextMode };
        }),
    }),
    { name: "mitra-hasanah-theme" }, // Simpen di localStorage otomatis
  ),
);
