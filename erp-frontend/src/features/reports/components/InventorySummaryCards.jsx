import { Boxes, Package, DollarSign } from "lucide-react";

import useReports from "../hooks/useReports";

import { getInventorySummary } from "../api/reportsApi";

import KpiCard from "./KpiCard";

export default function InventorySummaryCards() {
  const { data, loading } = useReports(getInventorySummary);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <KpiCard
        title="Products"
        value={data.total_products}
        icon={Boxes}
        color="bg-blue-600"
      />

      <KpiCard
        title="Stock Units"
        value={data.total_units}
        icon={Package}
        color="bg-emerald-600"
      />

      <KpiCard
        title="Inventory Value"
        value={`$${Number(data.inventory_value).toLocaleString()}`}
        icon={DollarSign}
        color="bg-violet-600"
      />
    </div>
  );
}
