import { useEffect, useState } from "react";
import { toast } from "sonner";

import LoadingSpinner from "@/components/ui/Loader";

import { loadSalesReports } from "../services/salesReports";
import getErrorMessage from "@/utils/getErrorMessage";

import SalesKPIs from "../components/SalesKPIs";
import RevenueVsCogsChart from "../components/charts/RevenueVsCogsChart";
import ProfitMarginChart from "../components/charts/ProfitMarginChart";
import TopProfitChart from "../components/charts/TopProfitChart";
import FastMovingChart from "../components/charts/FastMovingChart";
import SlowMovingChart from "../components/charts/SlowMovingChart";

export default function SalesSection({ filters }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [filters]);

  async function load() {
    setLoading(true);

    try {
      const result = await loadSalesReports(filters);

      setData(result);
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
    <div className="space-y-8">
      <SalesKPIs profitLoss={data.profitLoss} cogs={data.cogs} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueVsCogsChart profitLoss={data.profitLoss} />

        <ProfitMarginChart profitLoss={data.profitLoss} />
      </div>

      <TopProfitChart data={data.topProfit} />

      <div className="grid gap-6 xl:grid-cols-2">
        <FastMovingChart data={data.fastMoving} />

        <SlowMovingChart data={data.slowMoving} />
      </div>
    </div>
  );
}
