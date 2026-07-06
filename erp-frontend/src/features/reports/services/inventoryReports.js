import {
  getInventorySummary,
  getInventoryValuation,
  getDeadStock,
  getStockAging,
  getReorderSuggestions,
} from "../api/reportsApi";

export async function loadInventoryReports(filters = {}) {
  const [
    summary,
    valuation,
    deadStock,
    aging,
    reorder,
  ] = await Promise.all([
    getInventorySummary(),
    getInventoryValuation(),
    getDeadStock(filters),
    getStockAging(),
    getReorderSuggestions(),
  ]);

  return {
    summary: summary.data,
    valuation: valuation.data.results ?? valuation.data,
    deadStock: deadStock.data.results ?? deadStock.data,
    stockAging: aging.data.results ?? aging.data,
    reorder: reorder.data.results ?? reorder.data,
  };
}