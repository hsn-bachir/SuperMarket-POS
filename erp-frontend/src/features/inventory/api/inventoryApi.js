import api from "@/api/axios";

export const getInventory = (params = {}) =>
  api.get("/inventory/", { params });

export const createAdjustment = (data) =>
  api.post("/inventory/adjustment/", data);