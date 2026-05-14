import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Logged in but wrong role → go to unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}

export default ProtectedRoute;
