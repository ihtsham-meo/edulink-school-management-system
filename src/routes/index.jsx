import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES, ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";
import TeacherLayout from "../components/layout/TeacherLayout";
import StudentLayout from "../components/layout/StudentLayout";
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import AddBulkStudents from "../pages/students/AddBulkStudents";
import ManageFamilies from "../pages/students/ManageFamilies";
import ActiveInactiveStudents from "../pages/students/ActiveInactiveStudents";
import AdmissionLetters from "../pages/students/AdmissionLetters";
import StudentIdCards from "../pages/students/StudentIdCards";
import StudentLogins from "../pages/students/StudentLogins";
import PromoteStudents from "../pages/students/PromoteStudents";
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
import ManageSalaries from "../pages/salary/ManageSalaries";
import BehaviorRecording from "../pages/behavior/BehaviorRecording";
import LibraryManagement from "../pages/library/LibraryManagement";
import VisitorManagement from "../pages/visitor/VisitorManagement";
import HealthRecords from "../pages/health/HealthRecords";
import AlumniManagement from "../pages/alumni/AlumniManagement";
import SportsActivities from "../pages/sports/SportsActivities";
import StudyMaterials from "../pages/study-materials/StudyMaterials";
import HomeworkDiary from "../pages/diary/HomeworkDiary";
import TestList from "../pages/tests/TestList";
import QuizList from "../pages/quiz/QuizList";
import GradesResults from "../pages/grades/GradesResults";
import Communications from "../pages/communications/Communications";
import TransportRoutes from "../pages/transport/TransportRoutes";
import Inventory from "../pages/inventory/Inventory";
import ExpenseManagement from "../pages/expenses/ExpenseManagement";
import Gamification from "../pages/gamification/Gamification";
import SystemBackups from "../pages/system/SystemBackups";

//Accountant
import AccountantLayout from "../components/layout/AccountantLayout";
import AccountantDashboard from "../pages/dashboard/AccountantDashboard";
import AccountantFeePayment from "../pages/fees/AccountantFeePayment";
import BalanceSheet from "../pages/fees/BalanceSheet";

// Teacher
import TeacherStudents from "../pages/students/TeacherStudents";
import Submissions from "../pages/assignments/Submissions";
import LeaveRequest from "../pages/staff/LeaveRequest";
import StudentAssignments from "../pages/assignments/StudentAssignments";
import StudentResults from "../pages/grades/StudentResults";
import StudentFees from "../pages/fees/StudentFees";

// Parent
import ParentLayout from "../components/layout/ParentLayout";
import ParentDashboard from "../pages/dashboard/ParentDashboard";
import ParentHealthView from "../pages/health/ParentHealthView";

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
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/bulk" element={<AddBulkStudents />} />
          <Route path="students/families" element={<ManageFamilies />} />
          <Route
            path="students/active-inactive"
            element={<ActiveInactiveStudents />}
          />
          <Route path="students/print-list" element={<StudentList />} />
          <Route
            path="students/admission-letters"
            element={<AdmissionLetters />}
          />
          <Route path="students/id-cards" element={<StudentIdCards />} />
          <Route path="students/logins" element={<StudentLogins />} />
          <Route path="students/promote" element={<PromoteStudents />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="expenses" element={<ExpenseManagement />} />
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
          <Route path="tests" element={<TestList />} />
          <Route path="quiz" element={<QuizList />} />
          <Route path="grades" element={<GradesResults />} />
          <Route path="communications" element={<Communications />} />
          <Route path="transport" element={<TransportRoutes />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="gamification" element={<Gamification />} />
          <Route path="system" element={<SystemBackups />} />
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
          <Route path="behavior" element={<BehaviorRecording />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="assignments" element={<AssignmentList />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="study-materials" element={<StudyMaterials />} />
          <Route path="diary" element={<HomeworkDiary />} />
          <Route path="noticeboard" element={<Noticeboard />} />
          <Route path="grades" element={<GradesResults />} />
          <Route path="profile" element={<Profile />} />
          <Route path="exams" element={<ExamList />} />
          <Route path="tests" element={<TestList />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="leave" element={<LeaveRequest />} />
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
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="study-materials" element={<StudyMaterials />} />
          <Route path="diary" element={<HomeworkDiary />} />
          <Route path="noticeboard" element={<Noticeboard />} />
          <Route path="exams" element={<ExamList />} />
          <Route path="sports" element={<SportsActivities />} />
        </Route>

        {/* Accountant routes */}
        <Route
          path="/accountant"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ACCOUNTANT]}>
              <AccountantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AccountantDashboard />} />
          <Route path="fee-payment" element={<AccountantFeePayment />} />
          <Route path="fee-vouchers" element={<FeeManagement />} />
          <Route path="defaulters" element={<FeeManagement />} />
          <Route path="expenses" element={<AccountantDashboard />} />
          <Route path="balance-sheet" element={<BalanceSheet />} />
          <Route path="reports" element={<AccountantDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Parent routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ParentDashboard />} />
          {/* <Route path="attendance" element={<StudentAttendanceView />} /> */}
          <Route path="results" element={<StudentResults />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="health" element={<ParentHealthView />} />
          <Route path="sports" element={<SportsActivities />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="diary" element={<HomeworkDiary />} />
          <Route path="noticeboard" element={<Noticeboard />} />
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
