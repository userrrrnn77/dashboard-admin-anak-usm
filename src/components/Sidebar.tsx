import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Image as ImageIcon,
  HeartHandshake,
  LogOut,
  UserRoundCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Manajemen Admin", path: "/users", icon: Users },
  { name: "Pendaftaran", path: "/register", icon: UserRoundCheck },
  { name: "Program Baitul Maal", path: "/baitul-maal", icon: HeartHandshake },
  { name: "Produk", path: "/products", icon: Package },
  { name: "Galeri Kegiatan", path: "/gallery", icon: ImageIcon },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { logoutAction } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Mitra Hasanah
        </h1>
        <p className="text-xs text-neutral-500">v1.0 - Anak USM Edition</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}>
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <button
          onClick={logoutAction}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
