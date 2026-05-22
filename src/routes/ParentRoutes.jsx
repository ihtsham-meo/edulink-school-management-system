import { Route } from "react-router-dom";
import { ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import ParentLayout from "../components/layout/ParentLayout";

import ParentDashboard from "../pages/dashboard/ParentDashboard";
import StudentAttendanceView from "../pages/attendance/StudentAttendanceView";
import StudentResults from "../pages/grades/StudentResults";
import StudentAssignments from "../pages/assignments/StudentAssignments";
import ManageTimetable from "../pages/timetable/ManageTimetable";
import ParentHealthView from "../pages/health/ParentHealthView";
import SportsActivities from "../pages/sports/SportsActivities";
import StudentFees from "../pages/fees/StudentFees";
import HomeworkDiary from "../pages/diary/HomeworkDiary";
import Noticeboard from "../pages/noticeboard/Noticeboard";
import Profile from "../pages/profile/Profile";

function ParentRoutes() {
  return (
    <Route
      path="/parent"
      element={
        <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<ParentDashboard />} />
      <Route path="attendance" element={<StudentAttendanceView />} />
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
  );
}

export default ParentRoutes;
