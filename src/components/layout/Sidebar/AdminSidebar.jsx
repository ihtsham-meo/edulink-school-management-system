import { GraduationCap, X } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  CalendarCheck,
  Clock,
  FileText,
  PenLine,
  BarChart3,
  Banknote,
  BookMarked,
  Megaphone,
  Settings,
  LogOut,
  HeartPulse,
  UserSquare2,
  Trophy,
  Library,
  Eye,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function AdminSidebar({ isOpen, onClose }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap size={18} color="white" />
            </div>
            <div>
              <p className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
                EduLink
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Admin panel
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
        <nav className="flex-1 overflow-y-auto no-scrollbar overflow-auto py-2">
          <SidebarSection label="Overview" />
          <SidebarItem
            to={ROUTES.ADMIN_DASHBOARD}
            icon={LayoutDashboard}
            label="Dashboard"
          />

          <SidebarSection label="People" />
          <SidebarItem
            to={ROUTES.ADMIN_STUDENTS}
            icon={Users}
            label="Students"
            badge=""
            badgeColor="blue"
          />
          <SidebarItem
            to={ROUTES.ADMIN_TEACHERS}
            icon={UserCheck}
            label="Teachers"
          />
          <SidebarItem
            to={ROUTES.ADMIN_CLASSES}
            icon={Building2}
            label="Classes & Sections"
          />

          <SidebarSection label="Academic" />
          <SidebarItem
            to={ROUTES.ADMIN_ATTENDANCE}
            icon={CalendarCheck}
            label="Attendance"
          />
          <SidebarItem to="/admin/timetable" icon={Clock} label="Timetable" />
          <SidebarItem
            to={ROUTES.ADMIN_ASSIGNMENTS}
            icon={FileText}
            label="Assignments"
          />
          <SidebarItem to={ROUTES.ADMIN_TESTS} icon={PenLine} label="Tests" />
          <SidebarItem to={ROUTES.ADMIN_EXAMS} icon={BookOpen} label="Exams" />
          <SidebarItem
            to="/admin/grades"
            icon={BarChart3}
            label="Grades & Results"
          />

          <SidebarSection label="Finance" />
          <SidebarItem
            to={ROUTES.ADMIN_FEES}
            icon={Banknote}
            label="Fee Management"
            badge="12"
            badgeColor="red"
          />
          <SidebarItem to="/admin/expenses" icon={BarChart3} label="Expenses" />
          <SidebarItem
            to={ROUTES.ADMIN_SALARY}
            icon={Banknote}
            label="Salary & Loans"
          />

          <SidebarSection label="Activities" />
          <SidebarItem to="/admin/library" icon={Library} label="Library" />
          <SidebarItem
            to="/admin/sports"
            icon={Trophy}
            label="Sports & Activities"
          />
          <SidebarItem
            to="/admin/health"
            icon={HeartPulse}
            label="Health Records"
          />
          <SidebarItem to="/admin/alumni" icon={UserSquare2} label="Alumni" />

          <SidebarSection label="Administration" />
          <SidebarItem
            to="/admin/visitor"
            icon={Eye}
            label="Visitor Management"
          />
          <SidebarItem
            to="/admin/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
          />
          <SidebarItem
            to="/admin/communications"
            icon={Megaphone}
            label="Communications"
          />

          <SidebarSection label="System" />
          <SidebarItem
            to={ROUTES.ADMIN_SETTINGS}
            icon={Settings}
            label="Settings"
          />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-light-border dark:border-dark-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-text-primary dark:text-dark-text-primary text-xs font-medium truncate">
                {user?.name || "Admin"}
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

export default AdminSidebar;
