import { Bell } from "lucide-react";
import { useAuth } from "@/features/auth/authContext";

export default function Topbar() {
  const { user } = useAuth();

  const role = user?.groups?.[0] || "User";

  return (
    <header className="h-20 bg-white border-b border-[var(--border)] px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>

        <p className="text-sm text-[var(--text-secondary)]">{user?.username}</p>
      </div>

      <div className="flex items-center gap-6">
        <Bell size={20} className="text-slate-500" />

        <div className="text-right">
          <div className="font-medium text-[var(--text-secondary)]">{role}</div>
        </div>
      </div>
    </header>
  );
}
