import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

export default function POSLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />

      <main className="min-w-0 min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
