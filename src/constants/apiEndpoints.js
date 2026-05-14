const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const API = {
  BASE_URL,

  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Students
  STUDENTS: "/students",

  // Staff
  STAFF: "/staff",

  // Attendance
  ATTENDANCE: "/attendance/students",

  // Assignments
  ASSIGNMENTS: "/assignments",

  // Fees
  INVOICES: "/invoices",
  PAYMENTS: "/payments",

  // Exams
  EXAMS: "/exams",
  TESTS: "/tests",
};
