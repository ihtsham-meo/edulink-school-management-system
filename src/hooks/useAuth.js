import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "../store/slices/authSlice";
import { authService } from "../services/authService";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated } = useSelector((s) => s.auth);

  const login = (data) => {
    localStorage.setItem(
      "auth",
      JSON.stringify({ ...data, isAuthenticated: true }),
    );
    dispatch(loginSuccess(data));
  };

  const clearAuth = () => {
    localStorage.removeItem("auth");
    dispatch(logout());
  };

  const signOut = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // Clear local auth even if the token is already expired server-side.
    } finally {
      clearAuth();
    }
  };

  return { user, token, role, isAuthenticated, login, signOut };
}
