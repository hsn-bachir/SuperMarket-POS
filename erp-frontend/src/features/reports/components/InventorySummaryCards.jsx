import { Boxes, Package, DollarSign } from "lucide-react";

import useReports from "../hooks/useReports";
import { getInventorySummary } from "../api/reportsApi";

import KpiCard from "./KpiCard";

export default function InventorySummaryCards() {
  const { data, loading } = useReports(getInventorySummary);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="
              h-40
              animate-pulse
              rounded-3xl
              border border-gray-700
              bg-gray-900
            "
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        title="Products"
        value={data?.total_products ?? 0}
        subtitle="Active Products"
        icon={Boxes}
        type="products"
      />

      <KpiCard
        title="Stock Units"
        value={data?.total_units ?? 0}
        subtitle="Total Inventory Units"
        icon={Package}
        type="stock"
      />

      <KpiCard
        title="Inventory Value"
        value={`$${Number(data?.inventory_value ?? 0).toLocaleString()}`}
        subtitle="Current Stock Value"
        icon={DollarSign}
        type="value"
      />
    </div>
  );
}
