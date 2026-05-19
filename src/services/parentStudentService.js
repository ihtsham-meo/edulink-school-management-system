import api from "./api";
import { API } from "../constants/apiEndpoints";

export const parentStudentService = {
  link: (data) => api.post(API.PARENT_STUDENT, data),

  getStudentParents: (studentId) =>
    api.get(`${API.STUDENT_PROFILE}/${studentId}/parents`),

  getParentChildren: (parentId) =>
    api.get(`/parents/${parentId}/children`),

  unlink: (id) => api.delete(`${API.PARENT_STUDENT}/${id}`),
};
