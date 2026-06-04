import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Printer,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockExams } from "../../data/mockData";

// ── Constants ─────────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Urdu",
  "Islamiat",
  "Social Studies",
];
const CLASSES = [
  "6-A",
  "6-B",
  "7-A",
  "7-B",
  "8-A",
  "8-B",
  "9-A",
  "9-B",
  "10-A",
  "10-B",
  "11-A",
  "11-B",
];
const ROOMS = [
  "Hall A",
  "Hall B",
  "Room 101",
  "Room 102",
  "Room 103",
  "Room 201",
  "Room 202",
  "Lab 1",
  "Library",
];
const TIMES = [
  "08:00 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
];
const EXAM_SESSIONS = [
  "Mid-Term 2026",
  "Annual Exam 2026",
  "Supplementary 2026",
];

const statusStyles = {
  upcoming: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  ongoing: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  completed: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  cancelled: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const INIT_FORM = {
  subject: "Mathematics",
  class: "9-A",
  date: "",
  time: "09:00 AM",
  room: "Hall A",
  duration: "3 hours",
  totalMarks: "",
  invigilator: "",
  session: EXAM_SESSIONS[1],
  status: "upcoming",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function detectConflicts(schedule) {
  const conflicts = new Set();
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const a = schedule[i],
        b = schedule[j];
      // Same room, same date, same time
      if (a.date === b.date && a.time === b.time && a.room === b.room) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
      // Same class, same date
      if (a.date === b.date && a.class === b.class) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    }
  }
  return conflicts;
}

// ── Main Component ────────────────────────────────────────────────────────────
function ExamTimetable() {
  const navigate = useNavigate();

  // Seed from mockExams
  const [schedule, setSchedule] = useState(() =>
    mockExams.map((e) => ({
      ...e,
      duration: "3 hours",
      totalMarks: e.totalMarks || 100,
      invigilator: "Mr. Kamran Iqbal",
      session: EXAM_SESSIONS[1],
    })),
  );
  const [nextId, setNextId] = useState(200);
  const [modal, setModal] = useState(null); // "add"|"edit"|"delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [filterSession, setSession] = useState("All");
  const [filterStatus, setStatus] = useState("All");
  const [filterClass, setClass] = useState("All Classes");
  const [groupBy, setGroupBy] = useState("date"); // date | subject | room

  const set = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: "" }));
  };

  // Conflicts
  const conflicts = useMemo(() => detectConflicts(schedule), [schedule]);

  // Filtered
  const filtered = useMemo(() => {
    return schedule
      .filter((e) => {
        const matchSession =
          filterSession === "All" || e.session === filterSession;
        const matchStatus = filterStatus === "All" || e.status === filterStatus;
        const matchClass =
          filterClass === "All Classes" || e.class === filterClass;
        return matchSession && matchStatus && matchClass;
      })
      .sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      );
  }, [schedule, filterSession, filterStatus, filterClass]);

  // Grouped for display
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const key =
        groupBy === "date"
          ? e.date
          : groupBy === "subject"
            ? e.subject
            : e.room;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupBy]);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.class.trim()) e.class = "Required";
    if (!form.date) e.date = "Required";
    if (!form.totalMarks || Number(form.totalMarks) < 1)
      e.totalMarks = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(INIT_FORM);
    setErrors({});
    setModal("add");
  };
  const openEdit = (exam) => {
    setSelected(exam);
    setForm({
      subject: exam.subject,
      class: exam.class,
      date: exam.date,
      time: exam.time,
      room: exam.room,
      duration: exam.duration,
      totalMarks: String(exam.totalMarks),
      invigilator: exam.invigilator || "",
      session: exam.session || EXAM_SESSIONS[1],
      status: exam.status,
    });
    setErrors({});
    setModal("edit");
  };
  const openDelete = (exam) => {
    setSelected(exam);
    setModal("delete");
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      if (modal === "add") {
        setSchedule((prev) => [
          ...prev,
          { ...form, id: nextId, totalMarks: Number(form.totalMarks) },
        ]);
        setNextId((n) => n + 1);
      } else {
        setSchedule((prev) =>
          prev.map((e) =>
            e.id === selected.id
              ? { ...e, ...form, totalMarks: Number(form.totalMarks) }
              : e,
          ),
        );
      }
      setSaving(false);
      setModal(null);
    }, 500);
  };

  const handleDelete = () => {
    setSaving(true);
    setTimeout(() => {
      setSchedule((prev) => prev.filter((e) => e.id !== selected.id));
      setSaving(false);
      setModal(null);
    }, 400);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    const rows = filtered
      .map(
        (e) =>
          `<tr><td>${e.date}</td><td>${e.time}</td><td>${e.subject}</td><td>${e.class}</td><td>${e.room}</td><td>${e.duration}</td><td>${e.totalMarks}</td><td>${e.invigilator || "—"}</td><td>${e.status}</td></tr>`,
      )
      .join("");
    w.document.write(`
      <html><head><title>Exam Timetable</title>
      <style>body{font-family:Arial,sans-serif;padding:20px;font-size:12px}h1{font-size:16px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ccc;padding:5px 8px;text-align:left}th{background:#f0f0f0;font-weight:600}.muted{color:#666;font-size:11px}</style>
      </head><body>
      <h1>Exam Timetable</h1>
      <p class="muted">Printed on ${new Date().toLocaleString()}</p>
      <table><tr><th>Date</th><th>Time</th><th>Subject</th><th>Class</th><th>Room</th><th>Duration</th><th>Marks</th><th>Invigilator</th><th>Status</th></tr>${rows}</table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const exportCSV = () => {
    const header = [
      "Date",
      "Time",
      "Subject",
      "Class",
      "Room",
      "Duration",
      "Marks",
      "Invigilator",
      "Status",
    ];
    const rows = filtered.map((e) => [
      e.date,
      e.time,
      e.subject,
      e.class,
      e.room,
      e.duration,
      e.totalMarks,
      e.invigilator || "",
      e.status,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam_timetable.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Exam Timetable"
        subtitle="Schedule, manage, and print the exam calendar"
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
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <FileSpreadsheet size={15} /> CSV
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Exam
            </button>
          </div>
        }
      />

      {/* Conflict warning */}
      {conflicts.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle size={15} />
          {Math.floor(conflicts.size / 2)} conflict
          {conflicts.size > 2 ? "s" : ""} detected — same room/time or same
          class scheduled twice on the same day.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: schedule.length,
            color: "text-light-text-primary dark:text-dark-text-primary",
          },
          {
            label: "Upcoming",
            value: schedule.filter((e) => e.status === "upcoming").length,
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Completed",
            value: schedule.filter((e) => e.status === "completed").length,
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Conflicts",
            value: Math.floor(conflicts.size / 2),
            color:
              conflicts.size > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-light-text-tertiary dark:text-dark-text-tertiary",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-3 text-center"
          >
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + Group by */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterSession}
          onChange={(e) => setSession(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="All">All Sessions</option>
          {EXAM_SESSIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="All">All Status</option>
          {["upcoming", "ongoing", "completed", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterClass}
          onChange={(e) => setClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="All Classes">All Classes</option>
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="ml-auto flex gap-2">
          {[
            ["date", "By Date"],
            ["subject", "By Subject"],
            ["room", "By Room"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setGroupBy(val)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${groupBy === val ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable */}
      {grouped.map(([groupKey, exams]) => (
        <div
          key={groupKey}
          className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
        >
          {/* Group header */}
          <div className="px-5 py-3 border-b border-light-border dark:border-dark-border flex items-center gap-2 bg-light-hover dark:bg-dark-hover">
            {groupBy === "date" && (
              <Calendar size={14} className="text-accent" />
            )}
            {groupBy === "subject" && (
              <BookOpen size={14} className="text-accent" />
            )}
            {groupBy === "room" && <MapPin size={14} className="text-accent" />}
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              {groupKey}
            </h3>
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary ml-1">
              ({exams.length})
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "700px" }}>
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  {[
                    "Subject",
                    "Class",
                    "Date",
                    "Time",
                    "Room",
                    "Duration",
                    "Marks",
                    "Invigilator",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const isConflict = conflicts.has(exam.id);
                  return (
                    <tr
                      key={exam.id}
                      className={`border-b border-light-border dark:border-dark-border last:border-0 transition-colors ${isConflict ? "bg-amber-50/50 dark:bg-amber-950/20" : "hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {isConflict && (
                            <AlertCircle
                              size={13}
                              className="text-amber-500 shrink-0"
                              title="Conflict detected"
                            />
                          )}
                          <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                            {exam.subject}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                        {exam.class}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                        {exam.date}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                        {exam.time}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                        {exam.room}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-tertiary dark:text-dark-text-tertiary">
                        {exam.duration}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                        {exam.totalMarks}
                      </td>
                      <td className="px-3 py-2.5 text-light-text-tertiary dark:text-dark-text-tertiary">
                        {exam.invigilator || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusPill
                          status={exam.status}
                          styles={statusStyles}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(exam)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:hover:bg-dark-hover hover:text-accent transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => openDelete(exam)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
            <Calendar
              size={22}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">
            No exams found
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            <Plus size={14} /> Schedule an Exam
          </button>
        </div>
      )}

      {/* ── Add/Edit Modal ─────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                {modal === "add" ? "Add Exam" : "Edit Exam"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Subject *
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/* Class */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Class *
                </label>
                <select
                  value={form.class}
                  onChange={(e) => set("class", e.target.value)}
                  className={`w-full rounded-lg border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors ${errors.class ? "border-danger" : "border-light-border dark:border-dark-border"}`}
                >
                  {CLASSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={`w-full rounded-lg border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors ${errors.date ? "border-danger" : "border-light-border dark:border-dark-border"}`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-danger">{errors.date}</p>
                )}
              </div>
              {/* Time */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Start Time
                </label>
                <select
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                >
                  {TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              {/* Room */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Room
                </label>
                <select
                  value={form.room}
                  onChange={(e) => set("room", e.target.value)}
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                >
                  {ROOMS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Duration
                </label>
                <input
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="3 hours"
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                />
              </div>
              {/* Total Marks */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={form.totalMarks}
                  onChange={(e) => set("totalMarks", e.target.value)}
                  placeholder="100"
                  className={`w-full rounded-lg border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors ${errors.totalMarks ? "border-danger" : "border-light-border dark:border-dark-border"}`}
                />
                {errors.totalMarks && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.totalMarks}
                  </p>
                )}
              </div>
              {/* Invigilator */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Invigilator
                </label>
                <input
                  value={form.invigilator}
                  onChange={(e) => set("invigilator", e.target.value)}
                  placeholder="Assigned teacher"
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                />
              </div>
              {/* Session */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Session
                </label>
                <select
                  value={form.session}
                  onChange={(e) => set("session", e.target.value)}
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                >
                  {EXAM_SESSIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                >
                  {["upcoming", "ongoing", "completed", "cancelled"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
              <button
                onClick={() => setModal(null)}
                className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {modal === "add" ? "Add Exam" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────────────────────── */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                Remove Exam
              </h2>
              <button
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Remove{" "}
                <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {selected.subject}
                </span>{" "}
                scheduled on {selected.date} for {selected.class}? This cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2 mt-5 border-t border-light-border pt-4 dark:border-dark-border">
                <button
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}{" "}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamTimetable;
