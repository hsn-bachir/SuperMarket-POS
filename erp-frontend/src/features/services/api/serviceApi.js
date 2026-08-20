import api from "@/api/axios";

// ==========================================
// Service API Endpoints
// ==========================================

export const getServices = (page = 1, search = "") =>
  api.get("/services/", {
    params: {
      page,
      search,
    },
  });

export const getService = (id) =>
  api.get(`/services/${id}/`);

export const createService = (data) =>
  api.post("/services/", data);

export const updateService = (id, data) =>
  api.put(`/services/${id}/`, data);

export const patchService = (id, data) =>
  api.patch(`/services/${id}/`, data);

export const deleteService = (id) =>
  api.delete(`/services/${id}/`);

// ==========================================
// Service Price History
// ==========================================

export const getServicePriceHistories = (
  page = 1,
  search = "",
) =>
  api.get("/services/price-history/", {
    params: {
      page,
      search,
    },
  });

export const getServicePriceHistory = (id) =>
  api.get(`/services/price-history/${id}/`);