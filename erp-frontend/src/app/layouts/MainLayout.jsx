import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import PageContainer from "@/components/layout/PageContainer";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
