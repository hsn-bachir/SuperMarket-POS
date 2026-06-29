import api from "@/api/axios";

export const getProducts = (params = {}) =>
  api.get("/products/", { params });

export const getProduct = (id) =>
  api.get(`/products/${id}/`);

export const createProduct = (data) =>
  api.post("/products/create/", data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}/update/`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}/delete/`);