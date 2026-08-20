import { LogOut } from "lucide-react";

import { navigation } from "./navigation";
import SidebarItem from "./SidebarItem";

import { useAuth } from "@/features/auth/authContext";

export default function Sidebar() {
  const { user, loading, logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const role = user?.groups?.[0] ?? "Cashier";

  const filteredNav = navigation
    .map((item) => {
      if (item.children) {
        const children = item.children.filter(
          (child) => !child.roles || child.roles.includes(role),
        );

        if (!item.roles.includes(role) || children.length === 0) {
          return null;
        }

        return {
          ...item,
          children,
        };
      }

      if (!item.roles.includes(role)) {
        return null;
      }

      return item;
    })
    .filter(Boolean);

  return (
    <aside
      className="
        w-64
        h-screen
        flex
        flex-col
        overflow-hidden
        bg-[var(--sidebar-bg)]
        border-r
        border-white/10
      "
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">ERP POS</h1>

            <p className="text-sm text-slate-400">Business Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {/* Navigation */}
      <nav
        className="
    flex-1
    min-h-0
    p-3
    space-y-2
    overflow-y-auto
    overflow-x-hidden
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
  "
      >
        {filteredNav.map((item) => (
          <SidebarItem key={item.title} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="flex-shrink-0 p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-2
            rounded-xl
            text-slate-300
            hover:bg-red-500/10
            hover:text-red-400
            transition-colors
          "
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
