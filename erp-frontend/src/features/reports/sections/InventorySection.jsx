import { useEffect, useState } from "react";

import { loadInventoryReports } from "../services/inventoryReports";

import InventorySummaryCards from "../components/InventorySummaryCards";
import StockAgingTable from "../components/StockAgingTable";
import DeadStockTable from "../components/DeadStockTable";
import InventoryValuationTable from "../components/InventoryValuationTable";
import ReorderSuggestionsTable from "../components/ReorderSuggestionsTable";

export default function InventorySection({ filters }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pages, setPages] = useState({
    valuation: 1,
    deadStock: 1,
    stockAging: 1,
    reorder: 1,
  });

  useEffect(() => {
    setPages({
      valuation: 1,
      deadStock: 1,
      stockAging: 1,
      reorder: 1,
    });
  }, [filters]);

  useEffect(() => {
    let active = true;

    async function fetchReports() {
      setLoading(true);

      try {
        console.log("Inventory filters:", filters);

        const res = await loadInventoryReports({
          ...filters,

          valuationPage: pages.valuation,
          deadStockPage: pages.deadStock,
          stockAgingPage: pages.stockAging,
          reorderPage: pages.reorder,
        });

        if (active) {
          setData(res);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      active = false;
    };
  }, [
    filters,
    pages.valuation,
    pages.deadStock,
    pages.stockAging,
    pages.reorder,
  ]);

  if (loading || !data) {
    return (
      <div
        className="
        rounded-3xl
        border
        border-gray-700
        bg-gray-900
        p-8
        text-gray-300
      "
      >
        Loading inventory reports...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InventorySummaryCards summary={data.summary} />

      <StockAgingTable
        data={data.stockAging.results}
        count={data.stockAging.count}
        page={pages.stockAging}
        setPage={(page) =>
          setPages((prev) => ({
            ...prev,
            stockAging: page,
          }))
        }
      />

      <DeadStockTable
        data={data.deadStock.results}
        count={data.deadStock.count}
        page={pages.deadStock}
        setPage={(page) =>
          setPages((prev) => ({
            ...prev,
            deadStock: page,
          }))
        }
      />

      <InventoryValuationTable
        data={data.valuation.results}
        count={data.valuation.count}
        page={pages.valuation}
        setPage={(page) =>
          setPages((prev) => ({
            ...prev,
            valuation: page,
          }))
        }
      />

      <ReorderSuggestionsTable
        data={data.reorder.results}
        count={data.reorder.count}
        page={pages.reorder}
        setPage={(page) =>
          setPages((prev) => ({
            ...prev,
            reorder: page,
          }))
        }
      />
    </div>
  );
}
