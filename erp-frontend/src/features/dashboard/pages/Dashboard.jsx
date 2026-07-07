import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import { getDashboardCharts } from "../services/dashboardCharts";
import { getSales } from "../../sales/api/salesApi";
import { getPurchases } from "../../purchases/api/purchasesApi";

import StatsGrid from "../components/StatsGrid";
import SalesLineChart from "../components/charts/SalesLineChart";
import ProfitPieChart from "../components/charts/ProfitPieChart";
import StockRiskChart from "../components/charts/StockRiskChart";
import RecentSalesWidget from "../components/RecentSalesWidget";
import RecentPurchasesWidget from "../components/RecentPurchasesWidget";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sales, setSales] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getDashboardCharts();
      const resSales = await getSales();
      const resPurchases = await getPurchases();
      setData(res);
      setSales(resSales.data.results.slice(0, 5));
      setPurchases(resPurchases.data.results.slice(0, 5));
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
      <div className="grid xl:grid-cols-2 gap-6 my-6">
        <SalesLineChart data={data.salesTrend} />

        <StockRiskChart data={data.stockRisk} />
      </div>

      {/* CHART SECTION B (Profit Focus) */}
      <div className="grid xl:grid-cols-3 gap-3 my-6">
        <ProfitPieChart data={data.salesActivity} />

        <RecentSalesWidget data={sales} />

        <RecentPurchasesWidget data={purchases} />
      </div>
    </>
  );
}
