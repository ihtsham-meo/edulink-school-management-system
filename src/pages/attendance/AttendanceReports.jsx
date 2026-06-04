import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Printer,
  User,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockStudents } from "../../data/mockData";

// ── Mock monthly attendance data ──────────────────────────────────────────────
const CLASSES = [...new Set(mockStudents.map((s) => s.class))].sort();
const MONTHS = [
  "May 2026",
  "April 2026",
  "March 2026",
  "February 2026",
  "January 2026",
];

// Generate realistic attendance data per student per month
function generateMonthData(studentId, month) {
  const seed = studentId * 37 + month.length;
  const days = 26;
  const present = Math.max(10, Math.min(days, Math.round((seed % 10) + 17)));
  const absent = Math.max(0, Math.round(seed % 4));
  const late = Math.max(0, Math.min(3, days - present - absent));
  const leave = Math.max(0, days - present - absent - late);
  return { days, present, absent, late, leave };
}

function pct(present, days) {
  return days > 0 ? Math.round((present / days) * 100) : 0;
}

// Calendar days for a month
function getCalendarDays(monthStr) {
  const [monthName, year] = monthStr.split(" ");
  const monthIdx = new Date(`${monthName} 1, ${year}`).getMonth();
  const daysInMonth = new Date(Number(year), monthIdx + 1, 0).getDate();
  const firstDay = new Date(Number(year), monthIdx, 1).getDay();
  return { daysInMonth, firstDay, monthIdx, year: Number(year) };
}

// Fake per-day attendance for a student
function getStudentDayAttendance(studentId, day, monthIdx) {
  const seed = (studentId * 13 + day * 7 + monthIdx * 3) % 17;
  if (seed > 14) return "absent";
  if (seed > 12) return "late";
  if (seed > 11) return "leave";
  return "present";
}

const STATUS_DOT = {
  present: "bg-green-400",
  absent: "bg-red-500",
  late: "bg-amber-400",
  leave: "bg-blue-400",
};

const LOW_ATTENDANCE_THRESHOLD = 75;

// ── Main Component ────────────────────────────────────────────────────────────
function AttendanceReports() {
  const navigate = useNavigate();

  const [selectedMonth, setMonth] = useState(MONTHS[0]);
  const [classFilter, setClass] = useState("All Classes");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table | calendar
  const [selectedStudent, setStudent] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // name | pct | absent

  const students = mockStudents.slice(0, 12);

  // Build report rows
  const rows = useMemo(() => {
    return students.map((s) => {
      const data = generateMonthData(s.id, selectedMonth);
      return { ...s, ...data, pct: pct(data.present, data.days) };
    });
  }, [selectedMonth]);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = rows.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(q) || r.rollNo.toLowerCase().includes(q);
      const matchClass =
        classFilter === "All Classes" || r.class === classFilter;
      return matchSearch && matchClass;
    });
    if (sortBy === "pct") result = [...result].sort((a, b) => a.pct - b.pct);
    if (sortBy === "absent")
      result = [...result].sort((a, b) => b.absent - a.absent);
    if (sortBy === "name")
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [rows, search, classFilter, sortBy]);

  const lowAttendance = filtered.filter(
    (r) => r.pct < LOW_ATTENDANCE_THRESHOLD,
  );

  // Summary stats
  const summary = useMemo(() => {
    const avg = filtered.length
      ? Math.round(filtered.reduce((a, r) => a + r.pct, 0) / filtered.length)
      : 0;
    return {
      avg,
      low: lowAttendance.length,
      perfect: filtered.filter((r) => r.pct === 100).length,
    };
  }, [filtered]);

  // Calendar data for selected student
  const { daysInMonth, firstDay, monthIdx, year } =
    getCalendarDays(selectedMonth);
  const calendarCells = Array.from(
    { length: firstDay + daysInMonth },
    (_, i) => (i < firstDay ? null : i - firstDay + 1),
  );
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const handleExportCSV = () => {
    const header = [
      "Name",
      "Roll No",
      "Class",
      "Days",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Percentage",
    ];
    const csvRows = filtered.map((r) => [
      r.name,
      r.rollNo,
      r.class,
      r.days,
      r.present,
      r.absent,
      r.late,
      r.leave,
      `${r.pct}%`,
    ]);
    const csv = [header, ...csvRows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${selectedMonth.replace(" ", "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const rows_html = filtered
      .map(
        (r) =>
          `<tr><td>${r.name}</td><td>${r.rollNo}</td><td>${r.class}</td><td>${r.present}</td><td>${r.absent}</td><td>${r.late}</td><td>${r.leave}</td><td>${r.pct}%</td></tr>`,
      )
      .join("");
    const w = window.open("", "_blank");
    w.document
      .write(`<html><head><title>Attendance Report — ${selectedMonth}</title>
      <style>body{font-family:Arial;padding:20px;font-size:12px}h1{font-size:16px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ccc;padding:5px 8px}th{background:#f0f0f0;font-weight:600}</style>
      </head><body><h1>Attendance Report — ${selectedMonth}</h1>
      <table><tr><th>Name</th><th>Roll No</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th><th>%</th></tr>${rows_html}</table>
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Attendance Reports"
        subtitle="Monthly attendance overview with heatmap and low-attendance alerts"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={selectedMonth}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {MONTHS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={classFilter}
          onChange={(e) => setClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="All Classes">All Classes</option>
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors w-48"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="name">Sort: Name</option>
          <option value="pct">Sort: % (Low first)</option>
          <option value="absent">Sort: Absences</option>
        </select>
        <div className="ml-auto flex gap-2">
          {["table", "calendar"].map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${viewMode === m ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Class Average",
            value: `${summary.avg}%`,
            color:
              summary.avg >= 75
                ? "text-green-600 dark:text-green-400"
                : "text-amber-600 dark:text-amber-400",
            bg: "bg-light-card dark:bg-dark-card",
          },
          {
            label: "Low Attendance",
            value: summary.low,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/40",
          },
          {
            label: "Perfect Record",
            value: summary.perfect,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-950/40",
          },
          {
            label: "Students",
            value: filtered.length,
            color: "text-light-text-primary dark:text-dark-text-primary",
            bg: "bg-light-card dark:bg-dark-card",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-light-border dark:border-dark-border rounded-xl p-3 text-center`}
          >
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Low attendance alert */}
      {lowAttendance.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              size={15}
              className="text-amber-600 dark:text-amber-400"
            />
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Low Attendance Alert — {lowAttendance.length} student
              {lowAttendance.length !== 1 ? "s" : ""} below{" "}
              {LOW_ATTENDANCE_THRESHOLD}%
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowAttendance.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStudent(s);
                  setViewMode("calendar");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-dark-card border border-amber-200 dark:border-amber-800 hover:border-amber-400 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">
                  {s.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {s.name}
                </span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  {s.pct}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TABLE VIEW ────────────────────────────────────────────────── */}
      {viewMode === "table" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_1.2fr_1fr] items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border min-w-[700px]">
            {[
              "Student",
              "Class",
              "Days",
              "Present",
              "Absent",
              "Late",
              "Leave",
              "Percentage",
              "",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            {filtered.map((r) => {
              const isLow = r.pct < LOW_ATTENDANCE_THRESHOLD;
              return (
                <div
                  key={r.id}
                  className={`grid grid-cols-[1.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_1.2fr_1fr] items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 min-w-[700px] transition-colors hover:bg-light-hover dark:hover:bg-dark-hover ${isLow ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        {r.rollNo}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {r.class}
                  </span>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {r.days}
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {r.present}
                  </span>
                  <span className="text-sm font-medium text-red-500">
                    {r.absent}
                  </span>
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {r.late}
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {r.leave}
                  </span>
                  {/* Percentage bar */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-light-hover dark:bg-dark-hover rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${r.pct >= 90 ? "bg-green-500" : r.pct >= 75 ? "bg-blue-500" : r.pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold w-10 text-right ${r.pct < LOW_ATTENDANCE_THRESHOLD ? "text-red-600 dark:text-red-400" : "text-light-text-secondary dark:text-dark-text-secondary"}`}
                      >
                        {r.pct}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStudent(r);
                      setViewMode("calendar");
                    }}
                    className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                  >
                    View Calendar →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CALENDAR VIEW ─────────────────────────────────────────────── */}
      {viewMode === "calendar" && (
        <div className="flex flex-col gap-4">
          {/* Student selector for calendar */}
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4 flex items-center gap-3 flex-wrap">
            <User
              size={14}
              className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
            />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Viewing:
            </span>
            <select
              value={selectedStudent?.id || ""}
              onChange={(e) =>
                setStudent(
                  filtered.find((r) => r.id === Number(e.target.value)) || null,
                )
              }
              className="px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
            >
              <option value="">Select student…</option>
              {filtered.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.rollNo}
                </option>
              ))}
            </select>
            {selectedStudent && (
              <div className="flex items-center gap-3 ml-auto flex-wrap">
                {[
                  [
                    "Present",
                    selectedStudent.present,
                    "text-green-600 dark:text-green-400",
                  ],
                  ["Absent", selectedStudent.absent, "text-red-500"],
                  [
                    "Late",
                    selectedStudent.late,
                    "text-amber-600 dark:text-amber-400",
                  ],
                  [
                    "Leave",
                    selectedStudent.leave,
                    "text-blue-600 dark:text-blue-400",
                  ],
                ].map(([l, v, c]) => (
                  <span
                    key={l}
                    className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary"
                  >
                    {l}: <span className={`font-bold ${c}`}>{v}</span>
                  </span>
                ))}
                <span
                  className={`text-sm font-bold px-2 py-1 rounded-lg ${selectedStudent.pct < LOW_ATTENDANCE_THRESHOLD ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400"}`}
                >
                  {selectedStudent.pct}%
                </span>
              </div>
            )}
          </div>

          {selectedStudent && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-light-border dark:border-dark-border">
                <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {selectedStudent.name} — {selectedMonth} Attendance Heatmap
                </h3>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-light-border dark:border-dark-border px-2 py-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary"
                  >
                    {d}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 p-3">
                {calendarCells.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  const status = getStudentDayAttendance(
                    selectedStudent.id,
                    day,
                    monthIdx,
                  );
                  const colors = {
                    present: "bg-green-400 text-white",
                    absent: "bg-red-500 text-white",
                    late: "bg-amber-400 text-white",
                    leave: "bg-blue-400 text-white",
                  };
                  const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                  return (
                    <div
                      key={idx}
                      title={`${day} ${selectedMonth}: ${status}`}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-default transition-all hover:scale-110 ${isWeekend ? "opacity-40 bg-light-hover dark:bg-dark-hover text-light-text-tertiary dark:text-dark-text-tertiary" : colors[status]}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="px-4 pb-3 flex flex-wrap gap-4">
                {[
                  ["bg-green-400", "Present"],
                  ["bg-red-500", "Absent"],
                  ["bg-amber-400", "Late"],
                  ["bg-blue-400", "Leave"],
                  ["bg-light-hover dark:bg-dark-hover", "Weekend"],
                ].map(([c, l]) => (
                  <span
                    key={l}
                    className="flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    <span className={`w-3 h-3 rounded-sm ${c}`} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!selectedStudent && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <Calendar
                size={28}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Select a student to view their attendance calendar
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceReports;
