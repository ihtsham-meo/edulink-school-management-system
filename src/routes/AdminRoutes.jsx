import { Route } from "react-router-dom";
import { ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";

// Dashboards
import AdminDashboard from "../pages/dashboard/AdminDashboard";

// Students
import StudentList from "../pages/students/StudentList";
import StudentDetail from "../pages/students/StudentDetail";
import AddStudent from "../pages/students/AddStudent";
import AddBulkStudents from "../pages/students/AddBulkStudents";
import ManageFamilies from "../pages/students/ManageFamilies";
import ActiveInactiveStudents from "../pages/students/ActiveInactiveStudents";
import AdmissionLetters from "../pages/students/AdmissionLetters";
import StudentIdCards from "../pages/students/StudentIdCards";
import StudentLogins from "../pages/students/StudentLogins";
import PromoteStudents from "../pages/students/PromoteStudents";

// Admissions
import AdmissionRequests from "../pages/admissions/AdmissionRequests";
import Inquiries from "../pages/admissions/Inquiries";
import BulkAdmission from "../pages/admissions/BulkAdmission";

// Attendance
import StudentAttendance from "../pages/attendance/StudentAttendence";
import AttendanceReports from "../pages/attendance/AttendanceReports";
import StaffAttendance from "../pages/attendance/StaffAttendance";

// Classes
import ClassList from "../pages/classes/ClassList";

// Assignments
import AssignmentList from "../pages/assignments/AssignmentList";
import Submissions from "../pages/assignments/Submissions";
import CreateAssignment from "../pages/assignments/CreateAssignment";
import GradeSubmission from "../pages/assignments/GradeSubmission";
import ManageTimetable from "../pages/timetable/ManageTimetable";
import AssignmentList from "../pages/assignments/AssignmentList";
import StudyMaterials from "../pages/study-materials/StudyMaterials";
import HomeworkDiary from "../pages/diary/HomeworkDiary";
import TestList from "../pages/tests/TestList";
import TestMarksEntry from "../pages/tests/TestMarksEntry";
import TestTabulation from "../pages/tests/TestTabulation";
import TestSchedule from "../pages/tests/TestSchedule";
import QuizList from "../pages/quiz/QuizList";
import ExamList from "../pages/exams/ExamList";
import ExamMarksEntry from "../pages/exams/ExamMarksEntry";
import AdmitCards from "../pages/exams/AdmitCards";
import Marksheets from "../pages/exams/Marksheets";
import ExamTimetable from "../pages/exams/ExamTimetable";
import GradesResults from "../pages/grades/GradesResults";
import BehaviorRecording from "../pages/behavior/BehaviorRecording";

// Staff
import StaffList from "../pages/staff/StaffList";
import StaffDetail from "../pages/staff/StaffDetail";

// Finance
import FeeManagement from "../pages/fees/FeeManagement";
import FeeVouchers from "../pages/fees/FeeVouchers";
import FeeDefaulters from "../pages/fees/FeeDefaulters";
import GenerateFee from "../pages/fees/GenerateFee";
import ExpenseManagement from "../pages/expenses/ExpenseManagement";
import ManageSalaries from "../pages/salary/ManageSalaries";

// Activities
import LibraryManagement from "../pages/library/LibraryManagement";
import SportsActivities from "../pages/sports/SportsActivities";
import HealthRecords from "../pages/health/HealthRecords";
import Gamification from "../pages/gamification/Gamification";
import Inventory from "../pages/inventory/Inventory";
import AlumniManagement from "../pages/alumni/AlumniManagement";

// Administration
import VisitorManagement from "../pages/visitor/VisitorManagement";
import Noticeboard from "../pages/noticeboard/Noticeboard";
import Communications from "../pages/communications/Communications";
import TransportRoutes from "../pages/transport/TransportRoutes";

// System
import SystemBackups from "../pages/system/SystemBackups";
import GeneralSettings from "../pages/settings/GeneralSettings";
import Profile from "../pages/profile/Profile";

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* ── Admissions ───────────────────────────────────────────────────── */}
      <Route path="admissions/requests" element={<AdmissionRequests />} />
      <Route path="admissions/inquiries" element={<Inquiries />} />
      <Route path="admissions/bulk" element={<BulkAdmission />} />

      {/* ── Students ─────────────────────────────────────────────────────── */}
      <Route path="students" element={<StudentList />} />
      <Route path="students/:id" element={<StudentDetail />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="students/bulk" element={<AddBulkStudents />} />
      <Route path="students/families" element={<ManageFamilies />} />
      <Route path="students/active-inactive" element={<ActiveInactiveStudents />} />
      <Route path="students/print-list" element={<StudentList />} />
      <Route path="students/admission-letters" element={<AdmissionLetters />} />
      <Route path="students/id-cards" element={<StudentIdCards />} />
      <Route path="students/logins" element={<StudentLogins />} />
      <Route path="students/promote" element={<PromoteStudents />} />

      {/* ── People ───────────────────────────────────────────────────────── */}
      <Route path="staff" element={<StaffList />} />
      <Route path="staff/:id" element={<StaffDetail />} />
      <Route path="classes" element={<ClassList />} />
      <Route path="behavior" element={<BehaviorRecording />} />

      {/* ── Academic ─────────────────────────────────────────────────────── */}
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="attendance/reports" element={<AttendanceReports />} />
      <Route path="attendance/staff" element={<StaffAttendance />} />
      <Route path="timetable" element={<ManageTimetable />} />
      <Route path="assignments" element={<AssignmentList />} />
      <Route path="assignments/create" element={<CreateAssignment />} />
      <Route path="assignments/submissions" element={<Submissions />} />
      <Route path="assignments/grade" element={<GradeSubmission />} />
      <Route path="study-materials" element={<StudyMaterials />} />
      <Route path="diary" element={<HomeworkDiary />} />
      <Route path="tests" element={<TestList />} />
      <Route path="tests/marks-entry" element={<TestMarksEntry />} />
      <Route path="tests/tabulation" element={<TestTabulation />} />
      <Route path="tests/schedule" element={<TestSchedule />} />
      <Route path="quiz" element={<QuizList />} />
      <Route path="exams" element={<ExamList />} />
      <Route path="exams/marks-entry" element={<ExamMarksEntry />} />
      <Route path="exams/admit-cards" element={<AdmitCards />} />
      <Route path="exams/marksheets" element={<Marksheets />} />
      <Route path="exams/timetable" element={<ExamTimetable />} />
      <Route path="grades" element={<GradesResults />} />

      {/* ── Finance ──────────────────────────────────────────────────────── */}
      <Route path="fees" element={<FeeManagement />} />
      <Route path="fees/vouchers" element={<FeeVouchers />} />
      <Route path="fees/defaulters" element={<FeeDefaulters />} />
      <Route path="fees/generate" element={<GenerateFee />} />
      <Route path="expenses" element={<ExpenseManagement />} />
      <Route path="salary" element={<ManageSalaries />} />

      {/* ── Activities ───────────────────────────────────────────────────── */}
      <Route path="library" element={<LibraryManagement />} />
      <Route path="sports" element={<SportsActivities />} />
      <Route path="health" element={<HealthRecords />} />
      <Route path="gamification" element={<Gamification />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="alumni" element={<AlumniManagement />} />

      {/* ── Administration ───────────────────────────────────────────────── */}
      <Route path="visitor" element={<VisitorManagement />} />
      <Route path="noticeboard" element={<Noticeboard />} />
      <Route path="communications" element={<Communications />} />
      <Route path="transport" element={<TransportRoutes />} />

      {/* ── System ───────────────────────────────────────────────────────── */}
      <Route path="system" element={<SystemBackups />} />
      <Route path="settings" element={<GeneralSettings />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
}

export default AdminRoutes;