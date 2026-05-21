import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Sun, Moon, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { ROLES, normalizeRole } from "../../constants/roles";
import { authService } from "../../services/authService";

// ── Validation schema ──
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

// const roleRedirects = {
//   [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
//   [ROLES.TEACHER]: ROUTES.TEACHER_DASHBOARD,
//   [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
// };

// const getAuthError = (error) => {
//   const data = error.response?.data;

//   if (typeof data?.message === "string") {
//     return data.message;
//   }

//   if (data?.errors) {
//     const firstError = Object.values(data.errors).flat()[0];
//     if (firstError) return firstError;
//   }

//   if (error.code === "ERR_NETWORK") {
//     return "Cannot reach the backend. Check that the API server is running and CORS is enabled.";
//   }

//   return "Invalid email or password. Please try again.";
// ── Mock users for testing ──
const MOCK_USERS = {
  "admin@edulink.com": {
    password: "admin123",
    role: ROLES.ADMIN,
    name: "Super Admin",
    redirect: ROUTES.ADMIN_DASHBOARD,
  },
  "teacher@edulink.com": {
    password: "teacher123",
    role: ROLES.TEACHER,
    name: "Ms. Fatima Zahra",
    redirect: ROUTES.TEACHER_DASHBOARD,
  },
  "student@edulink.com": {
    password: "student123",
    role: ROLES.STUDENT,
    name: "Ali Hassan",
    redirect: ROUTES.STUDENT_DASHBOARD,
  },
  "accountant@edulink.com": {
    password: "accountant123",
    role: ROLES.ACCOUNTANT,
    name: "Mr. Accountant",
    redirect: "/accountant/dashboard",
  },
  "parent@edulink.com": {
    password: "parent123",
    role: ROLES.PARENT,
    name: "Mr. Parent",
    redirect: "/parent/dashboard",
  },
};

function Login() {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[data.email];

    // Check credentials
    if (!user || user.password !== data.password) {
      setAuthError("Invalid email or password. Please try again.");
      // try {
      //   const response = await authService.login({
      //     email: data.email,
      //     password: data.password,
      //   });
      //   const authData = response.data?.data || response.data;
      //   const backendUser = authData?.user || {};
      //   const token =
      //     authData?.token ||
      //     authData?.access_token ||
      //     authData?.plainTextToken ||
      //     authData?.plain_text_token;
      //   const role = normalizeRole(backendUser.role || authData?.role);
      //   const redirect = roleRedirects[role] || ROUTES.UNAUTHORIZED;

      //   login({
      //     user: {
      //       id: backendUser.id,
      //       name: backendUser.name,
      //       email: backendUser.email || data.email,
      //       role: backendUser.role || authData?.role,
      //       permissions: backendUser.permissions || [],
      //     },
      //     token,
      //     tokenType: authData?.token_type || "Bearer",
      //     role,
      //   });

      //   navigate(redirect, { replace: true });
      // } catch (error) {
      //   setAuthError(getAuthError(error));
      // } finally {
      setIsLoading(false);
      return;
    }

    // Login success — save to Redux
    login({
      user: { name: user.name, email: data.email },
      token: "mock-token-" + user.role,
      role: user.role,
    });

    // Redirect to role dashboard
    navigate(user.redirect, { replace: true });
    setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex">
      {/* ── Left panel — your UI ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black flex-col items-center justify-center p-12">
        {/* Animated blur circles */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-blue-600 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] bg-purple-600 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500 opacity-10 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-xl">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-white text-5xl font-semibold mb-4">EduLink</h1>
          <p
            className="text-white text-lg max-w-sm leading-relaxed"
            style={{ opacity: 0.8 }}
          >
            Complete School Management System for modern schools and colleges
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-12 justify-center">
            <div className="text-center">
              <div className="text-white text-2xl font-semibold">1,248</div>
              <div className="text-white text-sm mt-1" style={{ opacity: 0.7 }}>
                Students
              </div>
            </div>
            <div className="w-px bg-white opacity-20" />
            <div className="text-center">
              <div className="text-white text-2xl font-semibold">64</div>
              <div className="text-white text-sm mt-1" style={{ opacity: 0.7 }}>
                Teachers
              </div>
            </div>
            <div className="w-px bg-white opacity-20" />
            <div className="text-center">
              <div className="text-white text-2xl font-semibold">28</div>
              <div className="text-white text-sm mt-1" style={{ opacity: 0.7 }}>
                Classes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 w-9 h-9 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center text-light-text-secondary dark:text-dark-text-secondary hover:border-accent transition-colors"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div className="w-9 h-9 bg-gray-500 rounded-lg flex items-center justify-center">
                <GraduationCap size={20} color="white" />
              </div>
              <span className="text-light-text-primary dark:text-dark-text-primary text-lg font-semibold">
                EduLink
              </span>
            </div>
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-2xl font-semibold">
              Welcome back
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Auth error banner */}
          {authError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-light-text-primary dark:text-dark-text-primary text-sm font-medium">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@edulink.com"
                autoComplete="email"
                className={`w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-dark-card border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none transition-colors ${
                  errors.email
                    ? "border-red-400 dark:border-red-600"
                    : "border-light-border dark:border-dark-border focus:border-accent dark:focus:border-accent"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-light-text-primary dark:text-dark-text-primary text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-light-text-secondary dark:text-dark-text-secondary text-sm hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg bg-light-card dark:bg-dark-card border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 dark:border-red-600"
                      : "border-light-border dark:border-dark-border focus:border-accent dark:focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-secondary dark:hover:text-dark-text-secondary"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                {...register("remember")}
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-gray-700 rounded cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-light-text-secondary dark:text-dark-text-secondary text-sm cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-sm font-medium transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium mb-2">
              Demo accounts
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Admin: admin@edulink.com / admin123
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Teacher: teacher@edulink.com / teacher123
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Student: student@edulink.com / student123
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Accountant: accountant@edulink.com / accountant123
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Parent: parent@edulink.com / parent123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
