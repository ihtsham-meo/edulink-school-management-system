import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import StudentRoutes from "./StudentRoutes";
import AccountantRoutes from "./AccountantRoutes";
import ParentRoutes from "./ParentRoutes";

import Login from "../pages/auth/Login";
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Auth */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Portals */}
        {AdminRoutes()}
        {TeacherRoutes()}
        {StudentRoutes()}
        {AccountantRoutes()}
        {ParentRoutes()}

        {/* Errors */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
