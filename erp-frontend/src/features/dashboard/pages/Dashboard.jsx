import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";

import { getDashboardCharts } from "../services/dashboardCharts";
import { getSales } from "../../sales/api/salesApi";
import { getPurchases } from "../../purchases/api/purchasesApi";
import getErrorMessage from "@/utils/getErrorMessage";

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
      setLoading(true);
      const res = await getDashboardCharts();
      const resSales = await getSales();
      const resPurchases = await getPurchases();

      setData(res);
      setSales(resSales.data.results.slice(0, 5));
      setPurchases(resPurchases.data.results.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <LoadingSpinner />;
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
      <div className="my-6 grid gap-6 xl:grid-cols-2">
        <SalesLineChart data={data.salesTrend} />

        <StockRiskChart data={data.stockRisk} />
      </div>

      {/* CHART SECTION B (Profit Focus) */}
      <div className="my-6 grid gap-3 xl:grid-cols-3">
        <ProfitPieChart data={data.salesActivity} />

        <RecentSalesWidget data={sales} />

        <RecentPurchasesWidget data={purchases} />
      </div>
    </>
  );
}
