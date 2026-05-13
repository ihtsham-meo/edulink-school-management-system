import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated } = useSelector((s) => s.auth);

  const login = (data) => dispatch(loginSuccess(data));
  const signOut = () => dispatch(logout());

  return { user, token, role, isAuthenticated, login, signOut };
}
