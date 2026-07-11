import { navigation } from "./navigation";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/features/auth/authContext";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, loading, logout } = useAuth();
  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  if (loading || !user) {
    return (
      <aside className="w-64 bg-[var(--sidebar-bg)] h-screen flex items-center justify-center text-slate-400">
        Loading...
      </aside>
    );
  }
  const role = user?.groups?.[0] ?? "Cashier";

  const filteredNav = navigation.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-[var(--sidebar-bg)] text-white h-screen flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold">ERP POS</h1>
          <p className="text-sm text-slate-400">Business Suite</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        {filteredNav.map((item) => (
          <SidebarItem key={item.title} {...item} />
        ))}
      </nav>

      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
