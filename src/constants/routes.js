export const ROUTES = {
  // Auth
  LOGIN:          '/login',
  FORGOT:         '/forgot-password',
  RESET:          '/reset-password',

  // Admin
  ADMIN_DASHBOARD:    '/admin/dashboard',
  ADMIN_STUDENTS:     '/admin/students',
  ADMIN_TEACHERS:     '/admin/staff',
  ADMIN_CLASSES:      '/admin/classes',
  ADMIN_ATTENDANCE:   '/admin/attendance',
  ADMIN_ASSIGNMENTS:  '/admin/assignments',
  ADMIN_TESTS:        '/admin/tests',
  ADMIN_EXAMS:        '/admin/exams',
  ADMIN_FEES:         '/admin/fees',
  ADMIN_SALARY:       '/admin/salary',
  ADMIN_SETTINGS:     '/admin/settings',

  // Teacher
  TEACHER_DASHBOARD:    '/teacher/dashboard',
  TEACHER_STUDENTS:     '/teacher/students',
  TEACHER_ATTENDANCE:   '/teacher/attendance',
  TEACHER_ASSIGNMENTS:  '/teacher/assignments',
  TEACHER_GRADES:       '/teacher/grades',

  // Student
  STUDENT_DASHBOARD:    '/student/dashboard',
  STUDENT_ASSIGNMENTS:  '/student/assignments',
  STUDENT_RESULTS:      '/student/results',
  STUDENT_ATTENDANCE:   '/student/attendance',
  STUDENT_FEES:         '/student/fees',

  // Errors
  NOT_FOUND:      '/404',
  UNAUTHORIZED:   '/403',
}

export const ROLES = {
  ADMIN:   'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
}