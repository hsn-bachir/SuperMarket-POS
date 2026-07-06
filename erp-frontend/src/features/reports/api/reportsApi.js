import api from "@/api/axios";

export const getInventorySummary = () =>
  api.get("/reports/inventory-summary/");

export const getInventoryValuation = () =>
  api.get("/reports/inventory-valuation/");

export const getDeadStock = (params) =>
  api.get("/reports/dead-stock/", { params });

export const getStockAging = () =>
  api.get("/reports/stock-aging/");

export const getReorderSuggestions = () =>
  api.get("/reports/reorder-suggestions/");

export const getFastMoving = (params) =>
  api.get("/reports/fast-moving/", { params });

export const getSlowMoving = (params) =>
  api.get("/reports/slow-moving/", { params });

export const getTopProfitProducts = (params) =>
  api.get("/reports/top-profit-products/", { params });

export const getCOGS = (params) =>
  api.get("/reports/cogs/", { params });

export const getProfitLoss = (params) =>
  api.get("/reports/profit-loss/", { params });