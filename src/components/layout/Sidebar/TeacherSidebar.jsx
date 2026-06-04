import { useState } from "react";
import { GraduationCap, X, LogOut, Plus, Minus } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  ClipboardList,
  FileText,
  Upload,
  PenLine,
  BookOpen,
  BarChart3,
  BookMarked,
  BookCopy,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function TeacherSidebar({ isOpen, onClose, collapsed }) {
  const { signOut, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTestsRoute = location.pathname.startsWith("/teacher/tests");
  const isExamsRoute = location.pathname.startsWith("/teacher/exams");
  const isAttendanceRoute = location.pathname.startsWith("/teacher/attendance");
  const [testsOpen, setTestsOpen] = useState(isTestsRoute);
  const [examsOpen, setExamsOpen] = useState(isExamsRoute);
  const [attendanceOpen, setAttendanceOpen] = useState(isAttendanceRoute);

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col
        w-[220px] min-w-[220px]
        bg-light-card dark:bg-dark-card
        border-r border-light-border dark:border-dark-border
        transition-transform duration-300 overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "lg:w-[60px] lg:min-w-[60px]" : "w-[220px] min-w-[220px]"}
      `}
      >
        {/* Logo */}
        <div
          className={`flex items-center px-4 py-4 border-b border-light-border dark:border-dark-border ${collapsed ? "justify-center px-0" : "justify-between"}`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap size={18} color="white" />
              </div>
              <div>
                <p className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
                  EduLink
                </p>
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                  Teacher portal
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <GraduationCap size={18} color="white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onClose}
              className="lg:hidden text-light-text-tertiary dark:text-dark-text-tertiary"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {!collapsed && <SidebarSection label="Overview" />}
          <SidebarItem
            to={ROUTES.TEACHER_DASHBOARD}
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="My Classes" />}
          <SidebarItem
            to={ROUTES.TEACHER_STUDENTS}
            icon={Users}
            label="My Students"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/teacher/timetable"
            icon={Clock}
            label="My Timetable"
            collapsed={collapsed}
          />
          {/* ── Attendance dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.TEACHER_ATTENDANCE);
                  return;
                }
                setAttendanceOpen((o) => !o);
              }}
              title={collapsed ? "Attendance" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${collapsed ? "justify-center" : ""} ${isAttendanceRoute ? "bg-accent text-white font-medium" : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"}`}
            >
              <CalendarCheck size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Attendance</span>
                  {attendanceOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>
            {!collapsed && attendanceOpen && (
              <div className="relative ml-5 mt-1 pb-1 border-l border-light-border dark:border-dark-border pl-4 flex flex-col gap-0.5">
                {[
                  { to: ROUTES.TEACHER_ATTENDANCE, label: "Mark Attendance" },
                  { to: ROUTES.TEACHER_ATTENDANCE_REPORTS, label: "Reports" },
                ].map(({ to, label }) => (
                  <SidebarItem
                    key={to}
                    to={to}
                    label={label}
                    collapsed={false}
                    icon={null}
                  />
                ))}
              </div>
            )}
          </div>
          <SidebarItem
            to={ROUTES.TEACHER_BEHAVIOR}
            icon={ClipboardList}
            label="Student Behavior"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Assignments" />}
          <SidebarItem
            to={ROUTES.TEACHER_ASSIGNMENTS}
            icon={FileText}
            label="My Assignments"
            badge="4"
            badgeColor="blue"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/teacher/submissions"
            icon={Upload}
            label="Submissions"
            badge="18"
            badgeColor="red"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Academic" />}
          <SidebarItem
            to={ROUTES.TEACHER_GRADES}
            icon={PenLine}
            label="Grade Entry"
            collapsed={collapsed}
          />
          {/* ── Tests dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.TEACHER_TESTS);
                  return;
                }
                setTestsOpen((o) => !o);
              }}
              title={collapsed ? "Tests" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${collapsed ? "justify-center" : ""} ${
                isTestsRoute
                  ? "bg-accent text-white font-medium"
                  : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              }`}
            >
              <BarChart3 size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">
                    Test Management
                  </span>
                  {testsOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>
            {!collapsed && testsOpen && (
              <div className="relative ml-5 mt-1 pb-1 border-l border-light-border dark:border-dark-border pl-4 flex flex-col gap-0.5">
                {[
                  { to: ROUTES.TEACHER_TESTS, label: "All Tests" },
                  { to: ROUTES.TEACHER_TEST_MARKS_ENTRY, label: "Marks Entry" },
                  { to: ROUTES.TEACHER_TEST_TABULATION, label: "Tabulation" },
                  { to: ROUTES.TEACHER_TEST_SCHEDULE, label: "Schedule" },
                ].map(({ to, label }) => (
                  <SidebarItem
                    key={to}
                    to={to}
                    label={label}
                    collapsed={false}
                    icon={null}
                  />
                ))}
              </div>
            )}
          </div>
          {/* ── Exams dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.TEACHER_EXAMS);
                  return;
                }
                setExamsOpen((o) => !o);
              }}
              title={collapsed ? "Exams" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${collapsed ? "justify-center" : ""} ${
                isExamsRoute
                  ? "bg-accent text-white font-medium"
                  : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              }`}
            >
              <BookOpen size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Exams</span>
                  {examsOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>
            {!collapsed && examsOpen && (
              <div className="relative ml-5 mt-1 pb-1 border-l border-light-border dark:border-dark-border pl-4 flex flex-col gap-0.5">
                {[
                  { to: ROUTES.TEACHER_EXAMS, label: "All Exams" },
                  { to: ROUTES.TEACHER_EXAM_MARKS_ENTRY, label: "Marks Entry" },
                  { to: ROUTES.TEACHER_EXAM_ADMIT_CARDS, label: "Admit Cards" },
                  { to: ROUTES.TEACHER_EXAM_MARKSHEETS, label: "Marksheets" },
                  { to: ROUTES.TEACHER_EXAM_TIMETABLE, label: "Timetable" },
                ].map(({ to, label }) => (
                  <SidebarItem
                    key={to}
                    to={to}
                    label={label}
                    collapsed={false}
                    icon={null}
                  />
                ))}
              </div>
            )}
          </div>
          <SidebarItem
            to="/teacher/results"
            icon={BarChart3}
            label="Results"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="More" />}
          <SidebarItem
            to="/teacher/study-materials"
            icon={BookMarked}
            label="Study Materials"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/teacher/diary"
            icon={BookCopy}
            label="Homework Diary"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/teacher/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/teacher/leave"
            icon={CalendarDays}
            label="Leave Request"
            collapsed={collapsed}
          />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-light-border dark:border-dark-border p-3">
          {!collapsed && (
            <div
              className="flex items-center gap-2.5 px-2 py-1.5 mb-1 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors"
              onClick={() => navigate(`/${role}/profile`)}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                {user?.name?.charAt(0) || "T"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-light-text-primary dark:text-dark-text-primary text-xs font-medium truncate">
                  {user?.name || "Teacher"}
                </p>
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut size={17} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default TeacherSidebar;
