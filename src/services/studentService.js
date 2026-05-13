import api from './api'
import { API } from '../constants/apiEndpoints'

export const studentService = {
  getAll: (filters) =>
    api.get(API.STUDENTS, { params: filters }),

  getById: (id) =>
    api.get(`${API.STUDENTS}/${id}`),

  create: (data) =>
    api.post(API.STUDENTS, data),

  update: (id, data) =>
    api.put(`${API.STUDENTS}/${id}`, data),

  delete: (id) =>
    api.delete(`${API.STUDENTS}/${id}`),
}