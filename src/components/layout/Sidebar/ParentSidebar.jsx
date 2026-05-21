import { GraduationCap, X, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Banknote,
  FileText,
  Clock,
  Megaphone,
  HeartPulse,
  BookCopy,
  Trophy,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarSection from "./SidebarSection";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../hooks/useAuth";

function NavItem({
  to,
  icon: Icon,
  label,
  badge,
  badgeColor = "blue",
  collapsed,
}) {
  const badgeStyles = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  };
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm transition-all duration-200 ${
          collapsed ? "justify-center" : ""
        } ${
          isActive
            ? "bg-accent text-white font-medium"
            : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
        }`
      }
    >
      {Icon && <Icon size={17} className="flex-shrink-0" />}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${badgeStyles[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function ParentSidebar({ isOpen, onClose, collapsed }) {
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
        bg-light-card dark:bg-dark-card
        border-r border-light-border dark:border-dark-border
        transition-all duration-300 overflow-hidden
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
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} color="white" />
              </div>
              <div>
                <p className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
                  EduLink
                </p>
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                  Parent portal
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
          <NavItem
            to="/parent/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="My Child" />}
          <NavItem
            to="/parent/attendance"
            icon={CalendarCheck}
            label="Attendance"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/results"
            icon={BarChart3}
            label="Results"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/assignments"
            icon={FileText}
            label="Assignments"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/timetable"
            icon={Clock}
            label="Timetable"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/health"
            icon={HeartPulse}
            label="Health Records"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/sports"
            icon={Trophy}
            label="Activities"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="School" />}
          <NavItem
            to="/parent/fees"
            icon={Banknote}
            label="Fee Status"
            badge="1"
            badgeColor="red"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/diary"
            icon={BookCopy}
            label="Homework Diary"
            collapsed={collapsed}
          />
          <NavItem
            to="/parent/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
            collapsed={collapsed}
          />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-light-border dark:border-dark-border p-3">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {user?.name?.charAt(0) || "P"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-light-text-primary dark:text-dark-text-primary text-xs font-medium truncate">
                  {user?.name || "Parent"}
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
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={17} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default ParentSidebar;
