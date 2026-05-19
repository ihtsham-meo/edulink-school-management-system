import api from "./api";
import { API } from "../constants/apiEndpoints";

export const classService = {
  getAll: (filters) => api.get(API.CLASSES, { params: filters }),

  getById: (id) => api.get(`${API.CLASSES}/${id}`),

  create: (data) => api.post(API.CLASSES, data),

  update: (id, data) => api.put(`${API.CLASSES}/${id}`, data),

  delete: (id) => api.delete(`${API.CLASSES}/${id}`),
};
