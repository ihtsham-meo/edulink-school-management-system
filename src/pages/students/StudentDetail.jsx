import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Pencil,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  GraduationCap,
  User,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  Heart,
  Trophy,
  Library,
  AlertTriangle,
  Banknote,
  Star,
  ClipboardList,
  Activity,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { feeStatusStyles } from "../../data/mockData";
import {
  mockStudents,
  mockFeePayments,
  mockAttendance,
  mockAssignments,
  mockSubmissions,
  mockResults,
  mockBehaviorRecords,
  mockHealthRecords,
  mockBooks,
  mockBookIssues,
  mockSports,
  mockAchievements,
} from "../../data/mockData";

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusStyles = {
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};
const attStyles = {
  present: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  absent: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  late: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  leave: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
};
const submissionStyles = {
  graded: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  submitted: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  missing: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

function gradeLabel(pct) {
  if (pct >= 90) return { g: "A+", c: "text-green-600 dark:text-green-400" };
  if (pct >= 80) return { g: "A", c: "text-green-600 dark:text-green-400" };
  if (pct >= 70) return { g: "B+", c: "text-blue-600 dark:text-blue-400" };
  if (pct >= 60) return { g: "B", c: "text-blue-600 dark:text-blue-400" };
  if (pct >= 50) return { g: "C", c: "text-amber-600 dark:text-amber-400" };
  return { g: "F", c: "text-red-500" };
}

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "attendance", label: "Attendance", icon: CheckCircle },
  { id: "fees", label: "Fees", icon: Banknote },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "results", label: "Results", icon: TrendingUp },
  { id: "behavior", label: "Behavior", icon: ClipboardList },
  { id: "health", label: "Health", icon: Heart },
  { id: "library", label: "Library", icon: Library },
  { id: "sports", label: "Sports", icon: Trophy },
];

// ── Reusable mini-components ──────────────────────────────────────────────────
function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-light-border dark:border-dark-border px-3 py-2.5 flex items-start gap-2.5">
      {Icon && (
        <Icon
          size={14}
          className="mt-0.5 shrink-0 text-light-text-tertiary dark:text-dark-text-tertiary"
        />
      )}
      <div className="min-w-0">
        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function EmptyState({ icon: Icon = BookOpen, message = "No records found" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div className="w-10 h-10 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
        <Icon
          size={18}
          className="text-light-text-tertiary dark:text-dark-text-tertiary"
        />
      </div>
      <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
        {message}
      </p>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({ ...student });
  const [saving, setSaving] = useState(false);
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Edit Student Profile
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
          {[
            { f: "name", l: "Full Name" },
            { f: "rollNo", l: "Roll No" },
            { f: "class", l: "Class" },
            { f: "section", l: "Section" },
            { f: "phone", l: "Phone" },
            { f: "email", l: "Email", type: "email" },
            { f: "dob", l: "Date of Birth", type: "date" },
            { f: "address", l: "Address" },
          ].map(({ f, l, type = "text" }) => (
            <label key={f} className="block">
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                {l}
              </span>
              <input
                type={type}
                value={form[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
              />
            </label>
          ))}
          {[
            { f: "gender", l: "Gender", opts: ["Male", "Female"] },
            { f: "status", l: "Status", opts: ["active", "inactive"] },
            { f: "fee", l: "Fee Status", opts: ["paid", "pending", "overdue"] },
          ].map(({ f, l, opts }) => (
            <label key={f} className="block">
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                {l}
              </span>
              <select
                value={form[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
              >
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
          <button
            onClick={onClose}
            className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save
            Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setTab] = useState("personal");
  const [editOpen, setEditOpen] = useState(false);
  const [student, setStudent] = useState(
    () => mockStudents.find((s) => s.id === Number(id)) || mockStudents[0],
  );

  // Per-student data slices
  const fees = mockFeePayments.filter((f) => f.studentId === student.id);
  const attendance = mockAttendance.filter((a) => a.studentId === student.id);
  const submissions = mockSubmissions.filter((s) => s.studentId === student.id);
  const result = mockResults.find((r) => r.studentName === student.name);
  const behavior = mockBehaviorRecords.filter(
    (b) => b.studentId === student.id,
  );
  const health = mockHealthRecords.find((h) => h.studentId === student.id);
  const issued = mockBookIssues.filter((i) => i.studentId === student.id);

  // Attendance stats
  const attStats = useMemo(() => {
    const total = attendance.length || 30;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, pct };
  }, [attendance]);

  // Result average
  const resultAvg = useMemo(() => {
    if (!result) return null;
    const vals = Object.values(result.subjects);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    return { avg, ...gradeLabel(avg) };
  }, [result]);

  const handleSave = (updated) => {
    setStudent(updated);
    setEditOpen(false);
  };

  const printProfile = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>${student.name} — Profile</title>
      <style>body{font-family:sans-serif;padding:24px;color:#111}h1{font-size:20px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #ddd;padding:8px 12px;font-size:13px}th{background:#f5f5f5;font-weight:600;text-align:left}.muted{color:#666;font-size:13px}</style>
      </head><body>
      <h1>${student.name}</h1>
      <p class="muted">Roll No: ${student.rollNo} &nbsp;|&nbsp; Class: ${student.class} &nbsp;|&nbsp; ${student.gender}</p>
      <table><tr><th>Field</th><th>Value</th></tr>
      ${[
        ["Phone", student.phone],
        ["Email", student.email],
        ["DOB", student.dob],
        ["Address", student.address],
        ["Status", student.status],
        ["Fee Status", student.fee],
      ]
        .map(([k, v]) => `<tr><td>${k}</td><td>${v || "—"}</td></tr>`)
        .join("")}
      </table>
      <p class="muted" style="margin-top:16px">Printed on ${new Date().toLocaleString()}</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <PageHeader
        title="Student Profile"
        subtitle={student.name}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={printProfile}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Pencil size={15} /> Edit Profile
            </button>
          </div>
        }
      />

      {/* Profile hero card */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold shrink-0">
            {student.name?.charAt(0)}
          </div>

          {/* Basic info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                {student.name}
              </h2>
              <StatusPill
                status={student.status || "active"}
                styles={statusStyles}
              />
              <StatusPill
                status={student.fee || "pending"}
                styles={feeStatusStyles}
              />
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              <span className="flex items-center gap-1">
                <Hash size={13} />
                {student.rollNo}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap size={13} />
                {student.class}
                {student.section ? ` – ${student.section}` : ""}
              </span>
              <span className="flex items-center gap-1">
                <User size={13} />
                {student.gender}
              </span>
              {student.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={13} />
                  {student.phone}
                </span>
              )}
              {student.email && (
                <span className="flex items-center gap-1">
                  <Mail size={13} />
                  {student.email}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 shrink-0">
            <div className="text-center">
              <p
                className={`text-xl font-bold ${attStats.pct >= 75 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
              >
                {attStats.pct}%
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Attendance
              </p>
            </div>
            {resultAvg && (
              <div className="text-center">
                <p className={`text-xl font-bold ${resultAvg.c}`}>
                  {resultAvg.g}
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Grade
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {submissions.filter((s) => s.status === "graded").length}
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Graded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === id
                ? "bg-accent text-white shadow-sm"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {/* ── Personal ──────────────────────────────────────────────────── */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard label="Full Name" value={student.name} icon={User} />
                <InfoCard
                  label="Roll Number"
                  value={student.rollNo}
                  icon={Hash}
                />
                <InfoCard label="Gender" value={student.gender} icon={User} />
                <InfoCard
                  label="Date of Birth"
                  value={student.dob}
                  icon={Calendar}
                />
                <InfoCard label="Phone" value={student.phone} icon={Phone} />
                <InfoCard label="Email" value={student.email} icon={Mail} />
                <InfoCard
                  label="Address"
                  value={student.address}
                  icon={MapPin}
                />
                <InfoCard
                  label="Status"
                  value={student.status}
                  icon={CheckCircle}
                />
              </div>
            </SectionCard>
            <SectionCard title="Academic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  label="Class"
                  value={student.class}
                  icon={GraduationCap}
                />
                <InfoCard
                  label="Section"
                  value={student.section}
                  icon={GraduationCap}
                />
                <InfoCard
                  label="Fee Status"
                  value={student.fee}
                  icon={Banknote}
                />
                <InfoCard label="Session" value="2025–2026" icon={Calendar} />
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Academic ──────────────────────────────────────────────────── */}
        {activeTab === "academic" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Attendance Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "Total Days",
                    value: attStats.total,
                    color:
                      "text-light-text-primary dark:text-dark-text-primary",
                  },
                  {
                    label: "Present",
                    value: attStats.present,
                    color: "text-green-600 dark:text-green-400",
                  },
                  {
                    label: "Absent",
                    value: attStats.absent,
                    color: "text-red-500",
                  },
                  {
                    label: "Percentage",
                    value: `${attStats.pct}%`,
                    color:
                      attStats.pct >= 75
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="text-center p-2 rounded-lg bg-light-hover dark:bg-dark-hover"
                  >
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-light-hover dark:bg-dark-hover rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${attStats.pct >= 75 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${attStats.pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  {attStats.pct}%
                </span>
              </div>
            </SectionCard>

            <SectionCard title="Latest Results">
              {result ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Session: {result.session}
                    </span>
                    {resultAvg && (
                      <span className={`text-sm font-bold ${resultAvg.c}`}>
                        Overall: {resultAvg.g} ({resultAvg.avg}%)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(result.subjects).map(([sub, marks]) => {
                      const { g, c } = gradeLabel(marks);
                      return (
                        <div key={sub} className="flex items-center gap-3">
                          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary w-28 shrink-0">
                            {sub}
                          </span>
                          <div className="flex-1 bg-light-hover dark:bg-dark-hover rounded-full h-1.5">
                            <div
                              className="bg-accent h-1.5 rounded-full"
                              style={{ width: `${marks}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary w-10 text-right">
                            {marks}%
                          </span>
                          <span className={`text-xs font-bold w-7 ${c}`}>
                            {g}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  message="No results published yet"
                />
              )}
            </SectionCard>
          </div>
        )}

        {/* ── Attendance ────────────────────────────────────────────────── */}
        {activeTab === "attendance" && (
          <SectionCard title="Attendance Records">
            {attendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Date", "Day", "Status"].map((h) => (
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
                    {attendance.slice(0, 30).map((a, i) => (
                      <tr
                        key={i}
                        className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover"
                      >
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                          {a.date}
                        </td>
                        <td className="px-3 py-2.5 text-light-text-tertiary dark:text-dark-text-tertiary">
                          {new Date(a.date).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusPill status={a.status} styles={attStyles} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Fallback: generate demo attendance */
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 30 }, (_, i) => {
                  const statuses = [
                    "present",
                    "present",
                    "present",
                    "present",
                    "absent",
                    "late",
                    "present",
                    "present",
                    "present",
                    "leave",
                  ];
                  const s = statuses[i % statuses.length];
                  const colors = {
                    present: "bg-green-400",
                    absent: "bg-red-400",
                    late: "bg-amber-400",
                    leave: "bg-blue-400",
                  };
                  return (
                    <div
                      key={i}
                      title={`Day ${i + 1}: ${s}`}
                      className={`w-7 h-7 rounded-lg ${colors[s]} flex items-center justify-center text-white text-xs font-medium cursor-default`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
                <p className="w-full mt-3 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  🟢 Present &nbsp; 🔴 Absent &nbsp; 🟡 Late &nbsp; 🔵 Leave
                </p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ── Fees ──────────────────────────────────────────────────────── */}
        {activeTab === "fees" && (
          <SectionCard title="Fee Payment History">
            {fees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Month", "Amount", "Method", "Paid On", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover"
                      >
                        <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">
                          {f.month}
                        </td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                          Rs. {f.amount?.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                          {f.method}
                        </td>
                        <td className="px-3 py-2.5 text-light-text-tertiary dark:text-dark-text-tertiary">
                          {f.paidOn || f.date || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusPill
                            status={f.status || "paid"}
                            styles={feeStatusStyles}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Demo fee history */
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Month", "Amount", "Method", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "January 2026",
                      "February 2026",
                      "March 2026",
                      "April 2026",
                      "May 2026",
                    ].map((m, i) => (
                      <tr
                        key={m}
                        className="border-b border-light-border dark:border-dark-border last:border-0"
                      >
                        <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">
                          {m}
                        </td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                          Rs. 4,500
                        </td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                          Cash
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusPill
                            status={i < 4 ? "paid" : "pending"}
                            styles={feeStatusStyles}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {/* ── Assignments ───────────────────────────────────────────────── */}
        {activeTab === "assignments" && (
          <SectionCard title="Assignment Submissions">
            {submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Assignment", "Submitted On", "Marks", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => {
                      const assignment = mockAssignments.find(
                        (a) => a.id === s.assignmentId,
                      );
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover"
                        >
                          <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">
                            {assignment?.title ||
                              `Assignment #${s.assignmentId}`}
                          </td>
                          <td className="px-3 py-2.5 text-light-text-tertiary dark:text-dark-text-tertiary">
                            {s.submittedAt || "—"}
                          </td>
                          <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                            {s.marks != null
                              ? `${s.marks}/${assignment?.totalMarks || "—"}`
                              : "—"}
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusPill
                              status={s.status}
                              styles={submissionStyles}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                message="No assignments found for this student"
              />
            )}
          </SectionCard>
        )}

        {/* ── Results ───────────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <SectionCard title="Academic Results">
            {result ? (
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-light-border dark:border-dark-border">
                  <div>
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      Session {result.session}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {result.class}
                    </p>
                  </div>
                  {resultAvg && (
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${resultAvg.c}`}>
                        {resultAvg.g}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        Avg {resultAvg.avg}%
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(result.subjects).map(([sub, marks]) => {
                    const { g, c } = gradeLabel(marks);
                    return (
                      <div
                        key={sub}
                        className="flex items-center gap-3 p-3 rounded-lg bg-light-hover dark:bg-dark-hover"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {sub}
                          </p>
                          <div className="mt-1 flex-1 bg-light-card dark:bg-dark-card rounded-full h-1.5">
                            <div
                              className="bg-accent h-1.5 rounded-full"
                              style={{ width: `${marks}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary">
                            {marks}%
                          </p>
                          <p className={`text-xs font-bold ${c}`}>{g}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState icon={TrendingUp} message="No results available" />
            )}
          </SectionCard>
        )}

        {/* ── Behavior ──────────────────────────────────────────────────── */}
        {activeTab === "behavior" && (
          <SectionCard title="Behavior Records">
            {behavior.length > 0 ? (
              <div className="flex flex-col gap-3">
                {behavior.map((b) => {
                  const positive = [
                    "Punctual",
                    "Hardworking",
                    "Helpful",
                    "Cooperative",
                    "Respectful",
                  ];
                  const isPos = b.tags.some((t) => positive.includes(t));
                  return (
                    <div
                      key={b.id}
                      className={`rounded-lg border p-3 ${isPos ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {b.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${positive.includes(tag) ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary shrink-0">
                          {b.date}
                        </span>
                      </div>
                      {b.note && (
                        <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {b.note}
                        </p>
                      )}
                      {b.visibleToParent && (
                        <p className="mt-1 text-xs text-blue-500">
                          Visible to parent
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                message="No behavior records yet"
              />
            )}
          </SectionCard>
        )}

        {/* ── Health ────────────────────────────────────────────────────── */}
        {activeTab === "health" &&
          (health ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionCard title="Physical Information">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard
                    label="Blood Group"
                    value={health.bloodGroup}
                    icon={Activity}
                  />
                  <InfoCard
                    label="Height"
                    value={`${health.height} cm`}
                    icon={Activity}
                  />
                  <InfoCard
                    label="Weight"
                    value={`${health.weight} kg`}
                    icon={Activity}
                  />
                  <InfoCard
                    label="Hospital"
                    value={health.hospital}
                    icon={Heart}
                  />
                </div>
              </SectionCard>
              <SectionCard title="Medical Details">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-1.5">
                      Conditions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {health.conditions?.length ? (
                        health.conditions.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-1.5">
                      Allergies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {health.allergies?.length ? (
                        health.allergies.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs"
                          >
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-1.5">
                      Emergency Contact
                    </p>
                    <InfoCard
                      label={health.emergencyDoctor}
                      value={health.emergencyPhone}
                      icon={Phone}
                    />
                  </div>
                </div>
              </SectionCard>
              {health.vaccinations?.length > 0 && (
                <SectionCard title="Vaccinations">
                  <div className="flex flex-col gap-2">
                    {health.vaccinations.map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-light-hover dark:bg-dark-hover"
                      >
                        <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {v.name}
                        </span>
                        <div className="text-right">
                          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {v.date}
                          </p>
                          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            Next: {v.nextDue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          ) : (
            <SectionCard>
              <EmptyState icon={Heart} message="No health records found" />
            </SectionCard>
          ))}

        {/* ── Library ───────────────────────────────────────────────────── */}
        {activeTab === "library" && (
          <SectionCard title="Issued Books">
            {issued.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Book", "Issue Date", "Due Date", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {issued.map((issue) => {
                      const book = mockBooks.find((b) => b.id === issue.bookId);
                      return (
                        <tr
                          key={issue.id}
                          className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover"
                        >
                          <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">
                            {book?.title || "Unknown"}
                          </td>
                          <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                            {issue.issueDate}
                          </td>
                          <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">
                            {issue.dueDate}
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusPill
                              status={issue.returnDate ? "returned" : "issued"}
                              styles={{
                                returned:
                                  "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
                                issued:
                                  "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={Library} message="No books currently issued" />
            )}
          </SectionCard>
        )}

        {/* ── Sports ────────────────────────────────────────────────────── */}
        {activeTab === "sports" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Sports Activities">
              {mockSports.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {mockSports.slice(0, 4).map((sport) => (
                    <div
                      key={sport.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-light-hover dark:bg-dark-hover"
                    >
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-lg">
                        {sport.icon || "🏅"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {sport.name}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {sport.coach}
                        </p>
                      </div>
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        {sport.season}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Trophy} message="Not enrolled in any sport" />
              )}
            </SectionCard>
            <SectionCard title="Achievements">
              {mockAchievements?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {mockAchievements.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-light-hover dark:bg-dark-hover"
                    >
                      <span className="text-xl">{a.icon || "🏆"}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {a.title}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {a.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Star} message="No achievements recorded" />
              )}
            </SectionCard>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditModal
          student={student}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default StudentDetail;
