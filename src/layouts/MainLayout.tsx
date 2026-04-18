import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* 1. Sidebar - Tetep di kiri, kaga gerak */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Navbar - Nempel di atas (Sticky) */}
        <Navbar />

        {/* 3. Main Content - Tempat 'Pages' muncul */}
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Si Outlet ini yang bakal nampilin Dashboard, Users, dll */}
            <Outlet />
          </div>
        </main>

        {/* Footer Simpel (Opsional) */}
        <footer className="p-4 text-center text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
          © 2026 Added more bugs to fix later
        </footer>
      </div>
    </div>
  );
};
