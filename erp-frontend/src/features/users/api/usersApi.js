import api from "@/api/axios";
export function getUsers(params) {
  return api.get("/accounts/users/", {
    params,
  });
}

export function getUser(id) {
  return api.get(`/accounts/users/${id}/`);
}

export function createUser(data) {
  return api.post("/accounts/users/", data);
}

export function updateUser(id, data) {
  return api.put(`/accounts/users/${id}/`, data);
}

export function deleteUser(id) {
  return api.delete(`/accounts/users/${id}/`);
}

export function getGroups() {
  return api.get("/accounts/groups/");
}