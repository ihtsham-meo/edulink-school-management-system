export const ROUTES = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  LOGIN: "/login",
  FORGOT: "/forgot-password",
  RESET: "/reset-password",

  // ─── Admin ───────────────────────────────────────────────────────────────
  ADMIN_DASHBOARD: "/admin/dashboard",

  // Students
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_STUDENT_DETAIL: "/admin/students/:id",
  ADMIN_STUDENT_ADD: "/admin/students/add",
  ADMIN_STUDENT_BULK: "/admin/students/bulk",
  ADMIN_STUDENT_FAMILIES: "/admin/students/families",
  ADMIN_STUDENT_ACTIVE_INACTIVE: "/admin/students/active-inactive",
  ADMIN_STUDENT_PRINT_LIST: "/admin/students/print-list",
  ADMIN_STUDENT_ADMISSION_LETTERS: "/admin/students/admission-letters",
  ADMIN_STUDENT_ID_CARDS: "/admin/students/id-cards",
  ADMIN_STUDENT_LOGINS: "/admin/students/logins",
  ADMIN_STUDENT_PROMOTE: "/admin/students/promote",

  // Admissions
  ADMIN_ADMISSIONS: "/admin/admissions",
  ADMIN_ADMISSION_REQUESTS: "/admin/admissions/requests",
  ADMIN_ADMISSION_INQUIRIES: "/admin/admissions/inquiries",
  ADMIN_ADMISSION_BULK: "/admin/admissions/bulk",

  // People
  ADMIN_STAFF: "/admin/staff",
  ADMIN_STAFF_DETAIL: "/admin/staff/:id",
  ADMIN_CLASSES: "/admin/classes",

  // Academic
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_ATTENDANCE_REPORTS: "/admin/attendance/reports",
  ADMIN_ATTENDANCE_STAFF: "/admin/attendance/staff",
  ADMIN_TIMETABLE: "/admin/timetable",
  ADMIN_ASSIGNMENTS: "/admin/assignments",
  ADMIN_ASSIGNMENT_CREATE: "/admin/assignments/create",
  ADMIN_ASSIGNMENT_SUBMISSIONS: "/admin/assignments/submissions",
  ADMIN_ASSIGNMENT_GRADE: "/admin/assignments/grade",

  TEACHER_ASSIGNMENTS: "/teacher/assignments",
  TEACHER_ASSIGNMENT_CREATE: "/teacher/assignments/create",
  TEACHER_ASSIGNMENT_GRADE: "/teacher/assignments/grade",
  ADMIN_STUDY_MATERIALS: "/admin/study-materials",
  ADMIN_DIARY: "/admin/diary",
  ADMIN_TESTS: "/admin/tests",
  ADMIN_TEST_MARKS_ENTRY: "/admin/tests/marks-entry",
  ADMIN_TEST_TABULATION: "/admin/tests/tabulation",
  ADMIN_TEST_SCHEDULE: "/admin/tests/schedule",
  ADMIN_QUIZ: "/admin/quiz",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_EXAM_MARKS_ENTRY: "/admin/exams/marks-entry",
  ADMIN_EXAM_ADMIT_CARDS: "/admin/exams/admit-cards",
  ADMIN_EXAM_MARKSHEETS: "/admin/exams/marksheets",
  ADMIN_EXAM_TIMETABLE: "/admin/exams/timetable",
  ADMIN_EXAM_MARKS_ENTRY: "/admin/exams/marks-entry",
  ADMIN_EXAM_ADMIT_CARDS: "/admin/exams/admit-cards",
  ADMIN_EXAM_MARKSHEETS: "/admin/exams/marksheets",
  ADMIN_EXAM_TIMETABLE: "/admin/exams/timetable",
  ADMIN_GRADES: "/admin/grades",
  ADMIN_BEHAVIOR: "/admin/behavior",

  // Finance
  ADMIN_FEES: "/admin/fees",
  ADMIN_FEE_VOUCHERS: "/admin/fees/vouchers",
  ADMIN_FEE_DEFAULTERS: "/admin/fees/defaulters",
  ADMIN_FEE_GENERATE: "/admin/fees/generate",
  ADMIN_EXPENSES: "/admin/expenses",
  ADMIN_SALARY: "/admin/salary",
  ADMIN_SALARY_LOANS: "/admin/salary/loans",
  ADMIN_SALARY_REPORTS: "/admin/salary/reports",

  // Activities
  ADMIN_LIBRARY: "/admin/library",
  ADMIN_SPORTS: "/admin/sports",
  ADMIN_HEALTH: "/admin/health",
  ADMIN_GAMIFICATION: "/admin/gamification",
  ADMIN_INVENTORY: "/admin/inventory",
  ADMIN_ALUMNI: "/admin/alumni",

  // Administration
  ADMIN_VISITOR: "/admin/visitor",
  ADMIN_NOTICEBOARD: "/admin/noticeboard",
  ADMIN_COMMUNICATIONS: "/admin/communications",
  ADMIN_TRANSPORT: "/admin/transport",
  ADMIN_ID_CARDS: "/admin/id-cards",
  ADMIN_ID_CARDS_SETTINGS: "/admin/id-cards/settings",
  ADMIN_CERTIFICATES: "/admin/certificates",
  ADMIN_ONLINE_CLASSES: "/admin/online-classes",

  // Parents
  ADMIN_PARENTS: "/admin/parents",
  ADMIN_FAMILY_WALLET: "/admin/parents/wallet",

  // System
  ADMIN_SYSTEM: "/admin/system",
  ADMIN_WEBSITE: "/admin/website",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_PROFILE: "/admin/profile",

  // ─── Teacher ─────────────────────────────────────────────────────────────
  TEACHER_DASHBOARD: "/teacher/dashboard",
  TEACHER_STUDENTS: "/teacher/students",
  TEACHER_TIMETABLE: "/teacher/timetable",
  TEACHER_ATTENDANCE: "/teacher/attendance",
  TEACHER_ATTENDANCE_REPORTS: "/teacher/attendance/reports",
  TEACHER_BEHAVIOR: "/teacher/behavior",
  TEACHER_SUBMISSIONS: "/teacher/submissions",
  TEACHER_GRADES: "/teacher/grades",
  TEACHER_TESTS: "/teacher/tests",
  TEACHER_TEST_MARKS_ENTRY: "/teacher/tests/marks-entry",
  TEACHER_TEST_TABULATION: "/teacher/tests/tabulation",
  TEACHER_TEST_SCHEDULE: "/teacher/tests/schedule",
  TEACHER_EXAMS: "/teacher/exams",
  TEACHER_EXAM_MARKS_ENTRY: "/teacher/exams/marks-entry",
  TEACHER_EXAM_ADMIT_CARDS: "/teacher/exams/admit-cards",
  TEACHER_EXAM_MARKSHEETS: "/teacher/exams/marksheets",
  TEACHER_EXAM_TIMETABLE: "/teacher/exams/timetable",
  TEACHER_EXAM_MARKS_ENTRY: "/teacher/exams/marks-entry",
  TEACHER_EXAM_ADMIT_CARDS: "/teacher/exams/admit-cards",
  TEACHER_EXAM_MARKSHEETS: "/teacher/exams/marksheets",
  TEACHER_EXAM_TIMETABLE: "/teacher/exams/timetable",
  TEACHER_RESULTS: "/teacher/results",
  TEACHER_STUDY_MATERIALS: "/teacher/study-materials",
  TEACHER_DIARY: "/teacher/diary",
  TEACHER_NOTICEBOARD: "/teacher/noticeboard",
  TEACHER_LEAVE: "/teacher/leave",
  TEACHER_PROFILE: "/teacher/profile",

  // ─── Student ─────────────────────────────────────────────────────────────
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_ATTENDANCE: "/student/attendance",
  STUDENT_TIMETABLE: "/student/timetable",
  STUDENT_ASSIGNMENTS: "/student/assignments",
  STUDENT_RESULTS: "/student/results",
  STUDENT_EXAMS: "/student/exams",
  STUDENT_STUDY_MATERIALS: "/student/study-materials",
  STUDENT_FEES: "/student/fees",
  STUDENT_DIARY: "/student/diary",
  STUDENT_NOTICEBOARD: "/student/noticeboard",
  STUDENT_SPORTS: "/student/sports",
  STUDENT_PROFILE: "/student/profile",

  // ─── Accountant ──────────────────────────────────────────────────────────
  ACCOUNTANT_DASHBOARD: "/accountant/dashboard",
  ACCOUNTANT_FEE_PAYMENT: "/accountant/fee-payment",
  ACCOUNTANT_FEE_VOUCHERS: "/accountant/fee-vouchers",
  ACCOUNTANT_DEFAULTERS: "/accountant/defaulters",
  ACCOUNTANT_EXPENSES: "/accountant/expenses",
  ACCOUNTANT_BALANCE_SHEET: "/accountant/balance-sheet",
  ACCOUNTANT_REPORTS: "/accountant/reports",
  ACCOUNTANT_PROFILE: "/accountant/profile",

  // ─── Parent ──────────────────────────────────────────────────────────────
  PARENT_DASHBOARD: "/parent/dashboard",
  PARENT_ATTENDANCE: "/parent/attendance",
  PARENT_RESULTS: "/parent/results",
  PARENT_ASSIGNMENTS: "/parent/assignments",
  PARENT_TIMETABLE: "/parent/timetable",
  PARENT_HEALTH: "/parent/health",
  PARENT_SPORTS: "/parent/sports",
  PARENT_FEES: "/parent/fees",
  PARENT_DIARY: "/parent/diary",
  PARENT_NOTICEBOARD: "/parent/noticeboard",
  PARENT_PROFILE: "/parent/profile",

  // ─── Errors ──────────────────────────────────────────────────────────────
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/403",
};

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  ACCOUNTANT: "accountant",
  PARENT: "parent",
};