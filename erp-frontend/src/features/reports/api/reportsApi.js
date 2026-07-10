import api from "@/api/axios";

export const getInventorySummary = (params) =>
  api.get("/reports/inventory-summary/", { params });

export const getInventoryValuation = (params) =>
  api.get("/reports/inventory-valuation/", { params });

export const getDeadStock = (params) =>
  api.get("/reports/dead-stock/", { params });

export const getStockAging = (params) =>
  api.get("/reports/stock-aging/", { params });

export const getReorderSuggestions = (params) =>
  api.get("/reports/reorder-suggestions/", { params });

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

export const getCogs = (params) =>
    api.get("/reports/cogs/", { params });