import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import { getDashboardCharts } from "../services/dashboardCharts";

import StatsGrid from "../components/StatsGrid";
import SalesLineChart from "../components/charts/SalesLineChart";
import ProfitPieChart from "../components/charts/ProfitPieChart";
import StockRiskChart from "../components/charts/StockRiskChart";
import LowStockWidget from "../components/LowStockWidget";
import RecentSalesWidget from "../components/RecentSalesWidget";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getDashboardCharts();
      setData(res);
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
        subtitle="Business overview & performance"
      />

      {/* KPI */}
      <StatsGrid dashboard={data} />

      {/* CHART SECTION A (Sales Trend) */}
      <div className="grid xl:grid-cols-3 gap-6 my-6">
        <SalesLineChart data={data.salesTrend} />

        <StockRiskChart data={data.stockRisk} />

        <LowStockWidget />
      </div>

      {/* CHART SECTION B (Profit Focus) */}
      <div className="grid xl:grid-cols-3 gap-6 my-6">
        <ProfitPieChart data={data.salesActivity} />

        <RecentSalesWidget />

        <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
          <h3 className="font-semibold mb-2">Quick Insights</h3>

          <p className="text-sm text-gray-500">
            Monitor sales vs purchases and stock risk in real time.
          </p>
        </div>
      </div>
    </>
  );
}
