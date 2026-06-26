import { useAuth } from "@/features/auth/authContext";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <h2 className="font-bold text-xl mb-6">ERP</h2>

      <nav className="space-y-2">
        <div className="p-2 hover:bg-gray-100 rounded">Dashboard</div>
        <div className="p-2 hover:bg-gray-100 rounded">POS</div>
        <div className="p-2 hover:bg-gray-100 rounded">Products</div>
        <div className="p-2 hover:bg-gray-100 rounded">Inventory</div>
        <div className="p-2 hover:bg-gray-100 rounded">Purchases</div>
        <div className="p-2 hover:bg-gray-100 rounded">Reports</div>
      </nav>
    </div>
  );
}

function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="font-medium">ERP System</div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.username}</span>

        <button onClick={logout} className="text-red-500 text-sm">
          Logout
        </button>
      </div>
    </div>
  );
}

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
