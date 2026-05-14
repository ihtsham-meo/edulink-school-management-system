import { GraduationCap, X, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
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
import { useNavigate } from "react-router-dom";

function TeacherSidebar({ isOpen, onClose }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
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
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:min-w-0 lg:border-0 lg:overflow-hidden"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
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
          <button
            onClick={onClose}
            className="lg:hidden text-light-text-tertiary dark:text-dark-text-tertiary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          <SidebarSection label="Overview" />
          <SidebarItem
            to={ROUTES.TEACHER_DASHBOARD}
            icon={LayoutDashboard}
            label="Dashboard"
          />

          <SidebarSection label="My Classes" />
          <SidebarItem
            to={ROUTES.TEACHER_STUDENTS}
            icon={Users}
            label="My Students"
          />
          <SidebarItem
            to="/teacher/timetable"
            icon={Clock}
            label="My Timetable"
          />
          <SidebarItem
            to={ROUTES.TEACHER_ATTENDANCE}
            icon={CalendarCheck}
            label="Attendance"
          />

          <SidebarSection label="Assignments" />
          <SidebarItem
            to={ROUTES.TEACHER_ASSIGNMENTS}
            icon={FileText}
            label="My Assignments"
            badge="4"
            badgeColor="blue"
          />
          <SidebarItem
            to="/teacher/submissions"
            icon={Upload}
            label="Submissions"
            badge="18"
            badgeColor="red"
          />

          <SidebarSection label="Academic" />
          <SidebarItem
            to={ROUTES.TEACHER_GRADES}
            icon={PenLine}
            label="Grade Entry"
          />
          <SidebarItem
            to="/teacher/tests"
            icon={BarChart3}
            label="Test Management"
          />
          <SidebarItem
            to="/teacher/exams"
            icon={BookOpen}
            label="Exam Schedule"
          />
          <SidebarItem to="/teacher/results" icon={BarChart3} label="Results" />

          <SidebarSection label="More" />
          <SidebarItem
            to="/teacher/study-materials"
            icon={BookMarked}
            label="Study Materials"
          />
          <SidebarItem
            to="/teacher/diary"
            icon={BookCopy}
            label="Homework Diary"
          />
          <SidebarItem
            to="/teacher/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
          />
          <SidebarItem
            to="/teacher/leave"
            icon={CalendarDays}
            label="Leave Request"
          />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-light-border dark:border-dark-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default TeacherSidebar;
