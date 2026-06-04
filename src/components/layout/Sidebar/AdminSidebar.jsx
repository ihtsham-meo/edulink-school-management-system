import { useState } from "react";
import { GraduationCap, X, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Minus,
  Plus,
  UserCheck,
  Building2,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Clock,
  FileText,
  HelpCircle,
  PenLine,
  BarChart3,
  Banknote,
  BookMarked,
  Megaphone,
  MessageSquareText,
  Settings,
  HeartPulse,
  UserSquare2,
  Trophy,
  Library,
  Eye,
  Bus,
  Package,
  CreditCard,
  Award,
  Video,
  BookCopy,
  Globe,
  Database,
  ClipboardCheck,
  UserPlus,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
            ? "bg-gray-500 text-white font-medium"
            : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover "
        }`
      }
    >
      {Icon && <Icon size={17} className="shrink-0" />}
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

function StudentSubItem({ to, label, collapsed, end = false }) {
  if (collapsed) return null;

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative block py-1.5 pl-15 pr-3 text-sm transition-colors ${
          isActive
            ? "font-semibold text-accent"
            : "text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-9 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" />
          )}
          {label}
        </>
      )}
    </NavLink>
  );
}

function AdminSidebar({ isOpen, onClose, collapsed }) {
  const { signOut, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudentsRoute = location.pathname.startsWith("/admin/students");
  const isAdmissionsRoute = location.pathname.startsWith("/admin/admissions");
  const isTestsRoute = location.pathname.startsWith("/admin/tests");
  const isExamsRoute = location.pathname.startsWith("/admin/exams");
  const isFeesRoute = location.pathname.startsWith("/admin/fees");
  const isAttendanceRoute = location.pathname.startsWith("/admin/attendance");
  const [studentsOpen, setStudentsOpen] = useState(isStudentsRoute);
  const [admissionsOpen, setAdmissionsOpen] = useState(isAdmissionsRoute);
  const [testsOpen, setTestsOpen] = useState(isTestsRoute);
  const [examsOpen, setExamsOpen] = useState(isExamsRoute);
  const [feesOpen, setFeesOpen] = useState(isFeesRoute);
  const [attendanceOpen, setAttendanceOpen] = useState(isAttendanceRoute);

  const handleLogout = async () => {
    await signOut();
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

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col
        bg-light-card dark:bg-dark-card
        border-r border-light-border dark:border-dark-border
        transition-all duration-300 overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "lg:w-15 lg:min-w-15" : "w-55 min-w-55"}
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
                  Admin panel
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
            to={ROUTES.ADMIN_DASHBOARD}
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="People" />}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_STUDENTS);
                  return;
                }
                setStudentsOpen((open) => !open);
              }}
              title={collapsed ? "Students" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              } ${
                isStudentsRoute
                  ? "bg-accent text-white font-medium"
                  : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              }`}
            >
              <Users size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Students</span>
                  {studentsOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>

            {!collapsed && studentsOpen && (
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENTS}
                  label="All Students"
                  collapsed={collapsed}
                  end
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_ADD}
                  label="Add New"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_FAMILIES}
                  label="Manage Families"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_ACTIVE_INACTIVE}
                  label="Active / Inactive"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_ADMISSION_LETTERS}
                  label="Admission Letter"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_ID_CARDS}
                  label="Student ID Cards"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_PRINT_LIST}
                  label="Print Basic List"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_LOGINS}
                  label="Manage Login"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_STUDENT_PROMOTE}
                  label="Promote Students"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to={ROUTES.ADMIN_STAFF}
            icon={UserCheck}
            label="Teachers & Staff"
            collapsed={collapsed}
          />

          {/* ── Admissions dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_ADMISSIONS);
                  return;
                }
                setAdmissionsOpen((open) => !open);
              }}
              title={collapsed ? "Admissions" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              } ${
                isAdmissionsRoute
                  ? "bg-accent text-white font-medium"
                  : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              }`}
            >
              <ClipboardCheck size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Admissions</span>
                  {admissionsOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>

            {!collapsed && admissionsOpen && (
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_ADMISSION_REQUESTS}
                  label="Requests"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_ADMISSION_INQUIRIES}
                  label="Inquiries Board"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_ADMISSION_BULK}
                  label="Bulk Admission"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to={ROUTES.ADMIN_CLASSES}
            icon={Building2}
            label="Classes & Sections"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_BEHAVIOR}
            icon={ClipboardList}
            label="Student Behavior"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Academic" />}
          {/* ── Attendance dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_ATTENDANCE);
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
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_ATTENDANCE}
                  label="Mark Attendance"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_ATTENDANCE_REPORTS}
                  label="Reports"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_ATTENDANCE_STAFF}
                  label="Staff Attendance"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to="/admin/timetable"
            icon={Clock}
            label="Timetable"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_ASSIGNMENTS}
            icon={FileText}
            label="Assignments"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_STUDY_MATERIALS}
            icon={BookMarked}
            label="Study Materials"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_DIARY}
            icon={ClipboardList}
            label="Homework Diary"
            collapsed={collapsed}
          />
          {/* ── Tests dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_TESTS);
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
              <PenLine size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Tests</span>
                  {testsOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>
            {!collapsed && testsOpen && (
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_TESTS}
                  label="All Tests"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_TEST_MARKS_ENTRY}
                  label="Marks Entry"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_TEST_TABULATION}
                  label="Tabulation"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_TEST_SCHEDULE}
                  label="Schedule"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to={ROUTES.ADMIN_QUIZ}
            icon={HelpCircle}
            label="Quiz"
            collapsed={collapsed}
          />
          {/* ── Exams dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_EXAMS);
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
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_EXAMS}
                  label="All Exams"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_EXAM_MARKS_ENTRY}
                  label="Marks Entry"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_EXAM_ADMIT_CARDS}
                  label="Admit Cards"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_EXAM_MARKSHEETS}
                  label="Marksheets"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_EXAM_TIMETABLE}
                  label="Timetable"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to={ROUTES.ADMIN_GRADES}
            icon={BarChart3}
            label="Grades & Results"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Finance" />}
          {/* ── Fees dropdown ── */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  navigate(ROUTES.ADMIN_FEES);
                  return;
                }
                setFeesOpen((o) => !o);
              }}
              title={collapsed ? "Fee Management" : undefined}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${collapsed ? "justify-center" : ""} ${isFeesRoute ? "bg-accent text-white font-medium" : "text-light-text-secondary hover:bg-light-hover dark:text-dark-text-secondary dark:hover:bg-dark-hover"}`}
            >
              <Banknote size={17} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">
                    Fee Management
                  </span>
                  {feesOpen ? <Minus size={15} /> : <Plus size={15} />}
                </>
              )}
            </button>
            {!collapsed && feesOpen && (
              <div className="relative ml-2 mt-2 pb-2">
                <span className="absolute left-9 top-0 h-full w-px bg-light-border dark:bg-dark-border" />
                <StudentSubItem
                  to={ROUTES.ADMIN_FEES}
                  label="All Fees"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_FEE_VOUCHERS}
                  label="Vouchers"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_FEE_DEFAULTERS}
                  label="Defaulters"
                  collapsed={collapsed}
                />
                <StudentSubItem
                  to={ROUTES.ADMIN_FEE_GENERATE}
                  label="Generate Fee"
                  collapsed={collapsed}
                />
              </div>
            )}
          </div>
          <NavItem
            to={ROUTES.ADMIN_EXPENSES}
            icon={BarChart3}
            label="Expenses"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_SALARY}
            icon={Banknote}
            label="Salary & Loans"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Activities" />}
          <NavItem
            to="/admin/library"
            icon={Library}
            label="Library"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/sports"
            icon={Trophy}
            label="Sports & Activities"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/health"
            icon={HeartPulse}
            label="Health Records"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/gamification"
            icon={Trophy}
            label="Gamification"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_INVENTORY}
            icon={Package}
            label="Inventory"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/alumni"
            icon={UserSquare2}
            label="Alumni"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="Administration" />}
          <NavItem
            to="/admin/visitor"
            icon={Eye}
            label="Visitor Management"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/noticeboard"
            icon={Megaphone}
            label="Noticeboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/communications"
            icon={MessageSquareText}
            label="Communications"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/transport"
            icon={Bus}
            label="Transport"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/inventory"
            icon={Package}
            label="Inventory & POS"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/id-cards"
            icon={CreditCard}
            label="ID Cards"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/certificates"
            icon={Award}
            label="Certificates"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/quiz"
            icon={HelpCircle}
            label="Quiz"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/diary"
            icon={BookCopy}
            label="Homework Diary"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/study-materials"
            icon={BookMarked}
            label="Study Materials"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/online-classes"
            icon={Video}
            label="Online Classes"
            collapsed={collapsed}
          />

          {!collapsed && <SidebarSection label="System" />}

          <NavItem
            to="/admin/system"
            icon={Database}
            label="Backups & Logs"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/website"
            icon={Globe}
            label="Website"
            collapsed={collapsed}
          />
          <NavItem
            to={ROUTES.ADMIN_SETTINGS}
            icon={Settings}
            label="Settings"
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
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium shrink-0">
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

export default AdminSidebar;
