import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import { getDashboard } from "../api/dashboardApi";

import DashboardStats from "../components/DashboardStats";
import InventoryValue from "../components/InventoryValue";
import LowStockWidget from "../components/LowStockWidget";
import RecentSalesWidget from "../components/RecentSalesWidget";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of today's business performance."
      />

      <DashboardStats dashboard={dashboard} />

      <div className="grid xl:grid-cols-3 gap-6 my-8">
        <div className="xl:col-span-2">
          <InventoryValue value={dashboard.inventory_value} />
        </div>

        <LowStockWidget />
      </div>

      <RecentSalesWidget />
    </>
  );
}
