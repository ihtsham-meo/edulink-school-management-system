import api from "./api";
import { API } from "../constants/apiEndpoints";

export const studentService = {
  getAll: (filters = {}) =>
    api.get(API.USERS, { params: { ...filters, role: "Student" } }),

  getById: (id) => api.get(`${API.USERS}/${id}`),

  getProfile: (id) => api.get(`${API.STUDENT_PROFILE}/${id}/profile`),

  updateProfile: (id, data) =>
    api.put(`${API.STUDENT_PROFILE}/${id}/profile`, data),

  create: (data) =>
    api.post(API.USERS, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "Student",
    }),

  createAdmission: async ({ user, profile }) => {
    const userResponse = await api.post(API.USERS, { ...user, role: "Student" });
    const createdUser = userResponse.data?.data || userResponse.data;
    const studentId = createdUser?.id || createdUser?.user?.id;

    if (studentId && profile) {
      await api.put(`${API.STUDENT_PROFILE}/${studentId}/profile`, profile);
    }

    return userResponse;
  },

  importCsv: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(API.USER_IMPORT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id, data) =>
    api.put(`${API.USERS}/${id}`, {
      name: data.name,
      email: data.email,
      status: data.status,
      role: "Student",
    }),

  delete: (id) => api.delete(`${API.USERS}/${id}`),
};
