import { useState, useMemo } from "react";
import {
  Check,
  X,
  Clock,
  Calendar,
  Save,
  Search,
  ChevronDown,
  Users,
  BarChart3,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import DatePicker from "../../components/common/DatePicker";
import { mockTeachers } from "../../data/mockData";

// ── Constants ─────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "All Departments",
  ...new Set(mockTeachers.map((t) => t.department)),
].filter(Boolean);
const STATUSES = ["present", "absent", "late", "leave"];

const statusConfig = {
  present: {
    label: "Present",
    icon: Check,
    active: "bg-green-500 text-white border-green-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-green-400 hover:text-green-500",
  },
  absent: {
    label: "Absent",
    icon: X,
    active: "bg-red-500 text-white border-red-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-red-400 hover:text-red-500",
  },
  late: {
    label: "Late",
    icon: Clock,
    active: "bg-amber-500 text-white border-amber-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-amber-400 hover:text-amber-500",
  },
  leave: {
    label: "Leave",
    icon: Calendar,
    active: "bg-blue-500 text-white border-blue-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-blue-400 hover:text-blue-500",
  },
};

// ── Main Component ────────────────────────────────────────────────────────────
function StaffAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDept] = useState("All Departments");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Attendance state: { [staffId]: status }
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(mockTeachers.map((t) => [t.id, "present"])),
  );

  // Filter staff
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockTeachers.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(q) ||
        (t.empCode || "").toLowerCase().includes(q);
      const matchDept =
        department === "All Departments" || t.department === department;
      return matchSearch && matchDept;
    });
  }, [search, department]);

  // Summary counts
  const counts = useMemo(
    () =>
      STATUSES.reduce((acc, s) => {
        acc[s] = Object.values(attendance).filter((v) => v === s).length;
        return acc;
      }, {}),
    [attendance],
  );

  const mark = (id, status) => {
    setAttendance((p) => ({ ...p, [id]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const ids = filtered.map((t) => t.id);
    setAttendance((p) => {
      const next = { ...p };
      ids.forEach((id) => {
        next[id] = status;
      });
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 600);
  };

  // Group by department for display
  const grouped = useMemo(() => {
    if (department !== "All Departments") return { [department]: filtered };
    const map = {};
    filtered.forEach((t) => {
      const d = t.department || "Other";
      if (!map[d]) map[d] = [];
      map[d].push(t);
    });
    return map;
  }, [filtered, department]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff Attendance"
        subtitle="Mark daily attendance for teaching and non-teaching staff"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${saved ? "bg-green-500" : "bg-accent hover:bg-accent-hover"} disabled:opacity-70`}
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Attendance"}
          </button>
        }
      />

      {/* Controls */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Department */}
          <select
            value={department}
            onChange={(e) => {
              setDept(e.target.value);
              setSaved(false);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* Date */}
          <DatePicker
            value={date}
            onChange={(v) => {
              setDate(v);
              setSaved(false);
            }}
            className="sm:w-[220px]"
          />

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors w-44"
            />
          </div>

          <div className="flex-1" />

          {/* Mark all */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary shrink-0">
              Mark all:
            </span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => markAll(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusConfig[s].inactive}`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            key: "present",
            label: "Present",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-950",
          },
          {
            key: "absent",
            label: "Absent",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950",
          },
          {
            key: "late",
            label: "Late",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950",
          },
          {
            key: "leave",
            label: "Leave",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950",
          },
        ].map(({ key, label, color, bg }) => (
          <div
            key={key}
            className={`${bg} rounded-xl p-4 flex items-center justify-between`}
          >
            <span className={`text-sm font-medium ${color}`}>{label}</span>
            <span className={`text-2xl font-semibold ${color}`}>
              {counts[key]}
            </span>
          </div>
        ))}
      </div>

      {/* Staff list grouped by department */}
      {Object.entries(grouped).map(([dept, staffList]) => (
        <div
          key={dept}
          className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
        >
          {/* Department header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover">
            <Users size={14} className="text-accent" />
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              {dept}
            </h3>
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              ({staffList.length})
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Mark dept:
              </span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setAttendance((p) => {
                      const next = { ...p };
                      staffList.forEach((t) => {
                        next[t.id] = s;
                      });
                      return next;
                    });
                    setSaved(false);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${statusConfig[s].inactive}`}
                >
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 px-4 py-2.5 border-b border-light-border dark:border-dark-border">
            <span className="col-span-1 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
              #
            </span>
            <span className="col-span-4 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
              Staff Member
            </span>
            <span className="col-span-2 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
              Designation
            </span>
            <span className="col-span-5 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
              Status
            </span>
          </div>

          {/* Staff rows */}
          {staffList.map((staff, idx) => {
            const current = attendance[staff.id] || "present";
            return (
              <div
                key={staff.id}
                className="grid grid-cols-12 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <span className="col-span-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {idx + 1}
                </span>

                {/* Staff info */}
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                      {staff.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {staff.empCode}
                    </p>
                  </div>
                </div>

                {/* Designation */}
                <div className="col-span-2 min-w-0">
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {staff.designation}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                    {staff.subject || ""}
                  </p>
                </div>

                {/* Status buttons */}
                <div className="col-span-5 flex items-center gap-2 flex-wrap">
                  {STATUSES.map((s) => {
                    const cfg = statusConfig[s];
                    const Icon = cfg.icon;
                    const active = current === s;
                    return (
                      <button
                        key={s}
                        onClick={() => mark(staff.id, s)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${active ? cfg.active : cfg.inactive}`}
                      >
                        <Icon size={12} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Empty state */}
      {Object.keys(grouped).length === 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-14 gap-2">
          <Users
            size={24}
            className="text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
            No staff found for the selected filters
          </p>
        </div>
      )}
    </div>
  );
}

export default StaffAttendance;
