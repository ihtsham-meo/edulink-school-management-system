import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Pencil,
  Phone,
  Mail,
  Hash,
  GraduationCap,
  User,
  Banknote,
  CalendarCheck,
  ClipboardList,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Loader2,
  Building2,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockTeachers, mockSalaries } from "../../data/mockData";

// ── Local mock data for tabs without a global source ─────────────────────────
const mockStaffAttendance = {
  1: [
    { date: "2026-05-01", status: "present" }, { date: "2026-05-02", status: "present" },
    { date: "2026-05-03", status: "present" }, { date: "2026-05-04", status: "present" },
    { date: "2026-05-05", status: "present" }, { date: "2026-05-06", status: "late" },
    { date: "2026-05-07", status: "present" }, { date: "2026-05-08", status: "present" },
    { date: "2026-05-09", status: "absent" },  { date: "2026-05-10", status: "present" },
    { date: "2026-05-11", status: "present" }, { date: "2026-05-12", status: "present" },
    { date: "2026-05-13", status: "present" }, { date: "2026-05-14", status: "late" },
    { date: "2026-05-15", status: "present" }, { date: "2026-05-16", status: "present" },
    { date: "2026-05-17", status: "present" }, { date: "2026-05-18", status: "present" },
    { date: "2026-05-19", status: "present" }, { date: "2026-05-20", status: "present" },
    { date: "2026-05-21", status: "present" }, { date: "2026-05-22", status: "present" },
    { date: "2026-05-23", status: "present" }, { date: "2026-05-24", status: "absent" },
    { date: "2026-05-25", status: "present" }, { date: "2026-05-26", status: "present" },
  ],
};

const mockLeaveHistory = {
  1: [
    { id: 1, reason: "Medical appointment",    from: "2026-05-20", to: "2026-05-20", days: 1, status: "approved" },
    { id: 2, reason: "Family emergency",        from: "2026-04-10", to: "2026-04-11", days: 2, status: "approved" },
    { id: 3, reason: "Personal work",           from: "2026-03-15", to: "2026-03-15", days: 1, status: "rejected" },
    { id: 4, reason: "Academic conference",     from: "2026-02-20", to: "2026-02-22", days: 3, status: "approved" },
    { id: 5, reason: "Sick leave",              from: "2026-01-08", to: "2026-01-09", days: 2, status: "pending"  },
  ],
};

const mockSalaryHistory = [
  { month: "May 2026",      basic: 45000, present: 26, absent: 0, late: 1, generated: 44500, status: "paid"   },
  { month: "April 2026",    basic: 45000, present: 25, absent: 1, late: 0, generated: 43200, status: "paid"   },
  { month: "March 2026",    basic: 45000, present: 26, absent: 0, late: 0, generated: 45000, status: "paid"   },
  { month: "February 2026", basic: 45000, present: 24, absent: 0, late: 2, generated: 44000, status: "paid"   },
  { month: "January 2026",  basic: 45000, present: 26, absent: 0, late: 0, generated: 45000, status: "unpaid" },
];

const mockCertificates = [
  { id: 1, title: "B.Ed in Mathematics",        institute: "University of Punjab",      year: "2015", type: "Degree"       },
  { id: 2, title: "M.Sc Mathematics",           institute: "Quaid-i-Azam University",   year: "2013", type: "Degree"       },
  { id: 3, title: "Cambridge CELTA",            institute: "British Council",            year: "2018", type: "Certification" },
  { id: 4, title: "Professional Development",   institute: "Aga Khan Education Service", year: "2021", type: "Training"     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const staffStatusStyles = {
  active:   "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};
const salaryStatusStyles = {
  paid:   "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  unpaid: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};
const leaveStatusStyles = {
  approved: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending:  "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  rejected: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};
const attStyles = {
  present: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  absent:  "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  late:    "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

const TABS = [
  { id: "personal",    label: "Personal",    icon: User          },
  { id: "classes",     label: "Classes",     icon: GraduationCap },
  { id: "attendance",  label: "Attendance",  icon: CalendarCheck },
  { id: "salary",      label: "Salary",      icon: Banknote      },
  { id: "leaves",      label: "Leaves",      icon: ClipboardList },
  { id: "certificates",label: "Certificates",icon: Award         },
];

// ── Reusable mini-components ──────────────────────────────────────────────────
function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-light-border dark:border-dark-border px-3 py-2.5 flex items-start gap-2.5">
      {Icon && <Icon size={14} className="mt-0.5 shrink-0 text-light-text-tertiary dark:text-dark-text-tertiary" />}
      <div className="min-w-0">
        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{title}</h3>
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
        <Icon size={18} className="text-light-text-tertiary dark:text-dark-text-tertiary" />
      </div>
      <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">{message}</p>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ staff, onClose, onSave }) {
  const [form, setForm]     = useState({ ...staff, classes: staff.classes?.join(", ") || "" });
  const [saving, setSaving] = useState(false);
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({ ...form, classes: form.classes.split(",").map((c) => c.trim()).filter(Boolean) });
      setSaving(false);
    }, 500);
  };

  const departments = ["Mathematics", "English", "Science", "Computer Science", "Urdu", "Islamiat", "Social Studies", "Physics", "Chemistry", "Biology"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Edit Staff Profile</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
          {[
            { f: "name",        l: "Full Name" },
            { f: "empCode",     l: "Employee Code" },
            { f: "designation", l: "Designation" },
            { f: "phone",       l: "Phone" },
            { f: "email",       l: "Email", type: "email" },
            { f: "subject",     l: "Subject" },
            { f: "joinDate",    l: "Join Date", type: "date" },
            { f: "classes",     l: "Classes (comma-separated)" },
          ].map(({ f, l, type = "text" }) => (
            <label key={f} className="block">
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">{l}</span>
              <input
                type={type}
                value={form[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
              />
            </label>
          ))}
          {[
            { f: "department", l: "Department", opts: departments },
            { f: "status",     l: "Status",     opts: ["active", "inactive"] },
          ].map(({ f, l, opts }) => (
            <label key={f} className="block">
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">{l}</span>
              <select
                value={form[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
              >
                {opts.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
          <button onClick={onClose} className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
            {saving && <Loader2 size={14} className="animate-spin" />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function StaffDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [activeTab, setTab]   = useState("personal");
  const [editOpen, setEditOpen] = useState(false);
  const [staff, setStaff]     = useState(
    () => mockTeachers.find((t) => t.id === Number(id)) || mockTeachers[0]
  );

  // Per-staff data
  const attendance  = mockStaffAttendance[staff.id] || mockStaffAttendance[1];
  const leaves      = mockLeaveHistory[staff.id]    || mockLeaveHistory[1];
  const salaryRows  = mockSalaryHistory;
  const salary      = mockSalaries.find((s) => s.staffId === staff.id);

  // Attendance stats
  const attStats = useMemo(() => {
    const total   = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent  = attendance.filter((a) => a.status === "absent").length;
    const late    = attendance.filter((a) => a.status === "late").length;
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, pct };
  }, [attendance]);

  // Leave stats
  const leaveStats = useMemo(() => ({
    total:    leaves.length,
    approved: leaves.filter((l) => l.status === "approved").length,
    pending:  leaves.filter((l) => l.status === "pending").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
    totalDays: leaves.filter((l) => l.status === "approved").reduce((acc, l) => acc + l.days, 0),
  }), [leaves]);

  const totalEarned = salaryRows.filter((s) => s.status === "paid").reduce((acc, s) => acc + s.generated, 0);

  const handleSave = (updated) => { setStaff(updated); setEditOpen(false); };

  const printProfile = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>${staff.name} — Staff Profile</title>
      <style>body{font-family:sans-serif;padding:24px;color:#111}h1{font-size:20px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #ddd;padding:8px 12px;font-size:13px}th{background:#f5f5f5;font-weight:600;text-align:left}.muted{color:#666;font-size:13px}</style>
      </head><body>
      <h1>${staff.name}</h1>
      <p class="muted">${staff.empCode} &nbsp;|&nbsp; ${staff.department} &nbsp;|&nbsp; ${staff.designation}</p>
      <table><tr><th>Field</th><th>Value</th></tr>
      ${[["Phone",staff.phone],["Email",staff.email],["Subject",staff.subject||"—"],["Classes",staff.classes?.join(", ")||"—"],["Status",staff.status]].map(([k,v])=>`<tr><td>${k}</td><td>${v||"—"}</td></tr>`).join("")}
      </table>
      <p class="muted" style="margin-top:16px">Printed on ${new Date().toLocaleString()}</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <PageHeader
        title="Staff Profile"
        subtitle={staff.name}
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

      {/* ── Hero card ────────────────────────────────────────────────────── */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold shrink-0">
            {staff.name?.charAt(0)}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">{staff.name}</h2>
              <StatusPill status={staff.status || "active"} styles={staffStatusStyles} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              <span className="flex items-center gap-1"><Hash size={13} />{staff.empCode}</span>
              <span className="flex items-center gap-1"><Briefcase size={13} />{staff.designation}</span>
              <span className="flex items-center gap-1"><Building2 size={13} />{staff.department}</span>
              {staff.phone && <span className="flex items-center gap-1"><Phone size={13} />{staff.phone}</span>}
              {staff.email && <span className="flex items-center gap-1"><Mail size={13} />{staff.email}</span>}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-5 shrink-0">
            <div className="text-center">
              <p className={`text-xl font-bold ${attStats.pct >= 80 ? "text-green-600 dark:text-green-400" : "text-amber-500"}`}>{attStats.pct}%</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Attendance</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">{staff.classes?.length || 0}</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Classes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">{leaveStats.totalDays}</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Leaves Taken</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
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

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div>

        {/* Personal ──────────────────────────────────────────────────────── */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard label="Full Name"    value={staff.name}        icon={User}      />
                <InfoCard label="Employee Code" value={staff.empCode}    icon={Hash}      />
                <InfoCard label="Phone"        value={staff.phone}       icon={Phone}     />
                <InfoCard label="Email"        value={staff.email}       icon={Mail}      />
                <InfoCard label="Status"       value={staff.status}      icon={CheckCircle} />
                <InfoCard label="Join Date"    value={staff.joinDate || "2020-08-15"} icon={Calendar} />
              </div>
            </SectionCard>
            <SectionCard title="Professional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard label="Designation" value={staff.designation} icon={Briefcase}  />
                <InfoCard label="Department"  value={staff.department}  icon={Building2}  />
                <InfoCard label="Subject"     value={staff.subject}     icon={BookOpen}   />
                <InfoCard label="Experience"  value={staff.experience || "5 years"} icon={TrendingUp} />
              </div>
            </SectionCard>
          </div>
        )}

        {/* Classes ───────────────────────────────────────────────────────── */}
        {activeTab === "classes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Assigned Classes">
              {staff.classes?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {staff.classes.map((cls, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                          {cls.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Class {cls}</p>
                          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{staff.subject}</p>
                        </div>
                      </div>
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Session 2025–26</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={GraduationCap} message="No classes assigned" />
              )}
            </SectionCard>

            <SectionCard title="Teaching Summary">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Classes",  value: staff.classes?.length || 0,     color: "text-light-text-primary dark:text-dark-text-primary" },
                  { label: "Subject",        value: staff.subject || "—",            color: "text-accent"                    },
                  { label: "Department",     value: staff.department,                color: "text-purple-600 dark:text-purple-400" },
                  { label: "Designation",    value: staff.designation,               color: "text-blue-600 dark:text-blue-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-lg bg-light-hover dark:bg-dark-hover p-3 text-center">
                    <p className={`text-base font-bold truncate ${color}`}>{value}</p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Attendance ────────────────────────────────────────────────────── */}
        {activeTab === "attendance" && (
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Days",   value: attStats.total,              color: "text-light-text-primary dark:text-dark-text-primary",   bg: "bg-light-card dark:bg-dark-card"  },
                { label: "Present",      value: attStats.present,            color: "text-green-600 dark:text-green-400",                    bg: "bg-green-50 dark:bg-green-950/40" },
                { label: "Absent",       value: attStats.absent,             color: "text-red-500",                                          bg: "bg-red-50 dark:bg-red-950/40"     },
                { label: "Late",         value: attStats.late,               color: "text-amber-600 dark:text-amber-400",                    bg: "bg-amber-50 dark:bg-amber-950/40" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} border border-light-border dark:border-dark-border rounded-xl p-4 text-center`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">{label}</p>
                </div>
              ))}
            </div>

            <SectionCard title="Attendance Record">
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-light-border dark:border-dark-border">
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-24 shrink-0">Attendance Rate</span>
                <div className="flex-1 bg-light-hover dark:bg-dark-hover rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${attStats.pct >= 80 ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${attStats.pct}%` }}
                  />
                </div>
                <span className={`text-sm font-bold w-12 text-right ${attStats.pct >= 80 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {attStats.pct}%
                </span>
              </div>

              {/* Calendar-style dot grid */}
              <div className="flex flex-wrap gap-1.5">
                {attendance.map((a, i) => {
                  const dotColors = {
                    present: "bg-green-500",
                    absent:  "bg-red-500",
                    late:    "bg-amber-500",
                  };
                  return (
                    <div
                      key={i}
                      title={`${a.date}: ${a.status}`}
                      className={`w-8 h-8 rounded-lg ${dotColors[a.status] || "bg-gray-200"} flex items-center justify-center text-white text-xs font-medium cursor-default`}
                    >
                      {new Date(a.date).getDate()}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {[["bg-green-500","Present"],["bg-red-500","Absent"],["bg-amber-500","Late"]].map(([c,l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    <span className={`w-2.5 h-2.5 rounded-full ${c}`} />{l}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Salary ────────────────────────────────────────────────────────── */}
        {activeTab === "salary" && (
          <div className="flex flex-col gap-4">
            {/* Summary row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Basic Salary</p>
                <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Rs. {(salary?.basic || 45000).toLocaleString()}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Total Earned (YTD)</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">Rs. {totalEarned.toLocaleString()}</p>
              </div>
              <div className={`border rounded-xl p-4 ${salary?.status === "paid" ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"}`}>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">This Month</p>
                <p className={`text-xl font-bold ${salary?.status === "paid" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {salary?.status === "paid" ? "Paid" : "Unpaid"}
                </p>
              </div>
            </div>

            <SectionCard title="Salary History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Month","Basic","Present","Absent","Late","Generated","Status"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRows.map((s, i) => (
                      <tr key={i} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">{s.month}</td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">Rs. {s.basic.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-green-600 dark:text-green-400">{s.present}</td>
                        <td className="px-3 py-2.5 text-red-500">{s.absent}</td>
                        <td className="px-3 py-2.5 text-amber-600 dark:text-amber-400">{s.late}</td>
                        <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">Rs. {s.generated.toLocaleString()}</td>
                        <td className="px-3 py-2.5">
                          <StatusPill status={s.status} styles={salaryStatusStyles} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Leaves ────────────────────────────────────────────────────────── */}
        {activeTab === "leaves" && (
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Requests", value: leaveStats.total,    color: "text-light-text-primary dark:text-dark-text-primary", bg: "bg-light-card dark:bg-dark-card" },
                { label: "Approved",       value: leaveStats.approved, color: "text-green-600 dark:text-green-400",                  bg: "bg-green-50 dark:bg-green-950/40" },
                { label: "Pending",        value: leaveStats.pending,  color: "text-amber-600 dark:text-amber-400",                  bg: "bg-amber-50 dark:bg-amber-950/40" },
                { label: "Days Taken",     value: leaveStats.totalDays,color: "text-blue-600 dark:text-blue-400",                    bg: "bg-blue-50 dark:bg-blue-950/40"   },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} border border-light-border dark:border-dark-border rounded-xl p-4 text-center`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">{label}</p>
                </div>
              ))}
            </div>

            <SectionCard title="Leave History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {["Reason","From","To","Days","Status"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((l) => (
                      <tr key={l.id} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary">{l.reason}</td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">{l.from}</td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">{l.to}</td>
                        <td className="px-3 py-2.5 text-light-text-secondary dark:text-dark-text-secondary">{l.days}</td>
                        <td className="px-3 py-2.5">
                          <StatusPill status={l.status} styles={leaveStatusStyles} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Certificates ──────────────────────────────────────────────────── */}
        {activeTab === "certificates" && (
          <SectionCard title="Education & Certificates">
            {mockCertificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockCertificates.map((cert) => {
                  const typeColors = {
                    Degree:        "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
                    Certification: "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
                    Training:      "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
                  };
                  return (
                    <div key={cert.id} className={`rounded-xl border p-4 ${typeColors[cert.type] || "border-light-border"}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{cert.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[cert.type]}`}>{cert.type}</span>
                      </div>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1.5">
                        <GraduationCap size={11} /> {cert.institute}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary flex items-center gap-1.5 mt-1">
                        <Calendar size={11} /> {cert.year}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={Award} message="No certificates on record" />
            )}
          </SectionCard>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditModal staff={staff} onClose={() => setEditOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}

export default StaffDetail;