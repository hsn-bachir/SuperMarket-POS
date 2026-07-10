import {
  getProfitLoss,
  getCogs,
  getTopProfitProducts,
  getFastMoving,
  getSlowMoving,
} from "../api/reportsApi";

export async function loadSalesReports(filters = {}) {
  const [
    profitLoss,
    cogs,
    topProfit,
    fastMoving,
    slowMoving,
  ] = await Promise.all([
    getProfitLoss(filters),

    getCogs(filters),

    getTopProfitProducts({
      ...filters,
      limit: 5,
    }),

    getFastMoving({
      ...filters,
      limit: 10,
    }),

    getSlowMoving({
      ...filters,
      limit: 10,
    }),
  ]);

  return {
    profitLoss: profitLoss.data,

    cogs: cogs.data,

    topProfit:
      topProfit.data.results ??
      topProfit.data,

    fastMoving:
      fastMoving.data.results ??
      fastMoving.data,

    slowMoving:
      slowMoving.data.results ??
      slowMoving.data,
  };
}