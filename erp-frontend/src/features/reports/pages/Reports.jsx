import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import ReportsFilters from "../components/ReportsFilters";
import ReportsTabs from "../components/ReportsTabs";
import ReportsKPI from "../components/ReportsKPI";

import {
  getDashboard,
  getInventorySummary,
  getProfitLoss,
} from "../services/reportsApi";

export default function Reports() {
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("overview");

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
  });

  const [dashboard, setDashboard] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);

  useEffect(() => {
    loadReports();
  }, [filters]);

  async function loadReports() {
    try {
      setLoading(true);

      const [dashboardRes, inventoryRes, profitRes] = await Promise.all([
        getDashboard(),
        getInventorySummary(),
        getProfitLoss(filters),
      ]);

      setDashboard(dashboardRes.data);
      setInventorySummary(inventoryRes.data);
      setProfitLoss(profitRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading Reports...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Business intelligence, inventory analysis and financial reporting."
      />

      <ReportsFilters filters={filters} setFilters={setFilters} />

      <ReportsKPI
        dashboard={dashboard}
        inventory={inventorySummary}
        profit={profitLoss}
      />

      <ReportsTabs active={tab} onChange={setTab} />

      <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
        {tab === "overview" && <div>Overview coming next...</div>}

        {tab === "inventory" && <div>Inventory reports coming next...</div>}

        {tab === "sales" && <div>Sales reports coming next...</div>}

        {tab === "finance" && <div>Finance reports coming next...</div>}
      </div>
    </div>
  );
}
