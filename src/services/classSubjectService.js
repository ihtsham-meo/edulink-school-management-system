import api from "./api";
import { API } from "../constants/apiEndpoints";

export const classSubjectService = {
  getAll: (filters) => api.get(API.CLASS_SUBJECTS, { params: filters }),

  getById: (id) => api.get(`${API.CLASS_SUBJECTS}/${id}`),

  create: (data) => api.post(API.CLASS_SUBJECTS, data),

  createBulk: (data) => api.post(`${API.CLASS_SUBJECTS}/bulk`, data),

  update: (id, data) => api.put(`${API.CLASS_SUBJECTS}/${id}`, data),

  delete: (id) => api.delete(`${API.CLASS_SUBJECTS}/${id}`),
};
