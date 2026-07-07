import api from "@/api/axios";

export const getCategories = (
    page = 1,
    search = "",
) =>
    api.get("/products/category/", {
        params: {
            page,
            search,
        },
    });

export const getCategory = (id) =>
  api.get(`/products/${id}/category/`);

export const createCategory = (data) =>
  api.post("/products/create/category/", data);

export const updateCategory = (id, data) =>
  api.put(`/products/${id}/update/category/`, data);

export const deleteCategory = (id) =>
  api.delete(`/products/${id}/delete/category/`);