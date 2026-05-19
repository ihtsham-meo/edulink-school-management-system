import api from "./api";
import { API } from "../constants/apiEndpoints";

export const authService = {
  login: (credentials) => api.post(API.LOGIN, credentials),

  logout: () => api.post(API.LOGOUT),

  me: () => api.get(API.ME),

  forgotPassword: (email) => api.post(API.FORGOT_PASSWORD, { email }),

  resetPassword: (data) => api.post(API.RESET_PASSWORD, data),
};
