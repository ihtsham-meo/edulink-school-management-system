import { useState, useEffect, useMemo, useRef } from "react";
import {
  Bell,
  Maximize,
  Menu,
  Minimize,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES, ROUTES } from "../../../constants/routes";

const SEARCH_ITEMS = [
  {
    title: "Dashboard",
    keywords: "home overview analytics summary",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.TEACHER]: ROUTES.TEACHER_DASHBOARD,
      [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
      [ROLES.ACCOUNTANT]: ROUTES.ACCOUNTANT_DASHBOARD,
      [ROLES.PARENT]: ROUTES.PARENT_DASHBOARD,
    },
  },
  {
    title: "Students",
    keywords: "student list people learners admissions records",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_STUDENTS,
      [ROLES.TEACHER]: ROUTES.TEACHER_STUDENTS,
    },
  },
  {
    title: "Add Student",
    keywords: "new student admission enroll create",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_STUDENT_ADD },
  },
  {
    title: "Admissions",
    keywords: "requests inquiries bulk admission enrollment",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_ADMISSION_REQUESTS },
  },
  {
    title: "Staff",
    keywords: "teachers employees team faculty",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_STAFF },
  },
  {
    title: "Classes",
    keywords: "class sections academic groups",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_CLASSES },
  },
  {
    title: "Attendance",
    keywords: "presence absents daily attendance",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_ATTENDANCE,
      [ROLES.TEACHER]: ROUTES.TEACHER_ATTENDANCE,
      [ROLES.STUDENT]: ROUTES.STUDENT_ATTENDANCE,
      [ROLES.PARENT]: ROUTES.PARENT_ATTENDANCE,
    },
  },
  {
    title: "Timetable",
    keywords: "schedule classes periods routine",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_TIMETABLE,
      [ROLES.TEACHER]: ROUTES.TEACHER_TIMETABLE,
      [ROLES.STUDENT]: ROUTES.STUDENT_TIMETABLE,
      [ROLES.PARENT]: ROUTES.PARENT_TIMETABLE,
    },
  },
  {
    title: "Assignments",
    keywords: "homework tasks submissions classwork",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_ASSIGNMENTS,
      [ROLES.TEACHER]: ROUTES.TEACHER_ASSIGNMENTS,
      [ROLES.STUDENT]: ROUTES.STUDENT_ASSIGNMENTS,
      [ROLES.PARENT]: ROUTES.PARENT_ASSIGNMENTS,
    },
  },
  {
    title: "Study Materials",
    keywords: "notes files books resources materials",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_STUDY_MATERIALS,
      [ROLES.TEACHER]: ROUTES.TEACHER_STUDY_MATERIALS,
      [ROLES.STUDENT]: ROUTES.STUDENT_STUDY_MATERIALS,
    },
  },
  {
    title: "Diary",
    keywords: "homework diary daily notes",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_DIARY,
      [ROLES.TEACHER]: ROUTES.TEACHER_DIARY,
      [ROLES.STUDENT]: ROUTES.STUDENT_DIARY,
      [ROLES.PARENT]: ROUTES.PARENT_DIARY,
    },
  },
  {
    title: "Tests",
    keywords: "test assessment quiz marks",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_TESTS,
      [ROLES.TEACHER]: ROUTES.TEACHER_TESTS,
    },
  },
  {
    title: "Exams",
    keywords: "exam schedule assessment paper",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_EXAMS,
      [ROLES.TEACHER]: ROUTES.TEACHER_EXAMS,
      [ROLES.STUDENT]: ROUTES.STUDENT_EXAMS,
    },
  },
  {
    title: "Grades",
    keywords: "results marks report card performance",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_GRADES,
      [ROLES.TEACHER]: ROUTES.TEACHER_GRADES,
      [ROLES.STUDENT]: ROUTES.STUDENT_RESULTS,
      [ROLES.PARENT]: ROUTES.PARENT_RESULTS,
    },
  },
  {
    title: "Fees",
    keywords: "fee payment vouchers dues finance",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_FEES,
      [ROLES.STUDENT]: ROUTES.STUDENT_FEES,
      [ROLES.PARENT]: ROUTES.PARENT_FEES,
      [ROLES.ACCOUNTANT]: ROUTES.ACCOUNTANT_FEE_PAYMENT,
    },
  },
  {
    title: "Expenses",
    keywords: "expense spending accounts finance",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_EXPENSES,
      [ROLES.ACCOUNTANT]: ROUTES.ACCOUNTANT_EXPENSES,
    },
  },
  {
    title: "Salary",
    keywords: "payroll staff salary loans reports",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_SALARY },
  },
  {
    title: "Library",
    keywords: "books issues returns catalog",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_LIBRARY },
  },
  {
    title: "Sports",
    keywords: "activities games teams matches",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_SPORTS,
      [ROLES.STUDENT]: ROUTES.STUDENT_SPORTS,
      [ROLES.PARENT]: ROUTES.PARENT_SPORTS,
    },
  },
  {
    title: "Health",
    keywords: "medical records incidents blood",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_HEALTH,
      [ROLES.PARENT]: ROUTES.PARENT_HEALTH,
    },
  },
  {
    title: "Noticeboard",
    keywords: "notices announcements news board",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_NOTICEBOARD,
      [ROLES.TEACHER]: ROUTES.TEACHER_NOTICEBOARD,
      [ROLES.STUDENT]: ROUTES.STUDENT_NOTICEBOARD,
      [ROLES.PARENT]: ROUTES.PARENT_NOTICEBOARD,
    },
  },
  {
    title: "Profile",
    keywords: "account user settings personal",
    routes: {
      [ROLES.ADMIN]: ROUTES.ADMIN_PROFILE,
      [ROLES.TEACHER]: ROUTES.TEACHER_PROFILE,
      [ROLES.STUDENT]: ROUTES.STUDENT_PROFILE,
      [ROLES.PARENT]: ROUTES.PARENT_PROFILE,
      [ROLES.ACCOUNTANT]: ROUTES.ACCOUNTANT_PROFILE,
    },
  },
  {
    title: "Settings",
    keywords: "configuration preferences system setup",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_SETTINGS },
  },
  {
    title: "System",
    keywords: "backups logs sessions database",
    routes: { [ROLES.ADMIN]: ROUTES.ADMIN_SYSTEM },
  },
];

function Topbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchableItems = useMemo(
    () =>
      SEARCH_ITEMS.map((item) => ({
        ...item,
        path: item.routes[role],
      })).filter((item) => item.path),
    [role],
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return searchableItems.slice(0, 6);

    return searchableItems
      .filter((item) =>
        `${item.title} ${item.keywords}`.toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [search, searchableItems]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(/\s?[AP]M$/, '');

  

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearch("");
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter" && searchResults[0]) {
      handleSearchSelect(searchResults[0].path);
    }

    if (event.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="h-14 flex items-center px-3 sm:px-4 gap-3 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border shrink-0">
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        title="Toggle menu"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Global search */}
      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search anything..."
          className="h-10 w-full rounded-lg border border-light-border bg-light-hover pl-10 pr-9 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:border-dark-border dark:bg-dark-hover dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            title="Clear search"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-light-text-tertiary hover:bg-light-card hover:text-light-text-secondary dark:text-dark-text-tertiary dark:hover:bg-dark-card dark:hover:text-dark-text-secondary"
          >
            <X size={15} />
          </button>
        )}

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-y-auto rounded-lg border border-light-border bg-light-card p-2 shadow-lg dark:border-dark-border dark:bg-dark-card">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSearchSelect(item.path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-light-hover dark:hover:bg-dark-hover"
                >
                  <Search
                    size={16}
                    className="shrink-0 text-light-text-tertiary dark:text-dark-text-tertiary"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {item.path}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <div className="hidden xl:flex items-center justify-center px-5 h-10 rounded-lg bg-light-hover dark:bg-dark-hover text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium select-none">
          <div className="text-center">
            <p className="text-[17px] font-medium leading-5 text-light-text-primary dark:text-dark-text-primary">
              {formattedTime}
            </p>
            <p className="text-[11px] text-light-text-tertiary dark:text-dark-text-tertiary">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={handleFullscreen}
          title={isFullscreen ? "Exit full screen" : "Full screen"}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="hidden sm:flex w-8 h-8 rounded-full bg-accent items-center justify-center text-white text-xs font-medium cursor-pointer">
          {user?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
