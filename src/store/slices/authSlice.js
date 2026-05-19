import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
};

const storedAuth = getStoredAuth();

const initialState = storedAuth || {
  user: null,
  token: null,
  tokenType: "Bearer",
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenType = action.payload.tokenType || "Bearer";
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenType = "Bearer";
      state.role = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
