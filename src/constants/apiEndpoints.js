const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const API = {
  BASE_URL,

  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Users and profiles
  USERS: "/users",
  USER_IMPORT: "/users/import",
  STUDENT_PROFILE: "/students",
  STAFF_PROFILE: "/staff",
  PARENT_STUDENT: "/parent-student",

  // School setup
  SCHOOL_PROFILE: "/school/profile",
  SCHOOL_LOGO: "/school/logo",
  SETTINGS: "/settings",
  ACADEMIC_YEARS: "/academic-years",

  // Academics
  CLASSES: "/classes",
  SECTIONS: "/sections",
  SUBJECTS: "/subjects",
  CLASS_SUBJECTS: "/class-subjects",
  TIMETABLE: "/timetable",

  // Dashboards
  ADMIN_DASHBOARD_STATS: "/dashboard/admin/stats",
  TEACHER_DASHBOARD_STATS: "/dashboard/teacher/stats",
  STUDENT_DASHBOARD_STATS: "/dashboard/student/stats",
  PARENT_DASHBOARD_STATS: "/dashboard/parent/stats",
  ACCOUNTANT_DASHBOARD_STATS: "/dashboard/accountant/stats",
};
