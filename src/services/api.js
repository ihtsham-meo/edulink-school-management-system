import axios from "axios";
import { API } from "../constants/apiEndpoints";
import store from "../store";
import { logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor — attach token to every request
api.interceptors.request.use(
  (config) => {
    const { token, tokenType = "Bearer" } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expired or unauthorized — auto logout
    const isLoginRequest = error.config?.url?.includes(API.LOGIN);

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("auth");
      store.dispatch(logout());
      window.location.href = "/login";
    }

    // Server error
    if (status === 500) {
      console.error("Server error — please try again later");
    }

    return Promise.reject(error);
  },
);

export default api;
