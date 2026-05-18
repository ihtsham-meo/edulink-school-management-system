import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES, ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";
import TeacherLayout from "../components/layout/TeacherLayout";
import StudentLayout from "../components/layout/StudentLayout";
import StudentList from "../pages/students/StudentList";
import StudentAttendance from "../pages/attendance/StudentAttendence";
import FeeManagement from "../pages/fees/FeeManagement";
import AssignmentList from "../pages/assignments/AssignmentList";
import ExamList from "../pages/exams/ExamList";
import StaffList from "../pages/staff/StaffList";
import GeneralSettings from "../pages/settings/GeneralSettings";
import Noticeboard from "../pages/noticeboard/Noticeboard";
import Profile from "../pages/profile/Profile";
import ClassList from "../pages/classes/ClassList";
import ManageTimetable from "../pages/timetable/ManageTimetable";
import ManageSalaries from '../pages/salary/ManageSalaries'
import BehaviorRecording from '../pages/behavior/BehaviorRecording'
import LibraryManagement from '../pages/library/LibraryManagement'
import VisitorManagement from '../pages/visitor/VisitorManagement'
import HealthRecords from '../pages/health/HealthRecords'
import AlumniManagement from '../pages/alumni/AlumniManagement'
import SportsActivities from '../pages/sports/SportsActivities'
import StudyMaterials from '../pages/study-materials/StudyMaterials'
import HomeworkDiary from '../pages/diary/HomeworkDiary'
import QuizList from '../pages/quiz/QuizList'
import GradesResults from '../pages/grades/GradesResults'
import Communications from '../pages/communications/Communications'
import TransportRoutes  from '../pages/transport/TransportRoutes'
import Inventory from '../pages/inventory/Inventory'


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
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="assignments" element={<AssignmentList />} />
          <Route path="exams" element={<ExamList />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="settings" element={<GeneralSettings />} />
          <Route path="noticeboard" element={<Noticeboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="salary" element={<ManageSalaries />} />
          <Route path="behavior" element={<BehaviorRecording />} />
          <Route path="library" element={<LibraryManagement />} />
          <Route path="visitor" element={<VisitorManagement />} />
          <Route path="health" element={<HealthRecords />} />
          <Route path="alumni" element={<AlumniManagement />} />
          <Route path="sports" element={<SportsActivities />} />
          <Route path="study-materials" element={<StudyMaterials />} />
          <Route path="diary" element={<HomeworkDiary />} />
          <Route path="quiz" element={<QuizList />} />
          <Route path="grades" element={<GradesResults />} />
          <Route path="communications" element={<Communications />} />
          <Route path="transport" element={<TransportRoutes />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="behavior" element={<BehaviorRecording />} />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Errors */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
