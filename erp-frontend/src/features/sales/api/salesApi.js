import api from "@/api/axios";

export function getSales(params = {}) {
  return api.get("/sales/", {
    params,
  });
}

export const getSale = (id) =>
  api.get(`/sales/${id}/`);

export const createSale = (data) =>
  api.post("/sales/", data);

export const updateSale = (id, data) =>
  api.put(`/sales/${id}/`, data);

export const deleteSale = (id) =>
  api.delete(`/sales/${id}/`);

export function getDefault(params = {}) {
  return api.get("/config/default/", {
    params,
  });
}