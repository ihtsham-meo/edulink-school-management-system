export const ROLES = {
  ADMIN:      'admin',
  TEACHER:    'teacher',
  STUDENT:    'student',
  ACCOUNTANT: 'accountant',
  PARENT:     'parent',
}
export const normalizeRole = (role) => {
  const normalized = String(role || "").trim().toLowerCase();

  if (["admin", "school admin", "super admin"].includes(normalized)) {
    return ROLES.ADMIN;
  }

  if (normalized === "teacher") {
    return ROLES.TEACHER;
  }

  if (normalized === "student") {
    return ROLES.STUDENT;
  }

  return normalized;
};
