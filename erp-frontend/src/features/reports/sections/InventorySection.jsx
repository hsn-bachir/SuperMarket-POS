import { useEffect, useState } from "react";

import { loadInventoryReports } from "../services/inventoryReports";

import InventorySummaryCards from "../components/InventorySummaryCards";
import StockAgingTable from "../components/StockAgingTable";
import DeadStockTable from "../components/DeadStockTable";
import InventoryValuationTable from "../components/InventoryValuationTable";
import ReorderSuggestionsTable from "../components/ReorderSuggestionsTable";

export default function InventorySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await loadInventoryReports();

      setData(res);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white dark:bg-gray-900 p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InventorySummaryCards summary={data.summary} />

      <StockAgingTable data={data.stockAging} />

      <DeadStockTable data={data.deadStock} />

      <InventoryValuationTable data={data.valuation} />

      <ReorderSuggestionsTable data={data.reorder} />
    </div>
  );
}
