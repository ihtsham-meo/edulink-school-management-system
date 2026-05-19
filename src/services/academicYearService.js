import api from "./api";
import { API } from "../constants/apiEndpoints";

export const academicYearService = {
  getAll: (filters) => api.get(API.ACADEMIC_YEARS, { params: filters }),

  getById: (id) => api.get(`${API.ACADEMIC_YEARS}/${id}`),

  create: (data) => api.post(API.ACADEMIC_YEARS, data),

  update: (id, data) => api.put(`${API.ACADEMIC_YEARS}/${id}`, data),

  delete: (id) => api.delete(`${API.ACADEMIC_YEARS}/${id}`),

  setCurrent: (id) => api.patch(`${API.ACADEMIC_YEARS}/${id}/set-current`),
};
