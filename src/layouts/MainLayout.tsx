import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Layout */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out        
          md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-10">
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>

        <main className="p-4 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
          © 2026 Added more bugs to fix later
        </footer>
      </div>
    </div>
  );
};
