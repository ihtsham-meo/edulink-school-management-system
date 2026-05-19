import api from "./api";
import { API } from "../constants/apiEndpoints";

export const subjectService = {
  getAll: (filters) => api.get(API.SUBJECTS, { params: filters }),

  getById: (id) => api.get(`${API.SUBJECTS}/${id}`),

  create: (data) => api.post(API.SUBJECTS, data),

  update: (id, data) => api.put(`${API.SUBJECTS}/${id}`, data),

  delete: (id) => api.delete(`${API.SUBJECTS}/${id}`),
};
