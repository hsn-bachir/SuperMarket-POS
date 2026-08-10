import api from "@/api/axios";

export const getPeriods = () =>
  api.get("/accounting/periods/");

export const getCurrentPeriod = () =>
  api.get("/accounting/periods/current/");

export const createPeriod = (data) =>
  api.post("/accounting/periods/", data);

export const generateNextPeriod = () =>
  api.post("/accounting/periods/generate-next/");

export const closePeriod = (id) =>
  api.post(`/accounting/periods/${id}/close/`);

export const reopenPeriod = (id) =>
  api.post(`/accounting/periods/${id}/reopen/`);