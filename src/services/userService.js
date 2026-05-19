import api from "./api";
import { API } from "../constants/apiEndpoints";

export const userService = {
  getAll: (filters) => api.get(API.USERS, { params: filters }),

  getById: (id) => api.get(`${API.USERS}/${id}`),

  create: (data) => api.post(API.USERS, data),

  update: (id, data) => api.put(`${API.USERS}/${id}`, data),

  delete: (id) => api.delete(`${API.USERS}/${id}`),
};
