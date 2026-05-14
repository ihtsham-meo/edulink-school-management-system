import { GraduationCap, X, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Clock,
  FileText,
  BarChart3,
  CalendarCheck,
  Banknote,
  BookCopy,
  Megaphone,
  BookOpen,
  Library,
  Trophy,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function StudentSidebar({ isOpen, onClose }) {
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
                Student portal
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
            to={ROUTES.STUDENT_DASHBOARD}
            icon={LayoutDashboard}
            label="Dashboard"
          />

          <SidebarSection label="Academics" />
          <SidebarItem
            to={ROUTES.STUDENT_ATTENDANCE}
            icon={CalendarCheck}
            label="My Attendance"
          />
          <SidebarItem
            to="/student/timetable"
            icon={Clock}
            label="My Timetable"
          />
          <SidebarItem
            to={ROUTES.STUDENT_ASSIGNMENTS}
            icon={FileText}
            label="Assignments"
            badge="3"
            badgeColor="red"
          />
          <SidebarItem
            to={ROUTES.STUDENT_RESULTS}
            icon={BarChart3}
            label="My Results"
          />
          <SidebarItem
            to="/student/exams"
            icon={BookOpen}
            label="Exam Schedule"
          />
          <SidebarItem
            to="/student/study-materials"
            icon={Library}
            label="Study Materials"
          />

          <SidebarSection label="School" />
          <SidebarItem
            to={ROUTES.STUDENT_FEES}
            icon={Banknote}
            label="Fee Status"
          />
          <SidebarItem
            to="/student/diary"
            icon={BookCopy}
            label="Homework Diary"
          />
          <SidebarItem
            to="/student/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
          />
          <SidebarItem
            to="/student/sports"
            icon={Trophy}
            label="Sports & Activities"
          />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-light-border dark:border-dark-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-text-primary dark:text-dark-text-primary text-xs font-medium truncate">
                {user?.name || "Student"}
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

export default StudentSidebar;
