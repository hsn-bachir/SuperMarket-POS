import { useEffect, useState } from "react";

import {
  getProfitLoss,
  getCogs,
  getTopProfitProducts,
  getFastMoving,
  getSlowMoving,
} from "../api/reportsApi";

import SalesKPIs from "../components/SalesKPIs";

import RevenueVsCogsChart from "../components/charts/RevenueVsCogsChart";
import ProfitMarginChart from "../components/charts/ProfitMarginChart";
import TopProfitChart from "../components/charts/TopProfitChart";
import FastMovingChart from "../components/charts/FastMovingChart";
import SlowMovingChart from "../components/charts/SlowMovingChart";

import TopProfitTable from "../components/TopProfitTable";

export default function SalesSection() {
  const [profitLoss, setProfitLoss] = useState(null);
  const [cogs, setCogs] = useState(null);

  const [topProfit, setTopProfit] = useState([]);
  const [fastMoving, setFastMoving] = useState([]);
  const [slowMoving, setSlowMoving] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profitRes, cogsRes, topProfitRes, fastRes, slowRes] =
        await Promise.all([
          getProfitLoss(),
          getCogs(),
          getTopProfitProducts(),
          getFastMoving(),
          getSlowMoving(),
        ]);

      setProfitLoss(profitRes.data);
      setCogs(cogsRes.data);

      setTopProfit(topProfitRes.data.results || topProfitRes.data);
      setFastMoving(fastRes.data.results || fastRes.data);
      setSlowMoving(slowRes.data.results || slowRes.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <SalesKPIs profitLoss={profitLoss} cogs={cogs} />

      <div className="grid xl:grid-cols-2 gap-6">
        <RevenueVsCogsChart profitLoss={profitLoss} />

        <ProfitMarginChart profitLoss={profitLoss} />
      </div>

      <TopProfitChart data={topProfit} />

      <div className="grid xl:grid-cols-2 gap-6">
        <FastMovingChart data={fastMoving} />

        <SlowMovingChart data={slowMoving} />
      </div>

      <TopProfitTable data={topProfit} />
    </div>
  );
}
