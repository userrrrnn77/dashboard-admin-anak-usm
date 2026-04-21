import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* 1. Sidebar - Kunci di layar (h-screen & sticky top-0) */}
      <aside className="hidden md:block h-screen sticky top-0 border-r border-neutral-100 dark:border-neutral-800">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Navbar - Sticky di atas */}
        <div className="sticky top-0 z-10">
           <Navbar />
        </div>

        {/* 3. Main Content - Scrollable */}
        <main className="p-4 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
          © 2026 Added more bugs to fix later
        </footer>
      </div>
    </div>
  );
};