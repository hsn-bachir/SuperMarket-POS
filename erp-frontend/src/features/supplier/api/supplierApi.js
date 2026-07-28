import api from "@/api/axios";

export const getSuppliers = (
  page = 1,
  search = "",
) =>
  api.get("/suppliers/", {
    params: {
      page,
      search,
    },
  });

  export const getListSuppliers = (params = {}) =>
    api.get("/suppliers/", {
    params,
  });

export const getSupplier = (id) =>
  api.get(`/suppliers/${id}/`);

export const createSupplier = (data) =>
  api.post("/suppliers/create/", data);

export const updateSupplier = (id, data) =>
  api.put(`/suppliers/${id}/update/`, data);

export const deleteSupplier = (id) =>
  api.delete(`/suppliers/${id}/delete/`);