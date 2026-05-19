import api from "./api";
import { API } from "../constants/apiEndpoints";

export const sectionService = {
  getAll: (filters) => api.get(API.SECTIONS, { params: filters }),

  getById: (id) => api.get(`${API.SECTIONS}/${id}`),

  create: (data) => api.post(API.SECTIONS, data),

  update: (id, data) => api.put(`${API.SECTIONS}/${id}`, data),

  delete: (id) => api.delete(`${API.SECTIONS}/${id}`),
};
