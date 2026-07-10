import {
  getInventorySummary,
  getInventoryValuation,
  getDeadStock,
  getStockAging,
  getReorderSuggestions,
} from "../api/reportsApi";

export async function loadInventoryReports({
  valuationPage = 1,
  deadStockPage = 1,
  stockAgingPage = 1,
  reorderPage = 1,
  ...filters
} = {}) {

  const [
    summary,
    valuation,
    deadStock,
    aging,
    reorder,
  ] = await Promise.all([

    getInventorySummary(filters),

    getInventoryValuation({
      ...filters,
      page: valuationPage,
    }),

    getDeadStock({
      ...filters,
      page: deadStockPage,
    }),

    getStockAging({
      ...filters,
      page: stockAgingPage,
    }),

    getReorderSuggestions({
      ...filters,
      page: reorderPage,
    }),
  ]);


  return {
    summary: summary.data,

    valuation: valuation.data ?? {
      results: [],
      count: 0,
    },

    deadStock: deadStock.data ?? {
      results: [],
      count: 0,
    },

    stockAging: aging.data ?? {
      results: [],
      count: 0,
    },

    reorder: reorder.data ?? {
      results: [],
      count: 0,
    },
  };
}