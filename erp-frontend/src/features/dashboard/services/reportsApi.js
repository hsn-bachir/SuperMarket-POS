import apiClient from "@/services/apiClient";

export const getDashboard = () =>
  apiClient.get("/dashboard/");