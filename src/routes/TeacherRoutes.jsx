import { Route } from "react-router-dom";
import { ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import TeacherLayout from "../components/layout/TeacherLayout";

import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import TeacherStudents from "../pages/students/TeacherStudents";
import ManageTimetable from "../pages/timetable/ManageTimetable";
import StudentAttendance from "../pages/attendance/StudentAttendence";
import AttendanceReports from "../pages/attendance/AttendanceReports";
import BehaviorRecording from "../pages/behavior/BehaviorRecording";
import AssignmentList from "../pages/assignments/AssignmentList";
import Submissions from "../pages/assignments/Submissions";
import CreateAssignment from "../pages/assignments/CreateAssignment";
import GradeSubmission from "../pages/assignments/GradeSubmission";
import GradesResults from "../pages/grades/GradesResults";
import TestList from "../pages/tests/TestList";
import TestMarksEntry from "../pages/tests/TestMarksEntry";
import TestTabulation from "../pages/tests/TestTabulation";
import TestSchedule from "../pages/tests/TestSchedule";
import ExamList from "../pages/exams/ExamList";
import ExamMarksEntry from "../pages/exams/ExamMarksEntry";
import AdmitCards from "../pages/exams/AdmitCards";
import Marksheets from "../pages/exams/Marksheets";
import ExamTimetable from "../pages/exams/ExamTimetable";
import StudentResults from "../pages/grades/StudentResults";
import StudyMaterials from "../pages/study-materials/StudyMaterials";
import HomeworkDiary from "../pages/diary/HomeworkDiary";
import Noticeboard from "../pages/noticeboard/Noticeboard";
import LeaveRequest from "../pages/staff/LeaveRequest";
import Profile from "../pages/profile/Profile";

function TeacherRoutes() {
  return (
    <Route
      path="/teacher"
      element={
        <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
          <TeacherLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="students" element={<TeacherStudents />} />
      <Route path="timetable" element={<ManageTimetable />} />
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="attendance/reports" element={<AttendanceReports />} />
      <Route path="behavior" element={<BehaviorRecording />} />
      <Route path="assignments" element={<AssignmentList />} />
      <Route path="assignments/create" element={<CreateAssignment />} />
      <Route path="assignments/grade" element={<GradeSubmission />} />
      <Route path="submissions" element={<Submissions />} />
      <Route path="grades" element={<GradesResults />} />
      <Route path="tests" element={<TestList />} />
      <Route path="tests/marks-entry" element={<TestMarksEntry />} />
      <Route path="tests/tabulation" element={<TestTabulation />} />
      <Route path="tests/schedule" element={<TestSchedule />} />
      <Route path="exams" element={<ExamList />} />
      <Route path="exams/marks-entry" element={<ExamMarksEntry />} />
      <Route path="exams/admit-cards" element={<AdmitCards />} />
      <Route path="exams/marksheets" element={<Marksheets />} />
      <Route path="exams/timetable" element={<ExamTimetable />} />
      <Route path="results" element={<StudentResults />} />
      <Route path="study-materials" element={<StudyMaterials />} />
      <Route path="diary" element={<HomeworkDiary />} />
      <Route path="noticeboard" element={<Noticeboard />} />
      <Route path="leave" element={<LeaveRequest />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
}

export default TeacherRoutes;