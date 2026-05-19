import api from "./api";
import { API } from "../constants/apiEndpoints";

export const timetableService = {
  getAll: (filters) => api.get(API.TIMETABLE, { params: filters }),

  getById: (id) => api.get(`${API.TIMETABLE}/${id}`),

  create: (data) => api.post(API.TIMETABLE, data),

  update: (id, data) => api.put(`${API.TIMETABLE}/${id}`, data),

  delete: (id) => api.delete(`${API.TIMETABLE}/${id}`),
};
