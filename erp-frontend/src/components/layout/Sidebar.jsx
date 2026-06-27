import { navigation } from "./navigation";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/features/auth/authContext";

export default function Sidebar() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <aside className="w-64 bg-[var(--sidebar-bg)] h-screen flex items-center justify-center text-slate-400">
        Loading...
      </aside>
    );
  }
  console.log(user);
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

      <nav className="flex-1 p-4 space-y-2">
        {filteredNav.map((item) => (
          <SidebarItem key={item.title} {...item} />
        ))}
      </nav>
    </aside>
  );
}
