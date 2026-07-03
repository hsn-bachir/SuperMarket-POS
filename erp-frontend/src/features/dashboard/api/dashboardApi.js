import api from "@/api/axios";

export const getDashboard = () =>
  api.get("/reports/dashboard/");

export const getInventorySummary = () =>
  api.get("/reports/inventory-summary/");

export const getProfitLoss = () =>
  api.get("/reports/profit-loss/");

export const getTopProfitProducts = () =>
  api.get("/reports/top-profit-products/");