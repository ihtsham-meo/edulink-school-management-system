import api from "./api";
import { API } from "../constants/apiEndpoints";

export const dashboardService = {
  getAdminStats: () => api.get(API.ADMIN_DASHBOARD_STATS),

  getTeacherStats: () => api.get(API.TEACHER_DASHBOARD_STATS),

  getStudentStats: () => api.get(API.STUDENT_DASHBOARD_STATS),
};
