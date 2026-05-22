import { Route } from "react-router-dom";
import { ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import StudentLayout from "../components/layout/StudentLayout";

import StudentDashboard from "../pages/dashboard/StudentDashboard";
import StudentAttendance from "../pages/attendance/StudentAttendence";
import ManageTimetable from "../pages/timetable/ManageTimetable";
import StudentAssignments from "../pages/assignments/StudentAssignments";
import StudentResults from "../pages/grades/StudentResults";
import ExamList from "../pages/exams/ExamList";
import StudyMaterials from "../pages/study-materials/StudyMaterials";
import StudentFees from "../pages/fees/StudentFees";
import HomeworkDiary from "../pages/diary/HomeworkDiary";
import Noticeboard from "../pages/noticeboard/Noticeboard";
import SportsActivities from "../pages/sports/SportsActivities";
import Profile from "../pages/profile/Profile";

function StudentRoutes() {
  return (
    <Route
      path="/student"
      element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="timetable" element={<ManageTimetable />} />
      <Route path="assignments" element={<StudentAssignments />} />
      <Route path="results" element={<StudentResults />} />
      <Route path="exams" element={<ExamList />} />
      <Route path="study-materials" element={<StudyMaterials />} />
      <Route path="fees" element={<StudentFees />} />
      <Route path="diary" element={<HomeworkDiary />} />
      <Route path="noticeboard" element={<Noticeboard />} />
      <Route path="sports" element={<SportsActivities />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
}

export default StudentRoutes;
