import {
  getProfitLoss,
  getTopProfitProducts,
  getFastMoving,
  getSlowMoving,
} from "../api/reportApi";

export async function getSalesReport(filters = {}) {
  const [
    profit,
    topProfit,
    fastMoving,
    slowMoving,
  ] = await Promise.all([
    getProfitLoss(filters),
    getTopProfitProducts(filters),
    getFastMoving(filters),
    getSlowMoving(filters),
  ]);

  return {
    profit: profit.data,
    topProfit: topProfit.data.results ?? topProfit.data,
    fastMoving: fastMoving.data.results ?? fastMoving.data,
    slowMoving: slowMoving.data.results ?? slowMoving.data,
  };
}