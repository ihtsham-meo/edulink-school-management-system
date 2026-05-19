export const ROUTES = {
  // Auth
  LOGIN: "/login",
  FORGOT: "/forgot-password",
  RESET: "/reset-password",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_STUDENT_ADD: "/admin/students/add",
  ADMIN_STUDENT_BULK: "/admin/students/bulk",
  ADMIN_STUDENT_FAMILIES: "/admin/students/families",
  ADMIN_STUDENT_ACTIVE_INACTIVE: "/admin/students/active-inactive",
  ADMIN_STUDENT_PRINT_LIST: "/admin/students/print-list",
  ADMIN_STUDENT_ADMISSION_LETTERS: "/admin/students/admission-letters",
  ADMIN_STUDENT_ID_CARDS: "/admin/students/id-cards",
  ADMIN_STUDENT_LOGINS: "/admin/students/logins",
  ADMIN_STUDENT_PROMOTE: "/admin/students/promote",
  ADMIN_TEACHERS: "/admin/staff",
  ADMIN_CLASSES: "/admin/classes",
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_ASSIGNMENTS: "/admin/assignments",
  ADMIN_TESTS: "/admin/tests",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_FEES: "/admin/fees",
  ADMIN_EXPENSES: "/admin/expenses",
  ADMIN_SALARY: "/admin/salary",
  ADMIN_BEHAVIOR: "/admin/behavior",
  ADMIN_STUDY_MATERIALS: "/admin/study-materials",
  ADMIN_DIARY: "/admin/diary",
  ADMIN_QUIZ: "/admin/quiz",
  ADMIN_GRADES: "/admin/grades",
  ADMIN_TRANSPORT: "/admin/transport",
  ADMIN_INVENTORY: "/admin/inventory",
  ADMIN_SETTINGS: "/admin/settings",

  // Teacher
  TEACHER_DASHBOARD: "/teacher/dashboard",
  TEACHER_STUDENTS: "/teacher/students",
  TEACHER_ATTENDANCE: "/teacher/attendance",
  TEACHER_ASSIGNMENTS: "/teacher/assignments",
  TEACHER_GRADES: "/teacher/grades",
  TEACHER_BEHAVIOR: "/teacher/behavior",

  // Student
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_ASSIGNMENTS: "/student/assignments",
  STUDENT_RESULTS: "/student/results",
  STUDENT_ATTENDANCE: "/student/attendance",
  STUDENT_FEES: "/student/fees",

  // Errors
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/403",
};

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};
