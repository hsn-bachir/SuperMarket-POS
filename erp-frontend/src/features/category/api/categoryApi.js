import api from "@/api/axios";

export const getCategories = (params = {}) =>
  api.get("/products/category/", { params });

export const getCategory = (id) =>
  api.get(`/products/${id}/`);

export const createCategory = (data) =>
  api.post("/products/create/category/", data);

export const updateCategory = (id, data) =>
  api.put(`/products/${id}/update/category/`, data);

export const deleteCategory = (id) =>
  api.delete(`/products/${id}/delete/category/`);