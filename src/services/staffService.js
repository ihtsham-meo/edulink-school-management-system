import api from "./api";
import { API } from "../constants/apiEndpoints";

export const staffService = {
  getAll: (filters = {}) =>
    api.get(API.USERS, { params: { ...filters, role: "Teacher" } }),

  getById: (id) => api.get(`${API.USERS}/${id}`),

  getProfile: (id) => api.get(`${API.STAFF_PROFILE}/${id}/profile`),

  updateProfile: (id, data) => api.put(`${API.STAFF_PROFILE}/${id}/profile`, data),

  create: (data) =>
    api.post(API.USERS, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "Teacher",
    }),

  update: (id, data) =>
    api.put(`${API.USERS}/${id}`, {
      name: data.name,
      email: data.email,
      status: data.status,
      role: "Teacher",
    }),

  delete: (id) => api.delete(`${API.USERS}/${id}`),
};
