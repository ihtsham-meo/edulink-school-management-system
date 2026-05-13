import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES, ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoutes";
// Auth
import Login from "../pages/auth/Login";

// Dashboards
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";

// Errors
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Auth routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path={ROUTES.TEACHER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Error routes */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
