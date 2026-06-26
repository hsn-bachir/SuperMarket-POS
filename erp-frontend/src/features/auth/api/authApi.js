import api from "@/api/axios";

export const login = (data) => {
  return api.post("/accounts/login/", data);
};

export const refreshToken = (data) => {
  return api.post("/accounts/token/refresh/", data);
};

export const getMe = () => {
  return api.get("/accounts/me/");
};